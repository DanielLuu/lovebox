module.exports = (app) => {
  app.get('/api/event/:event', function(req, res) {
    const event = req.params.event;
    knex('events').select('*').where({ 'code': event })
    .then((result) => {
      res.json(result[0]);
    });
  });
}
