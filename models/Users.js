const Sequelize = require('sequelize');
const db = require('../config/db');
const Projects = require('../models/Projects');
const bcrypt = require('bcrypt');

const Users = db.define('users', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: Sequelize.STRING(60),
        allowNull: false,
        validate: {
            isEmail: {
                msg: 'Escribe un correo electronico valido'
            },
            notEmpty: {
                msg: 'La contraseña no puede ir vacia'
            }
        },
        unique: {
            args: true,
            msg: 'Usuario ya registrado'
        }
    },
    password: {
        type: Sequelize.STRING(60),
        allowNull: false,
        validate: {
            notEmpty:{
                msg: 'La contraseña no puede ir vacia'
            }
        }
    },
    token: Sequelize.STRING,
    expiration: Sequelize.DATE
}, {
        hooks: {
            beforeCreate(user) {
                user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10));
            }
        }
    });

// metodos custom
Users.prototype.verifyPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
}

Users.hasMany(Projects);

module.exports = Users;