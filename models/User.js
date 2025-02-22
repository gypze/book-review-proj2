const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const bcrypt = require('bcrypt');

class User extends Model {
    checkPassword(loginPw) {
        return bcrypt.compareSync(loginPw, this.password);
    }
}


User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: false,
            validate: {
                isEmail: true,
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: true,
    
        },
        books: {
            type: DataTypes.TEXT,
            allowNull: true,
            get: function() {
                if(this.getDataValue('books') === null) {
                    return [];
                }
                return JSON.parse(this.getDataValue('books')) || [];
            },
            set: function(val) {
                if (val === null) {
                    return null;
                }
                return this.setDataValue('books', JSON.stringify(val));
            }
        },
        Falcore: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },

    },
   
 {
        hooks: {
            beforeCreate: async (newUserData) => {
                newUserData.password = await bcrypt.hash(newUserData.password, 10);
                return newUserData;
            },
            beforeUpdate: async (updatedUserData) => {
                updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
                return updatedUserData;
            },
        },
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'user',
    }
);

module.exports = User;