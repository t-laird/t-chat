exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', table => {
    table.increments('id').primary();
    table.string('id_token');
    table.string('sn');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('messages');
};
