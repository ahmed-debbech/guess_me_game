exports.up = function(knex) {
    return knex.schema.table('uuser', table => {
        table.integer('online');
    })
};

exports.down = function(knex) {

};