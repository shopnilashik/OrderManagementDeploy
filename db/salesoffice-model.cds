using db.CustomerSalesAreas as CustomerSalesAreas from './customersalesarea-model';

namespace db;

entity SalesOffices {
    key ID                 : String not null;
        name               : localized String;
        // customerSalesAreas : Association to many CustomerSalesAreas
        //                          on customerSalesAreas.salesOffice = $self;
}
