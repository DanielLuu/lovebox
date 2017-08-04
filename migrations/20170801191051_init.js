exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('events', function(table) {
      table.increments();
      table.string('name').notNullable();
      table.string('code').notNullable().index().unique();
      table.string('confessions_pw');
      table.timestamps();
    }),
    knex.schema.createTable('admins', function(table) {
      table.increments();
      table.integer('user_id').notNullable();
      table.string('event_code').notNullable();
      table.timestamps();
    }),
    knex.schema.createTable('users', function(table) {
			table.increments();
			table.string('first_name').notNullable();
			table.string('last_name').notNullable();
      table.string('email').notNullable().unique();
			table.string('fb_id').unique();
			table.string('session_key', 128).index();
			table.string('pass_hash', 256).notNullable();
			table.string('pass_salt', 128).notNullable();
      table.string('activate_token', 128);
      table.boolean('activated').defaultTo(false);
      table.string('img');
			table.timestamps();
		}),
    knex.schema.createTable('confessions', function(table) {
      table.increments();
      table.string('first_name').notNullable();
      table.string('last_name').notNullable();
      table.text('text').notNullable();
      table.string('event_code').notNullable();
      table.boolean('approved').notNullable().defaultTo(false);
      table.timestamps();
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('confessions'),
    knex.schema.dropTable('admins'),
    knex.schema.dropTable('events'),
    knex.schema.dropTable('users'),
  ])
};
