
exports.up = function(knex) {
    return knex.schema
    .createTable("uuser", (tbl) => {
      tbl.increments(); // 'id' field
      tbl.text("name", 128).notNullable();
      tbl.text("photoLink", 128);
      tbl.integer("solvedWords").defaultTo(0);
      tbl.integer("points").defaultTo(0);
    })
    .createTable("word", (tbl) => {
      tbl.increments(); // id field
      tbl.string("name").notNullable().index();
      tbl.text("solvedOn");

      // Foreign key info to 'lessons' table
      /*tbl
        .integer("lesson_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("lessons")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");*/
    }); 
};

exports.down = function(knex) {
  return knex.schema.dropTable('user').dropTable('word');
};
