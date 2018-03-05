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
}
