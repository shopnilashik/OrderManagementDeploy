using db.CustomerSalesAreas as CustomerSalesAreas from './customersalesarea-model';

namespace db;

entity SalesGroups {
    key ID                 : String not null;
        name               : localized String;
        // customerSalesAreas : Association to many CustomerSalesAreas
        //                          on customerSalesAreas.salesGroup = $self;
}
