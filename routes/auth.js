const express = require('express');
const { body, query } = require('express-validator/check');
const router = express.Router();

const authController = require('../controllers/auth');
const User = require('../models/user');
const isAuth = require('../middleware/is-auth');

router.post('/register',
    [
        body('email').isEmail().withMessage('Inserisci una mail valida name@server.com')
        .custom((value, {req}) => {
            return User.findOne({where : {email : value}}).then(user => {
                if(user) {
                    return Promise.reject('Email Esistente');
                }
            });
        }),
        body('password').trim().isLength({min : 5}).withMessage('Password > 5 caratteri'),
        body('name').trim().not().isEmpty().withMessage('Name non vuoto'),
    ],
    authController.registerUser);

router.post('/login', 
    [
        body('email').isEmail().withMessage('Inserisci una mail valida name@server.com'),
        body('password').trim().isLength({min : 5}).withMessage('Password > 5 caratteri'),
    ],  
    authController.loginUser);

router.get('/me', isAuth, authController.loginMe);

module.exports = router;