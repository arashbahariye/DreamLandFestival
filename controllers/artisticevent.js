const { validationResult } = require('express-validator/check');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const path = require('path');
const fs = require('fs');

const Artisticevent = require('../models/artisticevent');
const Performer = require('../models/performer');
const Performance = require('../models/performance');
const User = require('../models/user');

exports.getArtisticevents = (req, res, next) => {
    Artisticevent.findAll()
    .then(artisticevents => {
        var promises = [];
        artisticevents.forEach(artisticevent => {
        const artisticeventWithPerformers = artisticevent.getPerformers()
               .then(performers => {
                    artisticevent.dataValues.performers = performers;
                })
               .then(() => {
                return artisticevent;
               });
        promises.push(artisticeventWithPerformers);
        });
        return Promise.all(promises);
    }).then((artisticevents) => {
        res.json({artisticevents : artisticevents});
    }).catch(
        err => console.log(err)
    );
};

exports.getArtisticevent = (req, res, next) => {
    const artisticeventId = req.params.id;
    Artisticevent.findByPk(artisticeventId)
    .then(artisticevent => {
        if(!artisticevent) {
            res.status(404).json({
                messages : 'Artistic Event Not Found',
            });
        }
        var promises = [];
        const artisticeventWithPerformers = artisticevent.getPerformers()
        .then(performers => {
             artisticevent.dataValues.performers = performers;
         })
        .then(() => {
             return artisticevent;
        });
        promises.push(artisticeventWithPerformers);
        return Promise.all(promises);
        }).then((artisticevent) => {
            console.log(artisticevent);
            res.json({artisticevent : artisticevent});
        }).catch(
            err => console.log(err)
        );
};

exports.getSimilars = (req, res, next) => {
    const artisticeventId = req.params.id;
    Artisticevent.findByPk(artisticeventId)
    .then(artisticevent => {
        if(!artisticevent) {
            res.status(404).json({
                messages : 'Artistic Event Not Found',
            });
        }
        var promises = [];
        const artisticeventWithSimilars = artisticevent.getSimilar()
        .then(similars => {
             artisticevent.dataValues.similars = similars;
         })
        .then(() => {
             return artisticevent;
        });
        promises.push(artisticeventWithSimilars);
        return Promise.all(promises);
        }).then((artisticevent) => {
            console.log(artisticevent);
            res.json({artisticevent : artisticevent});
        }).catch(
            err => console.log(err)
        );
};

exports.searchArtisticevent = (req, res, next) => {
    const title = '%' + req.query.title + '%';
    Artisticevent.findAll({where : {title : {[Op.like] : title}}})
    .then(artisticevents => {
        var promises = [];
        artisticevents.forEach(artisticevent => {
        const artisticeventWithPerformers = artisticevent.getPerformers()
               .then(performers => {
                    artisticevent.dataValues.performers = performers;
                })
               .then(() => {
                return artisticevent;
               });
        promises.push(artisticeventWithPerformers);
        });
        return Promise.all(promises);
    }).then((artisticevents) => {
            console.log(artisticevents);
            res.json({artisticevents : artisticevents});
    }).catch(
            err => console.log(err)
    );
};