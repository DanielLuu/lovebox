const crypto = require('./crypto')

module.exports = (app) => {
  app.post('/api/accounts/signup', async (req, res) => {
    const { first_name, last_name, email, password } = req.body
    // const host = req.protocol + '://' + req.get('host')

    const salt = crypto.createSalt()
    const passHash = crypto.createPassHash(password + '', salt)
    const activateToken = crypto.createSalt()

    // Check for duplicate email
    const exisEmail = await knex('users')
      .select('*')
      .where('email', email)
      .first()

    if (exisEmail)
      return res.json({ error: 'This email address is already in use' })

    // Create account if no duplicate email is found
    await knex('users').insert({
      first_name: first_name,
      last_name: last_name,
      email: email,
      pass_hash: passHash,
      pass_salt: salt,
      activate_token: activateToken,
      activated: true,
      created_at: knex.raw('now()'),
      updated_at: knex.raw('now()'),
    })
    res.json({ success: true })
  })

  app.post('/api/accounts/login', (req, res) => {
    const body = req.body

    knex.transaction((trx) => {
      // Check if email exists
      return trx('users')
        .select('*')
        .where('email', body.email)
        .then((user) => {
          if (user.length > 0) {
            user = user[0]
            if (user.activated) {
              // Check if passwords match
              const salt = user.pass_salt
              const inputHash = crypto.createPassHash(body.password, salt)

              if (inputHash === user.pass_hash) {
                let sid = crypto.setCookie(req)
                // Make new cookie
                return trx('users')
                  .update({
                    session_key: sid,
                  })
                  .where('email', body.email)
                  .then((result) => {
                    res.json({ error: undefined })
                  })
              } else {
                res.json({
                  error: 'The email and/or password you entered do not match.',
                })
              }
            } else {
              res.json({ error: 'Your account is not activated.' })
            }
          } else {
            res.json({ error: 'Invalid email/password.' })
          }
        })
    })
  })

  app.get('/api/accounts/activeuser', (req, res) => {
    var sid = req.session.sid
    if (sid) {
      knex('users')
        .select('*')
        .where('session_key', sid)
        .then((result) => {
          res.json(result)
        })
    } else {
      res.json({ error: 'No valid user.' })
    }
  })
}
