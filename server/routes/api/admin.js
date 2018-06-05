module.exports = (app) => {
  app.post('/api/admin/events', (req, res) => {
    const body = req.body;
    return knex('admins').select('*').where({
      user_id: body.user_id
    })
    .innerJoin('events', 'events.code', 'admins.event_code')
    .then((result) => {
      res.json(result);
    });
  });

  app.post('/api/admin/status', (req, res) => {
    const body = req.body;
    return knex('admins').select('*').where({
      user_id: body.user_id,
      event_code: body.event_code,
    }).then((result) => {
      res.json({isAdmin: result.length > 0});
    });
  });
  
  app.get('/api/admins/:event', (req, res) => {
    const event = req.params.event;
    return knex('admins').select(
      'admins.id',
      'users.email'
    ).where({
      event_code: event
    })
    .innerJoin('users', 'admins.user_id', 'users.id')
    .then((result) => {
      res.json(result);
    });
  });
  
  app.post('/api/admin/add', (req, res) => {
    const body = req.body;
    knex.transaction((trx) => {
      return trx('users').select('*').where('email', body.email.trim()).then((emailQuery) => {
        if (emailQuery.length !== 0) {
          return trx('admins').insert({
            user_id: emailQuery[0].id,
            event_code: body.event_code,
            created_at: trx.raw('now()'),
            updated_at: trx.raw('now()')
          })
          .then((result) => {
            return trx('admins').select('*').where({
              event_code: body.event_code
            })
            .innerJoin('users', 'admins.user_id', 'users.id')
            .then((result) => {
              res.json(result);
            });
          });
        } else {
          res.json({error: 'Invalid user email'});
        }
      });
    });
  });

  app.post('/api/admin/del', (req, res) => {
    const body = req.body;
    knex.transaction((trx) => {
      return trx('admins').where({
        id: body.id,
      }).del().then((result) => {
        return trx('admins').select('*').where({
          event_code: body.event_code
        })
        .innerJoin('users', 'admins.user_id', 'users.id')
        .then((result) => {
          res.json(result);
        });
      });
    });
  });
}
