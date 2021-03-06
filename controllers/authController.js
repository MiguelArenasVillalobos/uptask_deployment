const passport = require('passport');
const Usuarios = require('../models/Usuarios');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const enviarEmail = require('../handlers/email');

exports.autenticarUsuario = passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/iniciar-sesion',
  failureFlash: true,
  badRequestMessage: 'Ambos campos son necesarios'
});

// Función para revisar si el usuario esta logeado ono
exports.usuarioAutenticado = (req, res, next) => {
  // si el usuario esta autenticado, adelante
  if(req.isAuthenticated()) {
    return next();
  }

  // si no esta autenticado, redirigir al formulario
  return res.redirect('/iniciar-sesion');

}

// función para cerrar sesión
exports.cerrarSesion = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/iniciar-sesion'); // al cerrar sesión nos lleva al login
  });
}

// genera un token si el usuario es valido
exports.enviarToken = async (req, res) => {
  // verificar que el usuario existe
  const {email} = req.body
  const usuario = await Usuarios.findOne({where: { email }});

  // Si no existe el usuario
  if(!usuario) {
    req.flash('error', 'No existe esa cuenta');
    res.redirect('/reestablecer');
  }

  // usuario existe
  usuario.token = crypto.randomBytes(20).toString('hex');
  usuario.expiracion = Date.now() + 3600000;

  // guardarlos en la base de datos
  await usuario.save();

  // url de resert
  const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`;

  // Enviar el Correo con el Token
  await enviarEmail.enviar({
    usuario,
    subject: 'Cambio de Contraseña',
    resetUrl,
    archivo : 'reestablecer-password'
  });

  // terminar
  req.flash('correcto', 'Se te ha enviado un email')
  res.redirect('/iniciar-sesion');
}

exports.validarToken = async (req, res) => {
  const usuario = await Usuarios.findOne({
    where: {
      token: req.params.token
    }
  });

  // si no encuentra el usuario
  if(!usuario) {
    req.flash('error', 'Acción no Válida');
    res.redirect('/reestablecer');
  }

  // Formulario para generar el password
  res.render('resetPassword', {
    nombrePagina: 'Reestablecer Contraseña'
  });

}

// Cambia el password por uno nuevo
exports.actualizarPassword = async (req, res) => {
  // verica el token valido pero también la fecha de expiración
  const usuario = await Usuarios.findOne({
    where: {
      token: req.params.token,
      expiracion: {
        [Op.gte] : Date.now()
      }
    }
  });

  // verificamos si el usuario existe
  if(!usuario) {
    req.flash('error', 'Acción no Válida');
    req.redirect('/reestablecer');
  }


  // hashear el password
  usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
  usuario.token = null;
  usuario.expiracion = null;

  // guardamos el nuevo password
  await usuario.save();

  req.flash('correcto', 'Tu password se ha modificado correctamente');
  res.redirect('/iniciar-sesion');
}
