const JobSchedulerClient = require("@sap/jobs-client");
const xsenv = require("@sap/xsenv");
class CustomService extends cds.ApplicationService {
    init() {
        this.on("importBaseData", (req) => {
            req.res
                .status(202)
                .send("Request accepted. Job is now running in background.");
            this.runImportJob(req, true);
        });

        this.on("importBaseDataLocally", async (req) => {
            return await this.runImportJob(req, false);
        });

        this.on("importOrderType", (req) => {
            this.runOrderTypeImportJob(req, true);
        });
    }

    async importToDB(req, db, entities, isCloud, logs) {
        for (const [entity, value] of Object.entries(entities)) {
            const tempLogs = { total: 0, inserted: 0, updated: 0 };
            logs.errors[entity] = [];
            let isImportSuccessfull = false;
            const primaryKey = Object.keys(value.primaryKeys)[0];

            const tx = db.tx();
            try {
                const data = value.data;
                tempLogs.total = data.length;

                await Promise.all(
                    data.map(async (item) => {
                        const conditions = {};
                        const isUnique = value.noDataKey;
                        Object.keys(value.primaryKeys).map((key) => {
                            const _apiKey = value.primaryKeys[key];
                            if (isUnique) conditions[key] = item;
                            if (item.hasOwnProperty(_apiKey)) {
                                conditions[key] = _apiKey == "Language" ? item[_apiKey].toLowerCase() : item[_apiKey];
                            }
                        });

                        const columnsWithValues = {};

                        Object.keys(value.fields).map((column) => {
                            const _apiColumn = value.fields[column];
                            if (item.hasOwnProperty(_apiColumn)) {
                                columnsWithValues[column] = _apiColumn == "Language" ? item[_apiColumn].toLowerCase() : item[_apiColumn];
                            }

                            if (isUnique) {
                                if (column == "ID")
                                    columnsWithValues[column] = item;
                                else columnsWithValues[column] = "";
                            }
                        });

                        /* checking if this entry is exist in primary table
                         * for localized entity only
                         */
                        let existingDataInPrimaryEntity = true;
                        const isLocalizedEntity = entity.match("_texts");
                        if (isLocalizedEntity) {
                            const primaryEntity = entity.replace("_texts", "");
                            try {
                                const _primaryKey = Object.keys(entities[primaryEntity].primaryKeys)[0];
                                const _conditions = { ...conditions };
                                delete _conditions.locale;
                                const query = SELECT.one(primaryEntity).where(_conditions).columns(_primaryKey);
                                existingDataInPrimaryEntity = await cds.run(query);
                            } catch (error) {
                                logs.errors[entity].push(error.originalMessage);
                            }
                        }

                        if (existingDataInPrimaryEntity) {
                            let existingData;
                            try {
                                const query = SELECT.one(entity).where(conditions).columns(primaryKey);
                                existingData = await cds.run(query);
                            } catch (error) {
                                logs.errors[entity].push(error.originalMessage);
                            }

                            if (existingData && existingData.hasOwnProperty(primaryKey)) {
                                try {
                                    const updateQuery = UPDATE(entity).with(columnsWithValues).where(conditions);
                                    await cds.run(updateQuery);
                                    tempLogs.updated++;
                                } catch (error) {
                                    logs.errors[entity].push(
                                        error.originalMessage
                                    );
                                }
                            } else {
                                try {
                                    const insertQuery = INSERT.into(entity).entries(columnsWithValues);
                                    await cds.run(insertQuery);
                                    tempLogs.inserted++;
                                } catch (error) {
                                    logs.errors[entity].push(error.originalMessage);
                                }
                            }
                        }
                    })
                );
                tx.commit();
                isImportSuccessfull = true;
            } catch (entityError) {
                const response = entityError?.reason?.response;
                logs.errors[entity].push({
                    msg: entityError?.reason?.message,
                    status: response?.status,
                    statusText: response?.statusText,
                });
                await tx.rollback();
            }

            if (isImportSuccessfull) logs[entity] = tempLogs;
        }

        if (isCloud && req.headers.hasOwnProperty("x-sap-job-id")) {
            this.updateJobStatus(req, logs)
                .then(() => console.log("Successfully updated the job status"))
                .catch((error) =>
                    console.log(
                        `Error occured while calling REST API of JobScheduler. Errors => ${error}`
                    )
                );
        } else {
            console.log("Completed");
            const returnData = { msg: JSON.stringify(logs) };
            return returnData;
        }

        return { msg: JSON.stringify(entities) };
    }

