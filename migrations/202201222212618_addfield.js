
exports.up = function(knex) {
  return knex.schema.table('uuser', function(t) {
      t.text('email', 128);
  });
};

exports.down = function(knex) {

};
