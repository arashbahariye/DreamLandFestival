const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const Ticket = sequelize.define('ticket', {
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
    name : {
        type : Sequelize.STRING,
        allowNull : false,
    }
});

module.exports = Ticket;