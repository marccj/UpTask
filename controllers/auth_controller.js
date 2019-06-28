const passport = require('passport');
const crypto = require('crypto');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const bcrypt = require('bcrypt');
// const Op = require('sequelize').Op;
const Users = require('../models/Users');
const sendMail = require('../handler/mailer');

exports.authenticateUser = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos campos son obligatorios para iniciar sesión'
});

exports.closeSession = (req, res) => {
    req.session.destroy(()=>{
        res.redirect('/'); // al cerrar sesion vuelve a iniciar sesion
    });
};

// funcion para revisar si el usuario está autenticado o no

exports.userAuthenticated = (req, res, next) => {
    // si el usuario esta autenticado adelante
    if(req.isAuthenticated()){
        return next();
    }
    // si no esta autenticado redirigir al formulario
    return res.redirect('/iniciar-sesion');
};

//genera un token si el usuario es valido
exports.sendToken = async (req, res, next) => {
    // verificar que el usuario existe
    const user = await Users.findOne({where: {email: req.body.email}});
    // si no existe el usuario
    if(!user){
        req.flash('error', 'No existe la cuenta con el correo electronico introducido');
        res.redirect('/recuperar-password');
    }

    // usuario existe, generamos token
    user.token = crypto.randomBytes(20).toString('hex');
    user.expiration = Date.now() + 3600000;

    // guardar en base de datos
    await user.save();

    // url de reset
    const resetUrl = `http://${req.headers.host}/recuperar-password/${user.token}`;
    
    //envia el correo con el token
    await sendMail.send({
        user,
        subject: 'Password Reset',
        resetUrl,
        archivo: 'recover_password'
    });

    req.flash('correcto', 'Se envió un mensaje a tu correo electronico');
    res.redirect('/iniciar-sesion');
};

exports.resetPasswordForm = async (req, res) => {
    const user = await Users.findOne({
        where: {
            token: req.params.token
        }
    });
    
    if(!user) {
        req.flash('error', 'No válido');
        res.redirect('/recuperar-password')
    }
    
    // formulario para generar nueva contraseña
    res.render('users/reset_password', {
        pageTitle: 'Reestablecer Contraseña - UpTask'
    });
};

exports.resetPasswordSubmit = async (req, res) => {
    // comprobamos que la fecha de expiracion no supera 1h desde que se creó
    const user = await Users.findOne({
        where: {
            token: req.params.token,
            expiration: {
                [Op.gte] : Date.now()
            }
        }
    });

    if(!user) {
        req.flash('error', 'No valido');
        res.redirect('/recuperar-password');
    }

    //hasheamos el nuevo password
    user.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    user.token = null;
    user.expiration = null;

    await user.save();

    req.flash('correcto', 'Tu contraseña se ha modificado correctamente');
    res.redirect('/iniciar-sesion');

};