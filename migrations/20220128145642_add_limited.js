
exports.up = function(knex) {
    return knex.schema.table('uuser', function(t) {
        t.integer('limited');
    });
};

exports.down = function(knex) {
  
};
