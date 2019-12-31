const { validationResult } = require('express-validator/check');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const path = require('path');
const fs = require('fs');

const Ticket = require('../models/ticket');
const User = require('../models/user');

exports.getTicketsByMe = (req, res, next) => {
    req.user.getTickets().then((tickets) => {
        res.json({tickets : tickets});
    }).catch(
        err => console.log(err)
    );
};

exports.searchTicketByMe = (req, res, next) => {
    const title = '%' + req.query.title + '%';
    Ticket.findAll({where : {title : {[Op.like] : title}, userId : req.user.id}})
    .then((tickets) => {
        res.json({tickets : tickets});
    }).catch(
        err => console.log(err)
    );
};

exports.createTicket = (req, res, next) => {
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(422).json({
            message : 'Errore input parametri',
            error : errors.array()
        });
    }

    const title = req.body.title;
    const date = req.body.date;
    const name = req.body.name;
    //INSERT NEL DATABASE  
    req.user.createTicket({
        title : title,
        date : date,
        name : name
    }).then((ticket) => {
        res.status(201).json({
            messages : 'Success Operation',
            ticket : ticket
        });
    }).catch( err => {
       return res.status(422).json({
           message : 'Error nel Salvataggio'
       })
    });
};