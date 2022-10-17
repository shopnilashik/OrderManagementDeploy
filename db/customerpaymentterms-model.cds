using db.CustomerSalesAreas as CustomerSalesAreas from './customersalesarea-model';

namespace db;

entity CustomerPaymentTerms {
    key ID                 : String not null;
        name               : localized String;
        // customerSalesAreas : Association to many CustomerSalesAreas
        //                          on customerSalesAreas.customerPaymentTerm = $self;
}
