const passport = require("passport");
const LocalStrategy = require("passport-local");

// referencia al modelo que vamos a autenticar
const Users = require('../models/Users');

// local strategy - Login con usuario y password tradicional
passport.use(
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email, password, done) => {
            try {
                const user = await Users.findOne({
                    where: {
                        email: email,
                        activo: 1
                    }
                });
                // el usuario existe, password incorrecto
                if(!user.verifyPassword(password)){
                    return done(null, false, { message: 'La contraseña es incorrecta' });
                }
                // el email coincide y el password tambien
                return done(null, user);
            } catch (error) {
                // el usuario no existe
                return done(null, false, { message: 'El correo electronico introducido no existe' });
            }
        }
    )
);

// serializar el usuario
passport.serializeUser((user, callback) => {
    callback(null, user);
});
// deserializar el usuario
passport.deserializeUser((user, callback) => {
    callback(null, user);
});
//exportar
module.exports = passport;