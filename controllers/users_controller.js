const Users = require('../models/Users');
const sendMail = require('../handler/mailer');

exports.usersNewForm = (req, res) => {
    res.render('users/sign_up', {
        pageTitle: 'Crear cuenta en UpTask',
    });
};

exports.usersNewSubmit = async (req, res) => {
    // leer los datos
    const {email, password} = req.body;

    try{
        // crear usuario
        await Users.create({
            email,
            password
        });

        // crear una url de confirmacion
        const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`;

        // crear el objeto de usuario
        const user = {
            email
        }

        // enviar email
        await sendMail.send({
            user,
            subject: 'Confirmar cuenta en UpTask',
            confirmarUrl,
            archivo: 'account_confirm'
        });

        // redirigir al usuario
        req.flash('correcto', 'Hemos enviado un correo a tu email para confirmar la cuenta');
        res.redirect('/iniciar-sesion');

    } catch (error) {
        req.flash('error', error.errors.map(error => error.message));
        res.render('users/sign_up', {
            pageTitle: 'Crear cuenta en UpTask',
            messages: req.flash(),
            email,
            password
        });
    }
    
};

// cambia el estado de una cuenta
exports.accountConfirm = async (req, res) => {
    const user = await Users.findOne({
        where: {
            email: req.params.email
        }
    });

    //si no existe el usuario
    if(!user){
        req.flash('error', 'No valido'),
        res.redirect('/crear-cuenta');
    }

    user.activo = 1;
    await user.save();

    req.flash('correcto', 'La cuenta ha sido confirmada correctamente');
    res.redirect('/iniciar-sesion');
};

exports.usersSignIn = async (req, res) => {
    const { error } = res.locals.messages;
    res.render('users/sign_in', {
        pageTitle: 'Iniciar sesión en UpTask',
        error
    });
};

exports.recoverPasswordForm = async (req, res) => {
    res.render('users/recover_password', {
        pageTitle: 'UpTask - Recuperar Contraseña'
    });
};

