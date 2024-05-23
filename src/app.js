const express = require("express");
const exphbs = require("express-handlebars");
const session = require("express-session");
const socket = require("socket.io");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const initializePassport = require("./config/passport.config.js");
require("./database.js");

const app = express();
const PUERTO = 8080;

const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");
const viewsRouter = require("./routes/views.router.js");
const sessionRouter = require("./routes/session.router.js");
const userRouter = require("./routes/user.router.js");


//Middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static("./src/public"));


//Session
app.use(session({
    secret:"secretCoder",
    resave: true,
    saveUninitialized : true, 
    store: MongoStore.create({
        mongoUrl: "mongodb+srv://saidmanlucasp:43765294@ecommerce.lxw17lw.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=ecommerce", ttl: 10000
    })
}))


//Passport
app.use(passport.initialize());
app.use(passport.session());
initializePassport(); 


//Configuramos Handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");


//Rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/users", userRouter);
app.use("/api/sessions", sessionRouter);
app.use("/", viewsRouter);


//Listen
const httpServer = app.listen(PUERTO, () => {

    console.log(`Escuchando en el puerto http://localhost:${PUERTO}`);

});



//Desafio del chat en el ecommerce: 
const MessageModel = require("./models/message.model.js");
const io = new socket.Server(httpServer);

io.on("connection",  (socket) => {
    console.log("Nuevo usuario conectado");

    socket.on("message", async data => {

        //Guardo el mensaje en MongoDB: 
        await MessageModel.create(data);

        //Obtengo los mensajes de MongoDB y se los paso al cliente: 
        const messages = await MessageModel.find();
        console.log(messages);
        io.sockets.emit("message", messages);
     
    })
})