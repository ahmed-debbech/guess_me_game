
exports.up = function(knex) {
    return knex.schema.table('uuser', table => {
        table.dropColumn('last_online');
    })
};

exports.down = function(knex) {

};
