const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const Typologyse = sequelize.define('typologyse', {
    id : {
        type : Sequelize.INTEGER,
        autoIncrement : true,
        allowNull : false,
        primaryKey : true
    }
});

module.exports = Typologyse;