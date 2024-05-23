//Importamos los módulos: 
const passport = require("passport");
const local = require("passport-local");

//Estrategia con GitHub:
const GitHubStrategy = require("passport-github2");

//Traemos el UsuarioModel y las funciones de bcryp:
const UsuarioModel = require("../models/user.model.js");
const { createHash, isValidPassword } = require("../utils/hashbcrypt.js");


const LocalStrategy = local.Strategy;

const initializePassport = () => {
    //Vamos a armar nuestras estrategias: Registro y Login. 

    passport.use("register", new LocalStrategy({
        //Le digo que quiero acceder al objeto request
        passReqToCallback: true,
        usernameField: "email"
    }, async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;

        try {
            //Verificamos si ya existe un registro con ese email: 
            let usuario = await UsuarioModel.findOne({ email });

            if (usuario) {
                return done(null, false);
            }

            //Si no existe voy a crear un registro de usuario nuevo: 

            let nuevoUsuario = {
                first_name,
                last_name,
                email,
                age,
                password: createHash(password)
            }

            let resultado = await UsuarioModel.create(nuevoUsuario);
            return done(null, resultado);
            //Si todo resulta bien, podemos mandar done con el usuario generado. 
        } catch (error) {
            return done(error);
        }
    }))

    //Agregamos otra estrategia para el "Login".
    passport.use("login", new LocalStrategy({
        usernameField: "email"
    }, async (email, password, done) => {

        try {
            //Primero verifico si existe un usuario con ese email: 
            let usuario = await UsuarioModel.findOne({ email });

            if (!usuario) {
                console.log("Este usuario no existe");
                return done(null, false);
            }

            //Si existe verifico la contraseña: 
            if (!isValidPassword(password, usuario)) {
                return done(null, false);
            }

            return done(null, usuario);


        } catch (error) {
            return done(error);
        }
    }))

    //Serializar y deserializar: 

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        let user = await UsuarioModel.findById({ _id: id });
        done(null, user);
    })

    //Acá generamos la nueva estrategia con GitHub: 

    passport.use("github", new GitHubStrategy({
        clientID: "Iv23liYuF9zEA48RJu8G",
        clientSecret: "f78c360af0155a657ce810fb77e2b0c6512ad788",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback"
    }, async (accessToken, refreshToken, profile, done) => {
        //Veo los datos del perfil
        console.log("Profile:", profile);

        try {
            let usuario = await UsuarioModel.findOne({ email: profile._json.email });

            if (!usuario) {
                let nuevoUsuario = {
                    first_name: profile._json.name,
                    last_name: "",
                    age: 22,
                    email: profile._json.email,
                    password: ""
                }

                let resultado = await UsuarioModel.create(nuevoUsuario);
                done(null, resultado);
            } else {
                done(null, usuario);
            }
        } catch (error) {
            return done(error);
        }
    }))
}

module.exports = initializePassport;