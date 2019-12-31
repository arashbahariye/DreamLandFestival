const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const Performance = sequelize.define('performance', {
    id : {
        type : Sequelize.INTEGER,
        autoIncrement : true,
        allowNull : false,
        primaryKey : true
    }
});

module.exports = Performance;