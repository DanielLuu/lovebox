if (process.env.NODE_ENV !== 'production') require('dotenv').load()
const cookieSession = require('cookie-session')
const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')

const app = express()

// DB, NEVER use knex as a variable anywhere else
knex = require('./db')

app.use(bodyParser.json())

// Serve static assets
app.use(express.static(path.resolve(__dirname, '..', 'build')))

const getExpirationDate = function (days) {
  var d = new Date()
  return new Date(d.getTime() + days * 24 * 60 * 60 * 1000)
}

app.use(
  cookieSession({
    name: 'session',
    keys: ['lovebox'],

    // Cookie Options
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  })
)

// Setup Api Routes
require('./routes')(app)

app.use(function appErrorHandler(err, req, res, next) {
  if (err.error)
    console.error(
      `desc=${err.error} path=${req.url} method=${req.method} ${
        req.user ? `user=${req.user.id}` : ''
      }`
    )
  res.status(err.statusCode || 500).send({
    error:
      err.message ||
      'There was a problem processing your request. Please try again later.',
    banned: err.banned ? true : undefined,
  })
})

// Always return the main index.html, so react-router render the route in the client
app.get('*', (req, res, next) => {
  res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'))
})

app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    error: `Can't find ${req.originalUrl} on this server!`,
  })
})

module.exports = app
