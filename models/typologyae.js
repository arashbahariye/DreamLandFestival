const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const Typologyae = sequelize.define('typologyae', {
    id : {
        type : Sequelize.INTEGER,
        autoIncrement : true,
        allowNull : false,
        primaryKey : true
    }
});

module.exports = Typologyae;