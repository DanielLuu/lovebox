exports.seed = function(knex, Promise) {
  return knex('events').then(function () {
      return knex('events').insert([
        {
          'name': 'UNAVSA-14',
          'code': 'U14',
          'confessions_pw': 'unlockTHEpresent',
          'created_at': knex.raw('now()'),
          'updated_at': knex.raw('now()')
        },
      ]);
    });
};
