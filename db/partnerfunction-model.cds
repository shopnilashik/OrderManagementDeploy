using db.CustSalesPartnerFuncs as CustSalesPartnerFuncs from './custsalespartnerfunc-model';

namespace db;

entity PartnerFunctions {
    key ID                    : String not null;
        name                  : localized String;
        // custSalesPartnerFuncs : Association to many CustSalesPartnerFuncs
        //                             on custSalesPartnerFuncs.partnerFunction = $self;
}
