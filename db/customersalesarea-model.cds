using db.BusinessPartners as BusinessPartners from './businesspartner-model.cds';
using db.SalesOrganizations as SalesOrganizations from './salesorganization-model';
using db.DistributionChannels as DistributionChannels from './distributionchannel-model';
using db.Divisions as Divisions from './division-model';
using db.SalesGroups as SalesGroups from './salesgroup-model';
using db.SalesOffices as SalesOffices from './salesoffice-model';
using db.SalesDistricts as SalesDistricts from './salesdistrict-model';
using db.CustomerPaymentTerms as CustomerPaymentTerms from './customerpaymentterms-model';

namespace db;

entity CustomerSalesAreas {
    key businessPartner     : Association to BusinessPartners;
    key salesOrganization   : Association to SalesOrganizations;
    key distributionChannel : Association to DistributionChannels;
    key division            : Association to Divisions;
        salesGroup          : Association to SalesGroups;
        salesOffice         : Association to SalesOffices;
        salesDistrict       : Association to SalesDistricts;
        customerPaymentTerm : Association to CustomerPaymentTerms;
}
