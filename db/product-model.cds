namespace db;

using db.ProductTypes as ProductTypes from './producttype-model';
using db.ProductHierarchies as ProductHierarchies from './producthierarchies-model';
using db.UnitsOfMeasure as UnitsOfMeasure from './unitofmasure-model';

entity Products {
    key ID                 : String not null;
        name               : localized String;
        productType        : Association to ProductTypes;
        productHierarchy   : Association to ProductHierarchies;
        salesUnitOfMeasure : Association to UnitsOfMeasure;
        attribute1         : String;
        attribute2         : String;
        attribute3         : String;
        attribute4         : String;
        attribute5         : String;
}
