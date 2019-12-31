const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const Seminary = sequelize.define('seminary', {
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
        type : Sequelize.DATE,
        allowNull : true,
    },
    location : {
        type : Sequelize.STRING,
        allowNull : true
    }
});

module.exports = Seminary;