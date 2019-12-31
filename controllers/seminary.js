const { validationResult } = require('express-validator/check');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const path = require('path');
const fs = require('fs');

const Seminary = require('../models/seminary');
const User = require('../models/user');

exports.getSeminaries = (req, res, next) => {
    Seminary.findAll()
    .then(seminaries => {
        var promises = [];
        seminaries.forEach(seminary => {
        const seminaryWithArtisticEvents = seminary.getArtisticevents()
               .then(artisticevents => {
                    seminary.dataValues.artisticevents = artisticevents;
                })
               .then(() => {
                return seminary;
               });
        promises.push(seminaryWithArtisticEvents);
        });
        return Promise.all(promises);
    }).then((seminaries) => {
        res.json({seminaries : seminaries});
    }).catch(
        err => console.log(err)
    );
};

exports.getSeminary = (req, res, next) => {
    const seminaryId = req.params.id;
    Seminary.findByPk(seminaryId)
    .then(seminary => {
        if(!seminary) {
            res.status(404).json({
                messages : 'Seminary Not Found',
            });
        }
        var promises = [];
        const seminaryWithArtisticEvents = seminary.getArtisticevents()
        .then(artisticevents => {
            seminary.dataValues.artisticevents = artisticevents;
         })
        .then(() => {
             return seminary;
        });
        promises.push(seminaryWithArtisticEvents);
        return Promise.all(promises);
        }).then((seminary) => {
            console.log(seminary);
            res.json({seminary : seminary});
        }).catch(
            err => console.log(err)
        );
};

exports.searchSeminary = (req, res, next) => {
    const title = '%' + req.query.title + '%';
    Seminary.findAll({where : {title : {[Op.like] : title}}})
    .then(seminaries => {
        var promises = [];
        seminaries.forEach(seminary => {
        const seminaryWithArtisticEvents = seminary.getArtisticevents()
               .then(artisticevents => {
                    seminary.dataValues.artisticevents = artisticevents;
                })
               .then(() => {
                return seminary;
               });
        promises.push(seminaryWithArtisticEvents);
        });
        return Promise.all(promises);
    }).then((seminaries) => {
            console.log(seminaries);
            res.json({seminaries : seminaries});
    }).catch(
            err => console.log(err)
    );
};