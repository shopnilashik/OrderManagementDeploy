const e = require("express");

module.exports = (srv) => {
    srv.after("READ", "*", async (data, req) => {
        let locale = "it";
        if (req.user && req.user.locale) {
            const tempLocale = req.user.locale.toLowerCase();
            const defaultLocales = ["en", "de", "it"];
            // checking the locale, is exist in the system.
            if (defaultLocales.includes(tempLocale)) locale = tempLocale;
        }
        data.map((item, i) => {
            if (item.texts && item.texts.length) {
                const _find = item.texts.find((text) => text.locale == locale);

                if (_find) {
                    delete _find.ID;
                    delete _find.locale;
                    data[i] = {...data[i], ..._find};
                } else {
                    if(locale != "it") {
                        const fallbackText = item.texts.find(text => text.locale == "it");
                        if(fallbackText){
                            delete fallbackText.ID;
                            delete fallbackText.locale;
                            data[i]={...data[i], ...fallbackText};
                        }
                    }
                    
                }
                delete data[i].texts;
            }
        });

        return data;
    });
};
