const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const Artistic_Event = sequelize.define('artisticevent', {
    id : {
        type : Sequelize.INTEGER,
        autoIncrement : true,
        allowNull : false,
        primaryKey : true
    },
    title : {
        type : Sequelize.STRING,
        allowNull : false,
    },
    date : {
        type : Sequelize.STRING,
        allowNull : true,
    },
    factsheet : { //it must include the date
        type : Sequelize.STRING,
        allowNull : true,
    },
    abstract : {
        type : Sequelize.STRING,
        allowNull : true,
    },
    image : { //photo gallery
        type : Sequelize.STRING,
        allowNull : true
    }
});

module.exports = Artistic_Event;