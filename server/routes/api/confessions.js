module.exports = (app) => {
  app.get('/api/confessions/:event', function(req, res) {
    const event = req.params.event;
    knex('confessions').select('*').where({ 'event_code': event })
    .then((result) => {
      res.json(result);
    });
  });

  app.post('/api/confess', (req, res) => {
    const body = req.body;
    knex.transaction((trx) => {
      return trx('events').select('code').where({
        'code': body.event_code
      }).then((eventQuery) => {
        if (eventQuery.length > 0) { // Check if event exists
          return trx('confessions').insert({
            first_name: body.first_name,
            last_name: body.last_name,
            text: body.text,
            event_code: body.event_code,
            created_at: trx.raw('now()'),
            updated_at: trx.raw('now()')
          }).then(() => {
            return trx('confessions').select('*')
            .where({ 'event_code': body.event_code })
            .then((result) => {
              res.json(result);
            });
          });
        } else {
          res.json({error: 'Invalid event.'});
        }
      })
    });
  });

  app.post('/api/confession_admin/approve', (req, res) => {
    const body = req.body;
    knex.transaction((trx) => {
      return trx('confessions').update({ approved: true })
      .where({id: body.confession_id}).then(() => {
        return trx('confessions').select('*')
        .where({ 'event_code': body.event_code })
        .then((result) => {
          res.json(result);
        });
      });
    });
  });

  app.post('/api/confession_admin/del', (req, res) => {
    const body = req.body;
    knex.transaction((trx) => {
      return trx('confessions').where({id: body.confession_id}).del()
      .then(() => {
        return trx('confessions').select('*')
        .where({ 'event_code': body.event_code })
        .then((result) => {
          res.json(result);
        });
      });
    });
  });
}
