const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth.json');


module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader){
        res.status(401).send( { error:  'No token provider'});
    };

    const parts = authHeader.split(' ');

    if (!parts.length === 2){
        res.status(401).send ( { error: 'Token error'});
    };

     const [ scheme, token ] = parts;

     if (!/^Bearer$/i.test(scheme)){
        res.status(401).send( { error: 'Token malformatted'});
     };

     jwt.verify(token, authConfig.secret, (err, decoded) => {
          if (err){
              res.status(401).send( { error: 'Token invalid'});
          };

          req.userId = decoded.params.id;
          
          console.log('logado', decoded);

          return next();
     });
}; 