const jwt = require('jsonwebtoken');
const config = require('../config/config')
var auth =  (req, res, next)=> {
     token = req.headers['token']
     jwt.verify(token, config.secretKey, function (err, decoded) {
          if (err) {
               // console.log(err);
               return res.status(401).send({ message: 'Not Authenticated' });
          } else {
               // console.log('decoded data', decoded);
               req.body['data'] = decoded;
               // console.log(req.body);
               req.token=decoded;
               next();
          }

     });

}
module.exports = auth;