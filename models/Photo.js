const sequelize = require("../db");
const { Sequelize, Model } = require("sequelize");

class Photo extends Model {
}

const photoSchema = {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1,
        primaryKey: true
    },
    url: {
        type: Sequelize.STRING,
        allowNull: false
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false
    },
    uploadedBy: {
        type: Sequelize.UUID,
        allowNull: false
    },
    privacy:{
        type: Sequelize.STRING,
        defaultValue:'public'
    }
};

Photo.init(photoSchema, {
    sequelize,
    tableName: "photos"
});


module.exports = Photo;
