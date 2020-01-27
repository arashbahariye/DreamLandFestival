const { validationResult } = require('express-validator/check');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const path = require('path');
const fs = require('fs');

const Artisticevent = require('../models/artisticevent');
const Seminary = require('../models/seminary');
const Type = require('../models/type');
const Typologyae = require('../models/typologyae');
const Typologyse = require('../models/typologyse');
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
        res.json({data : artisticevents});
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
            res.json({data : artisticevent});
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
            res.json({data : artisticevent});
        }).catch(
            err => console.log(err)
        );
};

exports.getSameDayEvents = (req, res, next) => {
    const artisticeventId = req.params.id;
    Artisticevent.findByPk(artisticeventId)
    .then(artisticevent => {
        if(!artisticevent) {
            res.status(404).json({
                messages : 'Artistic Event Not Found',
            });
        }
        var promises = [];
        var artisticeventWithSameDay = Artisticevent.findAll({where : {date : artisticevent.date}})
        .then(sameday => {
            var pos = -1;
            for(var i = 0; i < sameday.length; ++i) {
                if(sameday[i].dataValues.title == artisticevent.dataValues.title) {
                    pos = i;
                    sameday.splice(pos, 1);;
                }
            }
            artisticevent.dataValues.sameday_artisticevents = sameday;
         }).then(() => {
             return artisticevent;
        });
        artisticeventWithSameDay = Seminary.findAll({where : {date : artisticevent.date}})
        .then(sameday => {
            artisticevent.dataValues.sameday_seminaries = sameday;
        }).then(() => {
            return artisticevent;
        });
        promises.push(artisticeventWithSameDay);
        return Promise.all(promises);
        }).then((artisticevent) => {
            res.json({data : artisticevent});
        }).catch(
            err => console.log(err)
        );
};

exports.searchArtisticeventByTitle = (req, res, next) => {
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
            res.json({data : artisticevents});
    }).catch(
            err => console.log(err)
    );
};

/*
exports.searchArtisticeventByDate = (req, res, next) => {
    const date = req.query.date;

    Artisticevent.findAll({where : {date : date}})
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
*/

exports.searchEventsByDate = (req, res, next) => {
    const date = req.query.date;
    Artisticevent.findAll({where : {date : date}})
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
        Seminary.findAll({where : {date : date}})
        .then(seminaries => {
            res.json({
                data : artisticevents,
                data : seminaries
            });
        })
    }).catch(
            err => console.log(err)
    );
};

exports.searchEventsByType = (req, res, next) => {
    const type = req.query.type;
    Type.findAll({where : {name : type}})
    .then(types => {
        const chosen_type = types[0];
        const artisticevents_ = chosen_type.getArtisticevents().then(artisticevents => {
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
        })
        .then((artisticevents) => {
            return artisticevents;
        });
        return artisticevents_;
    }).then((artisticevents) => {
        
        Type.findAll({where : {name : type}})
        .then(types => {
            const chosen_type = types[0];
            const seminaries_ = chosen_type.getSeminaries().then(seminaries => {
                var promises = [];
                seminaries.forEach(seminary => {
                    const seminaryWithArtisticevents = seminary.getArtisticevents()
                           .then(artisticevents => {
                                seminary.dataValues.artisticevents = artisticevents;
                            })
                           .then(() => {
                           return seminary;
                           });
                    promises.push(seminaryWithArtisticevents);
                    });
                return Promise.all(promises);
            })
            .then((seminaries) => {
                return seminaries;
            });
           return seminaries_;
        })
        .then(seminaries => {
            res.json({
                data : artisticevents,
                data : seminaries
            });
        });
    }).catch(
        err => console.log(err)
    );
};

exports.getTypes = (req, res, next) => {
    Type.findAll()
    .then(types => {
        res.json({data : types});
    }).catch(
        err => console.log(err)
    );
};