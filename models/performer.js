const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const Performer = sequelize.define('performer', {
    id : {
        type : Sequelize.INTEGER,
        autoIncrement : true,
        allowNull : false,
        primaryKey : true
    },
    name : {
        type : Sequelize.STRING,
        allowNull : false,
    },
    company_members : {
        type : Sequelize.STRING,
        allowNull : true,
    },
    current_affiliation : {
        type : Sequelize.STRING,
        allowNull : true,
    },
    main_achievements : {
        type : Sequelize.STRING,
        allowNull : true,
    },
    image : { //photo gallery
        type : Sequelize.STRING,
        allowNull : true
    },
    details : {
        type : Sequelize.STRING,
        allowNull : true,
    },
    isCompany : {
        type : Sequelize.BOOLEAN,
        allowNull : false,
    }
});

module.exports = Performer;