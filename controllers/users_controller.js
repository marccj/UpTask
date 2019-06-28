const Users = require('../models/Users');

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