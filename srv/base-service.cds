using db.BusinessPartners as businessPartners from '../db/businesspartner-model';
using db.Countries as countries from '../db/country-model';
using db.CustomerPaymentTerms as customerPaymentTerms from '../db/customerpaymentterms-model';
using db.CustomerSalesAreas as customerSalesAreas from '../db/customersalesarea-model';
using db.DistributionChannels as distributionChannels from '../db/distributionchannel-model';
using db.Divisions as divisions from '../db/division-model';
using db.OrderTypes as orderTypes from '../db/ordertype-model';
using db.PartnerFunctions as partnerFunctions from '../db/partnerfunction-model';
using db.Regions as regions from '../db/region-model';
using db.SalesDistricts as salesDistricts from '../db/salesdistrict-model';
using db.SalesGroups as salesGroups from '../db/salesgroup-model';
using db.SalesOffices as salesOffices from '../db/salesoffice-model';
using db.SalesOrganizations as salesOrganizations from '../db/salesorganization-model';
using db.CustSalesPartnerFuncs as custSalesPartnerFuncs from '../db/custsalespartnerfunc-model';
using db.Products as products from '../db/product-model';
using db.ProductTypes as productTypes from '../db/producttype-model';
using db.ProductHierarchies as productHierarchies from '../db/producthierarchies-model';
using db.UnitsOfMeasure as unitsOfMeasure from '../db/unitofmasure-model';
using db.NoteTypes as noteTypes from '../db/notetype-model';

service BaseService {
    entity BusinessPartners @readonly          as projection on businessPartners;
    entity Countries @readonly                 as projection on countries;
    entity CustomerPaymentTerms @readonly      as projection on customerPaymentTerms;
    entity CustomerSalesAreas @readonly        as projection on customerSalesAreas;
    entity DistributionChannels @readonly      as projection on distributionChannels;
    entity Divisions @readonly                 as projection on divisions;
    entity OrderTypes @readonly                as projection on orderTypes;
    entity PartnerFunctions @readonly          as projection on partnerFunctions;
    entity Regions @readonly                   as projection on regions;
    entity SalesDistricts @readonly            as projection on salesDistricts;
    entity SalesGroups @readonly               as projection on salesGroups;
    entity SalesOffices @readonly              as projection on salesOffices;
    entity SalesOrganizations @readonly        as projection on salesOrganizations;
    entity CustSalesPartnerFuncs @readonly     as projection on custSalesPartnerFuncs;
    entity NoteTypes @readonly                 as projection on noteTypes;
    entity Products @readonly                  as projection on products;
    entity ProductTypes @readonly              as projection on productTypes;
    entity ProductHierarchies @readonly        as projection on productHierarchies;
    entity UnitsOfMeasure @readonly            as projection on unitsOfMeasure;

    view CustomersView as select from CustomerSalesAreas as CSA
        left join BusinessPartners as BP on CSA.businessPartner.ID = BP.ID

        left join SalesOrganizations as SO on CSA.salesOrganization.ID = SO.ID
        left join salesOrganizations.texts as SO_texts on SO_texts.ID = SO.ID and SO_texts.locale=$user.locale

        left join DistributionChannels as DC on CSA.distributionChannel.ID = DC.ID
        left join distributionChannels.texts as DC_texts on DC_texts.ID = DC.ID and DC_texts.locale=$user.locale

        left join Divisions as D on CSA.division.ID = D.ID
        left join divisions.texts as D_texts on D_texts.ID = D.ID and D_texts.locale=$user.locale

        left join countries.texts as country_texts on BP.country.ID = country_texts.ID and country_texts.locale=$user.locale
        left join regions.texts as region_texts on BP.region.ID = region_texts.ID and region_texts.locale=$user.locale
    {
        Key CSA.businessPartner,
        Key CSA.salesOrganization,
        Key CSA.distributionChannel,
        Key CSA.division,
        CSA.salesGroup,
        CSA.salesOffice,
        CSA.salesDistrict,
        CSA.customerPaymentTerm,
        BP.name,
        BP.cityName,
        BP.vatRegistration,
        region_texts.name as regionName,
        country_texts.name as countryName,
        SO_texts.name as salesOrganizationName,
        DC_texts.name as distributionChannelName,
        D_texts.name as divisionName
    };

    view CustomerSalesPartenFunctionsView as select from CustSalesPartnerFuncs as CSPF
        inner join CustomerSalesAreas as CSA on CSPF.customerSalesArea.businessPartner.ID = CSA.businessPartner.ID and CSPF.customerSalesArea.salesOrganization.ID = CSA.salesOrganization.ID and CSPF.customerSalesArea.distributionChannel.ID = CSA.distributionChannel.ID and CSPF.customerSalesArea.division.ID = CSA.division.ID
        left join BusinessPartners as BP on CSPF.BPPartner.ID = BP.ID

        left join PartnerFunctions as PF on CSPF.partnerFunction.ID = PF.ID
        left join partnerFunctions.texts as partnerFunction_texts on PF.ID = partnerFunction_texts.ID and partnerFunction_texts.locale=$user.locale

        left join countries.texts as country_texts on BP.country.ID = country_texts.ID and country_texts.locale=$user.locale
        left join regions.texts as region_texts on BP.region.ID = region_texts.ID and region_texts.locale=$user.locale
    {
        Key CSPF.customerSalesArea.businessPartner.ID as businessPartner_ID,
        Key CSPF.customerSalesArea.salesOrganization.ID as salesOrganization_ID,
        Key CSPF.customerSalesArea.distributionChannel.ID as distributionChannel_ID,
        Key CSPF.customerSalesArea.division.ID as division_ID,
        Key CSPF.partnerFunction,
        CSPF.BPPartner,
        partnerFunction_texts.name as partnerFunctionName,
        BP.name as businessPartnerName,
        BP.streetName as businessPartnerStreetName,
        BP.cityName as businessPartnerCityName,
        BP.postalCode as businessPartnerPostalCode,
        BP.region,
        BP.country,
        region_texts.name as regionName,
        country_texts.name as countryName
    };
    view ProductsView as select from Products as P
        left join ProductTypes as PT on P.productType.ID = PT.ID
        left join ProductHierarchies as PH on P.productHierarchy.ID = PH.ID
        left join UnitsOfMeasure as UM on P.salesUnitOfMeasure.ID = UM.ID

        left join products.texts as P_texts on P.ID = P_texts.ID and P_texts.locale = $user.locale

        left join productTypes.texts as PT_texts on PT.ID = PT_texts.ID and PT_texts.locale = $user.locale

        left join productHierarchies.texts as PH_texts on PH.ID = PH_texts.ID and PH_texts.locale = $user.locale

        left join unitsOfMeasure.texts as UM_texts on UM.ID = UM_texts.ID and UM_texts.locale = $user.locale
    {
        Key P.ID as ID,
        P_texts.name as productName,
        P.attribute1,
        P.attribute2,
        P.attribute3,
        P.attribute4,
        P.attribute5,
        P.productType,
        PT_texts.name as productTypeName,
        P.productHierarchy,
        PH_texts.name1 as productHierarchyName1,
        PH_texts.name2 as productHierarchyName2,
        PH_texts.name3 as productHierarchyName3,
        PH_texts.name4 as productHierarchyName4,
        PH_texts.name5 as productHierarchyName5,
        PH_texts.name6 as productHierarchyName6,
        PH_texts.name7 as productHierarchyName7,
        PH_texts.name8 as productHierarchyName8,
        PH_texts.name9 as productHierarchyName9,
        UM.ID as unitofmasure_ID,
        UM_texts.name as unitsOfMeasureName
    };
}
