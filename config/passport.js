const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// Referencia al modelo donde vamos a authenticar
const Usuarios = require('../models/Usuarios');

// local strategy - Login con credenciales propias (usuario y password)
passport.use (
  new LocalStrategy (
    // por default passport espera un (usuario y password)
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    async (email, password, done) => {
      try {
        const usuario = await Usuarios.findOne({
          where: {
            email,
            activo: 1
          }
        });

        // El usuario existe, passowrd incorrecto
        if(!usuario.verificarPassword(password)) {
          return done(null, false, {
            message: 'Cuenta \"o\" Contraseña no validos'
          });
        }
        // El email existe, y el passowrd correcto
        return done(null, usuario);
      } catch (error) {
        // Ese usuario no existe
        return done(null, false, {
          message: 'Cuenta \"o\" Contraseña no validos'
        });
      }
    }
  )
);

// serealizar el usuario
passport.serializeUser((usuario, callback) => {
  callback(null, usuario);
});

// deserializar el usuario
passport.deserializeUser((usuario, callback) => {
  callback(null, usuario);
});

// exportar
module.exports = passport;