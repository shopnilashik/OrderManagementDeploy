using db.Countries as Countries from './country-model';

namespace db;

entity Regions {
    key ID      : String not null;
        name    : localized String;
        country : Association to Countries;
}
