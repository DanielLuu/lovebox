exports.up = function (knex) {
  return Promise.all([
    knex.schema.createTable('reactions', function (table) {
      table.increments()
      table.string('reaction').notNullable()
      table
        .integer('user_id')
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
      table
        .integer('confession_id')
        .references('id')
        .inTable('confessions')
        .onDelete('CASCADE')
      table.timestamps()
    }),
    knex.schema.table('confessions', function (table) {
      table.integer('reaction_total').defaultTo(0)
      table.jsonb('reactions')
    }),
  ])
}

exports.down = function (knex) {
  return Promise.all([
    knex.schema.dropTable('reactions'),
    knex.schema.table('confessions', function (table) {
      table.dropColumn('reactions')
      table.dropColumn('reaction_total')
    }),
  ])
}
