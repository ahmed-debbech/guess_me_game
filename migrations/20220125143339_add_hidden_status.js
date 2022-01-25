
exports.up = function(knex) {
    return knex.schema.table('uuser', function(t) {
        t.integer('hidden');
    });
};

exports.down = function(knex) {
  
};
