module.exports = (app) => {
  require('./events')(app);
  require('./accounts')(app);
  // require('./email')(app);
  require('./confessions')(app);
  require('./admin')(app);
};
