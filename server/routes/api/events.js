module.exports = (app) => {
  app.get('/api/events', async (req, res) => {
    const events = await knex('events')
      .select('*')
      .orderBy('created_at', 'desc')
    res.json({ events })
  })

  app.get('/api/event/:event', function (req, res) {
    const event = req.params.event
    knex('events')
      .select('*')
      .where({ code: event })
      .then((result) => {
        res.json(result[0])
      })
  })

  app.post('/api/event/create', (req, res) => {
    const body = req.body
    knex.transaction((trx) => {
      return trx('events')
        .select('code')
        .where({
          code: body.code,
        })
        .then((eventQuery) => {
          if (eventQuery.length === 0) {
            return trx('events')
              .insert({
                name: body.name,
                code: body.code,
                confessions_pw: '',
                created_at: trx.raw('now()'),
                updated_at: trx.raw('now()'),
              })
              .then(() => {
                return trx('admins')
                  .insert({
                    user_id: body.user_id,
                    event_code: body.code,
                    created_at: trx.raw('now()'),
                    updated_at: trx.raw('now()'),
                  })
                  .then(() => {
                    res.json({
                      name: body.name,
                      code: body.code,
                    })
                  })
              })
          } else {
            res.json({ error: 'Event already exists.' })
          }
        })
    })
  })
}
