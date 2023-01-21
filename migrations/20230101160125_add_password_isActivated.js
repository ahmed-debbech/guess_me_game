
exports.up = function(knex) {
    return knex.schema.table('uuser', function(t) {
        t.integer('activated');
        t.string('password')
    });
};

exports.down = function(knex) {
  
};
