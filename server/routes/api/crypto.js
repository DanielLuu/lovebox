const crypto = require('crypto');

exports.createSalt = () => { return crypto.randomBytes(64).toString('hex'); };

exports.createPassHash = (password, salt) => {
    return crypto.pbkdf2Sync(password, salt, 10000, 128, 'sha512').toString('hex');
};

exports.setCookie = function(req) {
	var sessionId = crypto.randomBytes(64).toString('hex');
  req.session.sid = sessionId;
	return sessionId;
};

exports.decrypt = function(text){
  var decipher = crypto.createDecipher('aes-256-cbc','d6F3Efeq')
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}
