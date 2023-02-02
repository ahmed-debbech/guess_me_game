exports.up = function(knex) {
    return knex.schema.table('uuser', table => {
        table.text('last_online');
    })
};

exports.down = function(knex) {

};