    async runImportJob(req, isCloud) {
        const db = await cds.connect.to("db");
        const apiEntities = {
            I_Customer: {
                data: [],
                columns:
                    "Customer,CustomerName,VATRegistration,StreetName,PostalCode,Region,Country,CityName",
            },
            I_Supplier: {
                data: [],
                columns:
                    "Supplier,SupplierName,VATRegistration,StreetName,PostalCode,Region,Country,CityName",
            },
            I_SalesOrganizationText: {
                data: [],
                baseTable: "db_SalesOrganizations_texts",
                columns: "SalesOrganization,Language,SalesOrganizationName",
            },
            I_DistributionChannelText: {
                data: [],
                baseTable: "db_DistributionChannels_texts",
                columns: "DistributionChannel,Language,DistributionChannelName",
            },
            I_DivisionText: {
                data: [],
                baseTable: "db_Divisions_texts",
                columns: "Division,Language,DivisionName",
            },
            I_SalesGroupText: {
                data: [],
                baseTable: "db_SalesGroups_texts",
                columns: "SalesGroup,Language,SalesGroupName",
            },
            I_SalesOfficeText: {
                data: [],
                baseTable: "db_SalesOffices_texts",
                columns: "SalesOffice,Language,SalesOfficeName",
            },
            I_SalesDistrictText: {
                data: [],
                baseTable: "db_SalesDistricts_texts",
                columns: "SalesDistrict,Language,SalesDistrictName",
            },
            I_CustomerPaymentTermsText: {
                data: [],
                baseTable: "db_CustomerPaymentTerms_texts",
                columns:
                    "CustomerPaymentTerms,Language,CustomerPaymentTermsName",
            },
            I_CustomerSalesArea: {
                data: [],
                baseTable: "db_CustomerSalesAreas",
                columns:
                    "Customer,SalesOrganization,DistributionChannel,Division,SalesGroup,SalesOffice,SalesDistrict,PaymentTerms",
            },
            Z_SFA_PARTNERFUNCTIONTEXT: {
                data: [],
                baseTable: "db_PartnerFunctions_texts",
                columns: "PartnerFunction,Language,PartnerFunctionName",
                urlString:
                    "/odata/sap/Z_SFA_PARTNERFUNCTIONTEXT_CDS/Z_SFA_PARTNERFUNCTIONTEXT",
            },
            I_CustSalesPartnerFunc: {
                data: [],
                baseTable: "db_CustSalesPartnerFuncs",
                columns:
                    "Customer,SalesOrganization,DistributionChannel,Division,PartnerCounter,PartnerFunction,BPCustomerNumber",
                urlString:
                    "/odata/sap/Z_SFA_CUSTSLSPARTFUNC_CDS/Z_SFA_CustSlsPartFunc",
            },
            Z_SFA_PRODUCT: {
                data: [],
                columns:
                    "Product,Product_Text,ProductType,ProductType_Text,ProductHierarchy",
                urlString: "/odata/sap/Z_SFA_PRODUCT_CDS/Z_SFA_PRODUCT",
            },
            I_ProductTypeText: {
                data: [],
                columns: "ProductType,Language,MaterialTypeName",
                baseTable: "db_ProductTypes_texts",
            },
            I_ProductHierarchyText: {
                data: [],
                columns: "ProductHierarchy,Language,ProductHierarchyText",
            },
            I_ProductSalesDelivery: {
                data: [],
                columns: "Product,SalesMeasureUnit",
            },
            I_UnitOfMeasureText: {
                data: [],
                columns: "UnitOfMeasure,Language,UnitOfMeasureName",
                baseTable: "db_UnitsOfMeasure_texts",
            },
            I_ProductText: {
                data: [],
                columns: "Product,Language,ProductName",
                baseTable: "db_Products_texts",
            },
            I_Country: {
                data: [],
                columns: "Country,Country_Text",
                urlString: "/odata/sap/Z_SFA_PRODUCT_CDS/I_Country",
            },
            I_Region: {
                data: [],
                columns: "Country,Region,Region_Text",
                urlString: "/odata/sap/Z_SFA_PRODUCT_CDS/I_Region",
            },
            I_CountryText: {
                data: [],
                columns: "Country,Language,CountryName",
                baseTable: "db_Countries_texts",
            },
            I_RegionText: {
                data: [],
                columns: "Country,Language,Region,RegionName",
                baseTable: "db_Regions_texts",
            },
        };

        const entities = {
            db_Countries: {
                primaryKeys: {
                    ID: "Country",
                },
                fields: {
                    ID: "Country",
                    name: "CountryName",
                },
                data: [],
            },
            db_Regions: {
                primaryKeys: {
                    ID: "Region",
                },
                fields: {
                    ID: "Region",
                    name: "RegionName",
                    country_ID: "Country",
                },
                data: [],
            },

            db_SalesOrganizations: {
                noDataKey: true,
                primaryKeys: {
                    ID: "ID",
                },
                fields: {
                    ID: "ID",
                    name: "name",
                },
                data: [],
            },
            db_DistributionChannels: {
                noDataKey: true,
                primaryKeys: {
                    ID: "ID",
                },
                fields: {
                    ID: "ID",
                    name: "name",
                },
                data: [],
            },
            db_Divisions: {
                noDataKey: true,
                primaryKeys: {
                    ID: "ID",
                },
                fields: {
                    ID: "ID",
                    name: "name",
                },
                data: [],
            },
            db_SalesGroups: {
                noDataKey: true,
                primaryKeys: {
                    ID: "ID",
                },
                fields: {
                    ID: "ID",
                    name: "name",
                },
                data: [],
            },
            db_SalesOffices: {
                noDataKey: true,
                primaryKeys: {
                    ID: "ID",
                },
                fields: {
                    ID: "ID",
                    name: "name",
                },
                data: [],
            },
            db_SalesDistricts: {
                noDataKey: true,
                primaryKeys: {
                    ID: "ID",
                },
                fields: {
                    ID: "ID",
                    name: "name",
                },
                data: [],
            },
            db_CustomerPaymentTerms: {
                noDataKey: true,
                primaryKeys: {
                    ID: "ID",
                },
                fields: {
                    ID: "ID",
                    name: "name",
                },
                data: [],
            },
            db_PartnerFunctions: {
                noDataKey: true,
                primaryKeys: {
                    ID: "PartnerFunction",
                },
                fields: {
                    ID: "PartnerFunction",
                    Name: "PartnerFunction_Text",
                },
                data: [],
            },
            db_BusinessPartners: {
                primaryKeys: {
                    ID: "Customer",
                },
                fields: {
                    ID: "Customer",
                    name: "CustomerName",
                    streetName: "StreetName",
                    cityName: "CityName",
                    postalCode: "PostalCode",
                    region_ID: "Region",
                    country_ID: "Country",
                    vatRegistration: "VATRegistration",
                },
                data: [],
            },
            db_UnitsOfMeasure: {
                noDataKey: true,
                primaryKeys: {
                    ID: "UnitOfMeasure",
                },
                fields: {
                    ID: "UnitOfMeasure",
                    name: "UnitOfMeasureName",
                },
                data: [],
            },

            db_ProductHierarchies: {
                primaryKeys: {
                    ID: "Product",
                },
                fields: {
                    ID: "ID",
                    name1: "name1",
                    name2: "name2",
                    name3: "name3",
                    name4: "name4",
                    name5: "name5",
                    name6: "name6",
                    name7: "name7",
                    name8: "name8",
                    name9: "name9",
                },
                data: [],
            },

            db_ProductTypes: {
                noDataKey: true,
                primaryKeys: {
                    ID: "ProductType",
                },
                fields: {
                    ID: "ProductType",
                    name: "ProductType_Text",
                },
                data: [],
            },

            db_Products: {
                primaryKeys: {
                    ID: "Product",
                },
                fields: {
                    ID: "Product",
                    name: "Product_Text",
                    productType_ID: "ProductType",
                    productHierarchy_ID: "ProductHierarchy",
                    salesUnitOfMeasure_ID: "salesUnitOfMeasure",
                },
                data: [],
            },
            db_SalesOrganizations_texts: {
                primaryKeys: {
                    ID: "SalesOrganization",
                    locale: "Language",
                },
                fields: {
                    ID: "SalesOrganization",
                    locale: "Language",
                    name: "SalesOrganizationName",
                },
                data: [],
            },
            db_DistributionChannels_texts: {
                primaryKeys: {
                    ID: "DistributionChannel",
                    locale: "Language",
                },
                fields: {
                    ID: "DistributionChannel",
                    locale: "Language",
                    name: "DistributionChannelName",
                },
                data: [],
            },
            db_Divisions_texts: {
                primaryKeys: {
                    ID: "Division",
                    locale: "Language",
                },
                fields: {
                    ID: "Division",
                    locale: "Language",
                    name: "DivisionName",
                },
                data: [],
            },
            db_SalesGroups_texts: {
                primaryKeys: {
                    ID: "SalesGroup",
                    locale: "Language",
                },
                fields: {
                    ID: "SalesGroup",
                    locale: "Language",
                    name: "SalesGroupName",
                },
                data: [],
            },
            db_SalesOffices_texts: {
                primaryKeys: {
                    ID: "SalesOffice",
                    locale: "Language",
                },
                fields: {
                    ID: "SalesOffice",
                    locale: "Language",
                    name: "SalesOfficeName",
                },
                data: [],
            },
            db_SalesDistricts_texts: {
                primaryKeys: {
                    ID: "SalesDistrict",
                    locale: "Language",
                },
                fields: {
                    ID: "SalesDistrict",
                    locale: "Language",
                    name: "SalesDistrictName",
                },
                data: [],
            },
            db_CustomerPaymentTerms_texts: {
                primaryKeys: {
                    ID: "CustomerPaymentTerms",
                    locale: "Language",
                },
                fields: {
                    ID: "CustomerPaymentTerms",
                    locale: "Language",
                    name: "CustomerPaymentTermsName",
                },
                data: [],
            },
            db_PartnerFunctions_texts: {
                primaryKeys: {
                    ID: "PartnerFunction",
                    locale: "Language",
                },
                fields: {
                    ID: "PartnerFunction",
                    locale: "Language",
                    name: "PartnerFunctionName",
                },
                data: [],
            },
            db_CustomerSalesAreas: {
                primaryKeys: {
                    businessPartner_ID: "Customer",
                    salesOrganization_ID: "SalesOrganization",
                    distributionChannel_ID: "DistributionChannel",
                    division_ID: "Division",
                },
                fields: {
                    businessPartner_ID: "Customer",
                    salesOrganization_ID: "SalesOrganization",
                    distributionChannel_ID: "DistributionChannel",
                    division_ID: "Division",
                    salesGroup_ID: "SalesGroup",
                    salesOffice_ID: "SalesOffice",
                    salesDistrict_ID: "SalesDistrict",
                    customerPaymentTerm_ID: "PaymentTerms",
                },
                data: [],
            },
            db_CustSalesPartnerFuncs: {
                primaryKeys: {
                    customerSalesArea_businessPartner_ID: "Customer",
                    customerSalesArea_salesOrganization_ID: "SalesOrganization",
                    customerSalesArea_distributionChannel_ID:
                        "DistributionChannel",
                    customerSalesArea_division_ID: "Division",
                    partnerCounter: "PartnerCounter",
                    partnerFunction_ID: "PartnerFunction",
                },
                fields: {
                    customerSalesArea_businessPartner_ID: "Customer",
                    customerSalesArea_salesOrganization_ID: "SalesOrganization",
                    customerSalesArea_distributionChannel_ID:
                        "DistributionChannel",
                    customerSalesArea_division_ID: "Division",
                    partnerCounter: "PartnerCounter",
                    partnerFunction_ID: "PartnerFunction",
                    BPPartner_ID: "BPCustomerNumber",
                },
                data: [],
            },
            db_Products_texts: {
                primaryKeys: {
                    ID: "Product",
                    locale: "Language",
                },
                fields: {
                    ID: "Product",
                    locale: "Language",
                    name: "ProductName",
                },
                data: [],
            },

            db_UnitsOfMeasure_texts: {
                primaryKeys: {
                    ID: "UnitOfMeasure",
                    locale: "Language",
                },
                fields: {
                    ID: "UnitOfMeasure",
                    locale: "Language",
                    name: "UnitOfMeasureName",
                },
                data: [],
            },

            db_ProductHierarchies_texts: {
                primaryKeys: {
                    ID: "ProductHierarchy",
                    locale: "Language",
                },
                fields: {
                    ID: "ID",
                    locale: "Language",
                    name1: "name1",
                    name2: "name2",
                    name3: "name3",
                    name4: "name4",
                    name5: "name5",
                    name6: "name6",
                    name7: "name7",
                    name8: "name8",
                    name9: "name9",
                },
                data: [],
            },

            db_ProductTypes_texts: {
                primaryKeys: {
                    ID: "ProductType",
                    locale: "Language",
                },
                fields: {
                    ID: "ProductType",
                    locale: "Language",
                    name: "MaterialTypeName",
                },
                data: [],
            },

            db_Countries_texts: {
                primaryKeys: {
                    ID: "Country",
                    locale: "Language",
                },
                fields: {
                    ID: "Country",
                    locale: "Language",
                    name: "CountryName",
                },
                data: [],
            },

            db_Regions_texts: {
                primaryKeys: {
                    ID: "Region",
                    locale: "Language",
                },
                fields: {
                    ID: "Region",
                    name: "RegionName",
                    locale: "Language",
                },
                data: [],
            },
        };

        const logs = { errors: {} };
        const dergaApi = await cds.connect.to("derga_api"); // connected to derga via destination

        // get all data from remote service
        const count = 10000;
        let commonUrlString =
            "/odata4/sap/zsfa_binding/srvd_a2x/sap/zsfa/0001/";

        await Promise.all(
            Object.keys(apiEntities).map(async (apiEntity) => {
                const value = apiEntities[apiEntity];
                try {
                    const urlString = value.urlString
                        ? value.urlString
                        : `${commonUrlString}${apiEntity}`;
                    const response = await dergaApi
                        .tx(req)
                        .get(
                            `${urlString}?$format=json&$top=${count}&$select=${value.columns}`
                        );

                    if (value.urlString) value.data = response?.d?.results;
                    else value.data = response?.value;

                    if (value.baseTable) {
                        entities[value.baseTable].data = [...value.data];
                    }
                } catch (err) {
                    console.log("err", err);
                }
            })
        );

        /* get all customers from I_Customer & I_supplier */
        apiEntities.I_Supplier.data.map((supplier) => {
            const _find = apiEntities.I_Customer.data.map(
                (customer) => supplier.Supplier == customer.Customer
            );
            if (!_find) {
                apiEntities.I_Customer.data.push({
                    Customer: supplier.Supplier,
                    CustomerName: supplier.SupplierName,
                    ...supplier,
                });
            }
        });

        entities.db_BusinessPartners.data = [...apiEntities.I_Customer.data];

        const uniqueSalesOrganizations = [];
        const uniqueDistributionChannels = [];
        const uniqueDivisions = [];
        const uniqueSalesGroups = [];
        const uniqueSalesOffices = [];
        const uniqueSalesDistricts = [];
        const uniqueCustomerPaymentTerms = [];
        const uniqueUnitOfMeasure = [];
        const uniqueProductHierarchy = [];
        const uniqueProductType = [];
        const uniqueCoutries = [];
        const uniqueRegions = [];

        apiEntities.I_CustomerSalesArea.data.map((item) => {
            const salesOrganization = item.SalesOrganization;
            if (
                salesOrganization != "" &&
                !uniqueSalesOrganizations.includes(salesOrganization)
            ) {
                uniqueSalesOrganizations.push(salesOrganization);
            }

            const distributionChannel = item.DistributionChannel;
            if (
                distributionChannel != "" &&
                !uniqueDistributionChannels.includes(distributionChannel)
            )
                uniqueDistributionChannels.push(distributionChannel);

            const division = item.Division;
            if (division != "" && !uniqueDivisions.includes(division))
                uniqueDivisions.push(division);

            const salesGroup = item.SalesGroup;
            if (salesGroup != "" && !uniqueSalesGroups.includes(salesGroup))
                uniqueSalesGroups.push(salesGroup);

            const salesOffice = item.SalesOffice;
            if (salesOffice != "" && !uniqueSalesOffices.includes(salesOffice))
                uniqueSalesOffices.push(salesOffice);

            const salesDistrict = item.SalesDistrict;
            if (
                salesDistrict != "" &&
                !uniqueSalesDistricts.includes(salesDistrict)
            )
                uniqueSalesDistricts.push(salesDistrict);

            const paymentTerms = item.PaymentTerms;
            if (
                paymentTerms != "" &&
                !uniqueCustomerPaymentTerms.includes(paymentTerms)
            )
                uniqueCustomerPaymentTerms.push(paymentTerms);
        });

        /* get all unique SalesOrganization from SalesOrganizationText  */
        apiEntities.I_SalesOrganizationText.data.map((item) => {
            const _item = item.SalesOrganization;
            if (_item != "" && !uniqueSalesOrganizations.includes(_item))
                uniqueSalesOrganizations.push(_item);
        });
        entities.db_SalesOrganizations.data = uniqueSalesOrganizations;

        /* get all unique DistributionChannel from DistributionChannelText  */
        apiEntities.I_DistributionChannelText.data.map((item) => {
            const _item = item.DistributionChannel;
            if (_item != "" && !uniqueDistributionChannels.includes(_item))
                uniqueDistributionChannels.push(_item);
        });
        entities.db_DistributionChannels.data = uniqueDistributionChannels;

        /* get all unique Division from DivisionText  */
        apiEntities.I_DivisionText.data.map((item) => {
            const _item = item.Division;
            if (_item != "" && !uniqueDivisions.includes(_item))
                uniqueDivisions.push(_item);
        });
        entities.db_Divisions.data = uniqueDivisions;

        /* get all unique SalesGroup from SalesGroupText  */
        apiEntities.I_SalesGroupText.data.map((item) => {
            const _item = item.SalesGroup;
            if (_item != "" && !uniqueSalesGroups.includes(_item))
                uniqueSalesGroups.push(_item);
        });
        entities.db_SalesGroups.data = uniqueSalesGroups;

        /* get all unique SalesOffice from SalesOfficeText  */
        apiEntities.I_SalesOfficeText.data.map((item) => {
            const _item = item.SalesOffice;
            if (_item != "" && !uniqueSalesOffices.includes(_item))
                uniqueSalesOffices.push(_item);
        });
        entities.db_SalesOffices.data = uniqueSalesOffices;

        /* get all unique SalesDistrict from SalesDistrictText  */
        apiEntities.I_SalesDistrictText.data.map((item) => {
            const _item = item.SalesDistrict;
            if (_item != "" && !uniqueSalesDistricts.includes(_item))
                uniqueSalesDistricts.push(_item);
        });
        entities.db_SalesDistricts.data = uniqueSalesDistricts;

        /* get all unique CustomerPaymentTerms from CustomerPaymentTermsText  */
        apiEntities.I_CustomerPaymentTermsText.data.map((item) => {
            const _item = item.PaymentTerms;
            if (_item != "" && !uniqueCustomerPaymentTerms.includes(_item))
                uniqueCustomerPaymentTerms.push(_item);
        });
        entities.db_CustomerPaymentTerms.data = uniqueCustomerPaymentTerms;

        /* get all unique PartnerFunction from I_CustSalesPartnerFunc & Z_SFA_PARTNERFUNCTIONTEXT */
        const uniquePartnerFunctions = [];
        apiEntities.I_CustSalesPartnerFunc.data.map((item) => {
            const _item = item.PartnerFunction;
            if (_item != "" && !uniquePartnerFunctions.includes(_item))
                uniquePartnerFunctions.push(_item);
        });

        apiEntities.Z_SFA_PARTNERFUNCTIONTEXT.data.map((item) => {
            const _item = item.PartnerFunction;
            if (_item != "" && !uniquePartnerFunctions.includes(_item))
                uniquePartnerFunctions.push(_item);
        });
        entities.db_PartnerFunctions.data = uniquePartnerFunctions;

        apiEntities.Z_SFA_PRODUCT.data.map((data, i) => {
            const existingData = apiEntities.I_ProductSalesDelivery.data.find(
                (item) => item.Product == data.Product
            );
            if (existingData)
                apiEntities.Z_SFA_PRODUCT.data[i].salesUnitOfMeasure =
                    existingData.SalesMeasureUnit;
        });

        entities.db_Products.data = apiEntities.Z_SFA_PRODUCT.data;

        entities.db_Products.data.map((item) => {
            const productType = item.ProductType;
            if (productType != "" && !uniqueProductType.includes(productType))
                uniqueProductType.push(productType);

            const productHierarchy = item.ProductHierarchy;
            if (
                productHierarchy != "" &&
                !uniqueProductHierarchy.includes(productHierarchy)
            )
                uniqueProductHierarchy.push(productHierarchy);
        });

        apiEntities.I_ProductSalesDelivery.data.map((item) => {
            if (
                item.UnitOfMeasure != "" &&
                !uniqueUnitOfMeasure.includes(item.UnitOfMeasure)
            ) {
                uniqueUnitOfMeasure.push(item.UnitOfMeasure);
            }
        });

        apiEntities.I_UnitOfMeasureText.data.map((item) => {
            if (
                item.UnitOfMeasure != "" &&
                !uniqueUnitOfMeasure.includes(item.UnitOfMeasure)
            ) {
                uniqueUnitOfMeasure.push(item.UnitOfMeasure);
            }
        });

        entities.db_UnitsOfMeasure.data = uniqueUnitOfMeasure;

        apiEntities.I_ProductHierarchyText.data.map((data) => {
            if (!uniqueProductHierarchy.includes(data.ProductHierarchy)) {
                uniqueProductHierarchy.push(data.ProductHierarchy);
            }
        });

        apiEntities.I_ProductTypeText.data.map((data) => {
            if (!uniqueProductType.includes(data.ProductType)) {
                uniqueProductType.push(data.ProductType);
            }
        });
        entities.db_ProductTypes.data = uniqueProductType;

        apiEntities.I_CountryText.data.map((country) => {
            if (country.Language == "EN") {
                const _isExist = uniqueCoutries.find(
                    (item) => item.Country == country.Country
                );
                if (!_isExist)
                    uniqueCoutries.push({
                        Country: country.Country,
                        CountryName: country.CountryName,
                    });
            }
        });
        apiEntities.I_Country.data.map((country) => {
            const _isExist = uniqueCoutries.find(
                (item) => item.Country == country.Country
            );
            if (!_isExist)
                uniqueCoutries.push({
                    Country: country.Country,
                    CountryName: country.Country_Text,
                });
        });
        entities.db_Countries.data = uniqueCoutries;

        apiEntities.I_RegionText.data.map((region) => {
            if (region.Language == "EN") {
                const _isExist = uniqueRegions.find(
                    (item) => item.Region == region.Region
                );
                if (!_isExist)
                    uniqueRegions.push({
                        Region: region.Region,
                        RegionName: region.RegionName,
                        Country: region.Country,
                    });
            }
        });

        apiEntities.I_Region.data.map((region) => {
            const _isExist = uniqueRegions.find(
                (item) => item.Region == region.Region
            );
            if (!_isExist)
                uniqueRegions.push({
                    Region: region.Region,
                    RegionName: region.Region_Text,
                    Country: region.Country,
                });
        });
        entities.db_Regions.data = uniqueRegions;

        apiEntities.I_RegionText.data.map((item) => delete item.Country);

        const languages = ["en", "de", "it"];
        uniqueProductHierarchy.map((item) => {
            const levels = [];
            const hirarchy = {
                ID: item,
                name1: "",
                name2: "",
                name3: "",
                name4: "",
                name5: "",
                name6: "",
                name7: "",
                name8: "",
                name9: "",
            };

            for (let i = 0; i < item.length; i++) {
                if (item[i] != 0) {
                    const level = item.slice(0, i + 1);
                    levels.push(level);
                }
            }
            levels.map((level, i) => {
                const data = apiEntities.I_ProductHierarchyText.data.find(
                    (text) =>
                        text.ProductHierarchy == level && text.Language == "EN"
                );
                hirarchy[`name${i + 1}`] = data.ProductHierarchyText;
            });

            entities.db_ProductHierarchies.data.push(hirarchy);

            languages.map((language) => {
                levels.map((level, i) => {
                    const data = apiEntities.I_ProductHierarchyText.data.find(
                        (text) =>
                            text.ProductHierarchy == level &&
                            text.Language.toLowerCase() == language
                    );
                    hirarchy[`name${i + 1}`] = data.ProductHierarchyText;
                });
                hirarchy.Language = language;

                entities.db_ProductHierarchies_texts.data = [
                    ...entities.db_ProductHierarchies_texts.data,
                    { ...hirarchy, Language: language },
                ];
            });
        });

        // Loop through to the entities to insert data.
        this.importToDB(req, db, entities, isCloud, logs);
    }

