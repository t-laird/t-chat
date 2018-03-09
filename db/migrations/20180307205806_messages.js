exports.up = function(knex, Promise) {
  return knex.schema.createTable('messages', table => {
    table.increments('id').primary();
    table.timestamps(true, true);
    table.text('message', 'longtext');
    table.integer('user_id').unsigned();
    table.foreign('user_id').references('users.id');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('messages');
};
