
exports.up = function(knex) {
  return knex.schema.table('user', function(t) {
      t.text('email', 128).notNullable();
  });
};

exports.down = function(knex) {

};
