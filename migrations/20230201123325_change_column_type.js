exports.up = function(knex) {
    return knex.schema.table('uuser', table => {
        table.dateTime('last_online').alter();
    })
};

exports.down = function(knex) {

};