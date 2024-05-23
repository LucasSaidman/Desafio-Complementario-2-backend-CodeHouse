//Acá hacemos la conexión con MONGODB: 

//1) Instalamos mongoose: npm i mongoose. 
const mongoose = require("mongoose");

//2) Crear una conexión con la base de datos

mongoose.connect("mongodb+srv://saidmanlucasp:43765294@ecommerce.lxw17lw.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=ecommerce")
    .then(() => console.log("Conexion exitosa"))
    .catch((error) => console.log("Error en la conexion", error))