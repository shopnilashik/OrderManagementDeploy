using db.CustomerSalesAreas as customerSalesAreas from './customersalesarea-model';
using db.PartnerFunctions as PartnerFunctions from './partnerfunction-model';
using db.BusinessPartners as BusinessPartners from './businesspartner-model';

namespace db;

entity CustSalesPartnerFuncs {
    key customerSalesArea : Association to customerSalesAreas;
    key partnerCounter    : String not null;
    key partnerFunction   : Association to PartnerFunctions;
        BPPartner         : Association to BusinessPartners;
}
