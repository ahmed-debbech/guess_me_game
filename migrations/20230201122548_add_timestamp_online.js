exports.up = function(knex) {
    return knex.schema.table('uuser', table => {
        table.timestamp('last_online');
    })
};

exports.down = function(knex) {

};