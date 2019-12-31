const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports = (req, res, next) => {
    console.log('AUTHORIZATION MIDDLEWARE');
    console.log(req.get('Authorization'));

    const auth = req.get('Authorization');

    if(!auth) {
        return res.status(401).json({
            message : 'Non autorizzato',
        });
    }

    const token = auth.split(' ')[1];
    let decode;
    try{
        decode = jwt.verify(token, 'axAYgScUa4Z2UdjgirykmI3iZsSCaPGh');
    }catch(err){
        return res.status(500).json({
            message : 'Non autorizzato',
        });
    }

    if(!decode) {
        return res.status(401).json({
            message : 'Non autorizzato',
        });
    }

    let userId = decode.id;
    
    User.findByPk(userId)
    .then(user => {
        req.user = user;
        next();
    }).catch(err => {
        return res.status(401).json({
            message : 'Non autorizzato',
        });
    });
};