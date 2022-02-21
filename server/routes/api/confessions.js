module.exports = (app) => {
  app.get('/api/confessions/:event', async (req, res) => {
    const { event } = req.params
    const { approved } = req.query

    const confessionQuery = knex('confessions')
      .select('*')
      .where({ event_code: event })
      .orderBy('created_at', 'desc')
      
    if (!approved) {
      confessionQuery.where('approved', true)
    }

    const result = await confessionQuery
    res.json(result)
  })

  app.post('/api/confess', (req, res) => {
    const body = req.body
    knex.transaction((trx) => {
      return trx('events')
        .select('code')
        .where({
          code: body.event_code,
        })
        .then((eventQuery) => {
          if (eventQuery.length > 0) {
            // Check if event exists
            return trx('confessions')
              .insert({
                first_name: body.first_name,
                last_name: body.last_name,
                text: body.text,
                event_code: body.event_code,
                created_at: trx.raw('now()'),
                updated_at: trx.raw('now()'),
              })
              .then(() => {
                return trx('confessions')
                  .select('*')
                  .where({ event_code: body.event_code })
                  .then((result) => {
                    res.json(result)
                  })
              })
          } else {
            res.json({ error: 'Invalid event.' })
          }
        })
    })
  })

  app.post('/api/confessions/del', (req, res) => {
    const body = req.body
    knex.transaction((trx) => {
      return trx('confessions')
        .where({
          id: body.id,
        })
        .del()
        .then((result) => {
          return trx('confessions')
            .select('*')
            .where({
              event_code: body.event_code,
            })
            .then((result) => {
              res.json(result)
            })
        })
    })
  })

  app.post('/api/confession_admin/approve', (req, res) => {
    const body = req.body
    knex.transaction((trx) => {
      return trx('confessions')
        .update({ approved: true })
        .where({ id: body.confession_id })
        .then(() => {
          return trx('confessions')
            .select('*')
            .where({ event_code: body.event_code })
            .then((result) => {
              res.json(result)
            })
        })
    })
  })

  app.post('/api/confession_admin/del', (req, res) => {
    const body = req.body
    knex.transaction((trx) => {
      return trx('confessions')
        .where({ id: body.confession_id })
        .del()
        .then(() => {
          return trx('confessions')
            .select('*')
            .where({ event_code: body.event_code })
            .then((result) => {
              res.json(result)
            })
        })
    })
  })

  app.post('/api/confessions/react', async (req, res) => {
    try {
      const sid = req.session.sid
      if (!sid) return res.json({ error: 'You must be logged in to do this' })

      const user = await knex('users')
        .select('id')
        .where('session_key', sid)
        .first()

      // Check if user has already reacted
      const { confession, reaction } = req.body
      const reactionRes = await knex('reactions')
        .select('*')
        .where({ confession_id: confession, user_id: user.id })
        .first()
      if (reactionRes)
        return res.json({ error: 'You already reacted to this confession' })

      await knex('reactions').insert({
        reaction,
        confession_id: confession,
        user_id: user.id,
      })

      const confessionRes = await knex('confessions')
        .select('*')
        .where('id', confession)
        .first()
      if (!confessionRes.reactions) confessionRes.reactions = {}
      if (!confessionRes.reactions[reaction])
        confessionRes.reactions[reaction] = 0
      confessionRes.reactions[reaction] += 1

      let reactTotal = 0
      Object.keys(confessionRes.reactions).forEach((react) => {
        reactTotal += confessionRes.reactions[react]
      })

      await knex('confessions')
        .update({
          reaction_total: reactTotal,
          reactions: confessionRes.reactions,
        })
        .where('id', confession)

      res.json({ success: true })
    } catch (err) {
      console.log(err)
      res.json({ error: err })
    }
  })
}
