const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const Similarity = sequelize.define('similarity', {
    id : {
        type : Sequelize.INTEGER,
        autoIncrement : true,
        allowNull : false,
        primaryKey : true
    }
});

module.exports = Similarity;