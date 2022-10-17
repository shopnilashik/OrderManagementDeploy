using db.Regions as Regions from './region-model';

namespace db;

entity Countries {
    key ID      : String not null;
        name    : localized String;
        regions : Association to many Regions
                      on regions.country = $self;
}
