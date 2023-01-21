
exports.up = function(knex) {
    return knex.schema.table('uuser', function(t) {
        t.renameColumn('name', 'username')
    });
};

exports.down = function(knex) {
  
};