    updateJobStatus(req, report) {
        return new Promise((resolve, reject) => {
            const scheduler = this.getJobScheduler(req);
            if (scheduler) {
                const job = {
                    jobId: req.headers["x-sap-job-id"],
                    scheduleId: req.headers["x-sap-job-schedule-id"],
                    runId: req.headers["x-sap-job-run-id"],
                    data: {
                        success: true,
                        message: "Job susccessfully executed",
                    },
                };
                scheduler.updateJobRunLog(job, (err, result) => {
                    if (err) {
                        reject(req.error(err.message));
                    } else {
                        resolve(JSON.stringify(result));
                    }
                });
            } else {
                reject(req.error("No jobscheduler found!"));
            }
        });
    }

    getJobScheduler(req) {
        const services = xsenv.getServices({
            jobscheduler: {
                tags: "jobscheduler",
            },
        });
        if (services.jobscheduler) {
            const options = {
                baseURL: services.jobscheduler.url,
                user: services.jobscheduler.user,
                password: services.jobscheduler.password,
            };
            return new JobSchedulerClient.Scheduler(options);
        } else {
            req.error("No jobscheduler service instance found!");
        }
    }

    async runOrderTypeImportJob(req, isCloud) {
        const db_order = {
            orderType: [
                {
                    ID: "O",
                    name: "test 1",
                },
            ],
            orderType_texts: [
                {
                    ID: "O",
                    name: "Standard Order",
                    locale: "en",
                },
                {
                    ID: "O",
                    name: "Standard-Bestellung",
                    locale: "de",
                },
                {
                    ID: "O",
                    name: "Ordine Standard",
                    locale: "it",
                },
            ],
        };

        const db = await cds.connect.to("db");
        const entities = {
            db_OrderTypes: {
                primaryKeys: {
                    ID: "ID",
                },
                fields: {
                    ID: "ID",
                    name: "name",
                },
                data: db_order.orderType,
            },
            db_OrderTypes_texts: {
                primaryKeys: {
                    ID: "ID",
                    locale: "locale",
                },
                fields: {
                    ID: "ID",
                    locale: "locale",
                    name: "name",
                },
                data: db_order.orderType_texts,
            },
        };

        for (const [entity, value] of Object.entries(entities)) {
            const tx = db.tx();

            try {
                const data = value.data;
                await Promise.all(
                    data.map(async (item) => {
                        const conditions = {};
                        const primaryKey = Object.keys(value.primaryKeys)[0];

                        Object.keys(value.primaryKeys).map((key) => {
                            const _apiKey = value.primaryKeys[key];
                            if (item.hasOwnProperty(_apiKey)) {
                                conditions[key] = _apiKey == "Language" ? item[_apiKey].toLowerCase(): item[_apiKey];
                            }
                        });

                        let existingData;
                        try {
                            const query = SELECT.one(entity).where(conditions).columns(primaryKey);
                            existingData = await cds.run(query);
                        } catch (error) {
                            console.log("Exist", error);
                        }

                        if (existingData && existingData.hasOwnProperty(primaryKey)) {
                            try {
                                const updateQuery = UPDATE(entity).with(item).where(conditions);
                                await cds.run(updateQuery);
                            } catch (error) {
                               console.log("update", error);
                            }
                        } else {
                            try {
                                const insertQuery = INSERT.into(entity).entries(item);
                                await cds.run(insertQuery);
                            } catch (error) {
                               console.log("Create", error)
                            }
                        }
                    })
                );
                tx.commit();
            } catch (entityError) {
                const response = entityError?.reason?.response;
                console.log('response', response);
                await tx.rollback();
            }
        }
        console.log("Order type import completed");
        return { msg: JSON.stringify(entities) };
    }
}

module.exports = { CustomService };
