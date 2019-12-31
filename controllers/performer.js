const { validationResult } = require('express-validator/check');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const path = require('path');
const fs = require('fs');

const Performer = require('../models/performer');
const Artisticevent = require('../models/artisticevent');
const Performance = require('../models/performance');
const User = require('../models/user');

exports.getPerformers = (req, res, next) => {
    Performer.findAll()
    .then(performers => {
        var promises = [];
        performers.forEach(performer => {
        const performerWithArtisticEvents = performer.getArtisticevents()
               .then(artisticevents => {
                    performer.dataValues.artisticevents = artisticevents;
                })
               .then(() => {
                return performer;
               });
        promises.push(performerWithArtisticEvents);
        });
        return Promise.all(promises);
    }).then((performers) => {
        res.json({performers : performers});
    }).catch(
        err => console.log(err)
    );
};

exports.getPerformer = (req, res, next) => {
    const performerId = req.params.id;
    Performer.findByPk(performerId)
    .then(performer => {
        if(!performer) {
            res.status(404).json({
                messages : 'Performer Not Found',
            });
        }
        var promises = [];
        const performerWithArtisticEvents = performer.getArtisticevents()
        .then(artisticevents => {
            performer.dataValues.artisticevents = artisticevents;
         })
        .then(() => {
             return performer;
        });
        promises.push(performerWithArtisticEvents);
        return Promise.all(promises);
        }).then((performer) => {
            res.json({performer : performer});
        }).catch(
            err => console.log(err)
        );
};

exports.searchPerformer = (req, res, next) => {
    const name = '%' + req.query.name + '%';
    Performer.findAll({where : {name : {[Op.like] : name}}})
    .then(performers => {
        var promises = [];
        performers.forEach(performer => {
        const performerWithArtisticEvents = performer.getArtisticevents()
               .then(artisticevents => {
                performer.dataValues.artisticevents = artisticevents;
                })
               .then(() => {
                return performer;
               });
        promises.push(performerWithArtisticEvents);
        });
        return Promise.all(promises);
    }).then((performers) => {
            res.json({performers : performers});
    }).catch(
            err => console.log(err)
    );
};