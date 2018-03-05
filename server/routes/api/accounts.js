const crypto = require('./crypto');

module.exports = (app) => {
  app.post('/api/accounts/signup', (req, res) => {
    const body = req.body;
    var host = req.protocol + '://' + req.get('host');

    const salt = crypto.createSalt();
    const passHash = crypto.createPassHash(body.password + '', salt);
    const activateToken = crypto.createSalt();

    knex.transaction((trx) => {
      // Check for duplicate email
      return trx('users').select('*').where('email', body.email).then((emailQuery) => {
        if (emailQuery.length <= 0) {
          // Create account if no duplicate email is found
          return trx('users').insert({
            first_name: body.first_name,
            last_name: body.last_name,
            email: body.email,
            fb_id: body.fb_id ? body.fb_id : null,
            pass_hash: passHash,
            pass_salt: salt,
            activate_token: activateToken,
            activated: true,
            img: body.fb_id ? 'http://graph.facebook.com/' + body.fb_id + '/picture?width=500&height=500' : null,
            created_at: trx.raw('now()'),
            updated_at: trx.raw('now()')
          }).then((result) => {
            res.json({error: undefined});
          });
        } else {
          let user = emailQuery[0];
          if (user.hasOwnProperty('fb_id')) {
            if (user.activated) {
              // Check if passwords match
              const salt = user.pass_salt;
              const inputHash = crypto.createPassHash(user.fb_id, salt);

              if (inputHash === user.pass_hash) {
                let sid = crypto.setCookie(req);
                // Make new cookie
                return trx('users').update({
                  session_key: sid,
                }).where('email', body.email).then((result) => {
                  res.json({error: undefined, facebook: true});
                });
              } else {
                res.json({error: 'Invlaid Facebook login'});
              }
            } else {
              res.json({error: 'Your account is not activated.'});
            }
          }
          res.json({error: 'You already have an account.'});
        }
      });
    });
  });

  app.post('/api/accounts/login', (req, res) => {
    const body = req.body;

    knex.transaction((trx) => {
      // Check if email exists
      return trx('users').select('*').where('email', body.email).then((user) => {
        if (user.length > 0) {
          user = user[0];
          if (user.activated) {
            // Check if passwords match
            const salt = user.pass_salt;
            const inputHash = crypto.createPassHash(body.password, salt);

            if (inputHash === user.pass_hash) {
              let sid = crypto.setCookie(req);
              // Make new cookie
              return trx('users').update({
                session_key: sid,
              }).where('email', body.email).then((result) => {

                res.json({error: undefined});
              });
            } else {
              res.json({error: 'The email and/or password you entered do not match.'});
            }
          } else {
            res.json({error: 'Your account is not activated.'});
          }
        } else {
          res.json({error: 'Invalid email/password.'});
        }
      });
    });
  });

  app.get('/api/accounts/activeuser', (req, res) => {
    var sid = req.session.sid;
    if (sid) {
      knex('users').select('*').where('session_key', sid).then((result) => {
        res.json(result);
      });
    } else {
      res.json({error: 'No valid user.'});
    }
  });
}
