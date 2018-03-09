exports.up = function(knex, Promise) {
  return knex.schema.table('users', table => {
    table.string('un');
    table.string('pw');
    table.dropColumn('id_token');
  }); 
};

exports.down = function(knex, Promise) {
  return knex.schema.table('users', table => {
    table.string('id_token');
    table.dropColumn('un');
    table.dropColumn('pw');
  });     
};
