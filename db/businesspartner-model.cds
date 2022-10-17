using db.Countries as Countries from './country-model';
using db.Regions as Regions from './region-model';
using db.CustomerSalesAreas as CustomerSalesAreas from './customersalesarea-model';
using db.CustSalesPartnerFuncs as CustSalesPartnerFuncs from './custsalespartnerfunc-model';

namespace db;

entity BusinessPartners {
    key ID                    : String not null;
        name                  : String not null;
        streetName            : String;
        cityName              : String;
        postalCode            : String;
        vatRegistration       : String;
        country               : Association to Countries;
        region                : Association to Regions;
        // customerSalesAreas    : Association to many CustomerSalesAreas
        //                             on customerSalesAreas.businessPartner = $self;
        // custSalesPartnerFuncs : Association to many CustSalesPartnerFuncs
        //                             on custSalesPartnerFuncs.BPPartner = $self;
}
