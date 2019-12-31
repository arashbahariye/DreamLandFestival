const { validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.registerUser = (req, res, next) => {
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(422).json({
            message : 'Errore input parametri',
            error : errors.array()
        });
    }

    const email = req.body.email;
    const name = req.body.name;
    const phoneNumber = req.body.phoneNumber;
    const password = req.body.password;

    bcrypt.hash(password, 12)
    .then(hashedPassword => {
        User.create({name : name, email : email, phoneNumber : phoneNumber, password : hashedPassword})
        .then(user => {
            res.status(201).json({
                messages : 'Success Operation',
                user : user
            });
        })
        .catch(err => {
            return res.status(422).json({
                message : err
            })
        });
    })
    .catch(err => {
        return res.status(422).json({
            message : err
        });
    });
};

exports.loginMe = (req, res, next) => {
    req.user.password = '***************';
    res.status(200).json({
        user : req.user,
    });
};

exports.loginUser = (req, res, next) => {
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(422).json({
            message : 'Errore input parametri',
            error : errors.array()
        });
    }

    const email = req.body.email;
    const password = req.body.password;

    let loginUser;
    User.findOne({where : {email : email}}).then(user => {
        if(!user) {
            return res.status(401).json({
                message : 'Non autorizzato, Email errata',
            });
        }
        loginUser = user;
        return bcrypt.compare(password, user.password);
    })
    .then(isEqual => {
        if(!isEqual){
            return res.status(401).json({
                message : 'Non autorizzato, Password errata',
            });
        }
        const token = jwt.sign(
            {
                id : loginUser.id, 
                email : loginUser.email,
                name : loginUser.name
            }, 'axAYgScUa4Z2UdjgirykmI3iZsSCaPGh', {expiresIn : '1h'});

        res.status(201).json({
            messages : 'Sei Loggato',
            id : loginUser.id,
            token : token
        });
    })
    .catch(err => {
        return res.status(422).json({
            message : err
        });
    });
};