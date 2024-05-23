const express = require("express");
const router = express.Router();
const ProductManager = require("../controllers/ProductManager.js");
const CartManager = require("../controllers/CartManager.js");
const productManager = new ProductManager();
const cartManager = new CartManager();


router.get("/products", async (req, res) => {

    try {

        const { page = 1, limit = 2 } = req.query;
        const productos = await productManager.getProducts({
            page: parseInt(page),
            limit: parseInt(limit)
        });
 
        const nuevoArray = productos.docs.map(producto => {
            const { _id, ...rest } = producto.toObject();
            return rest;
        });
 
        res.render("products", {
            user: req.session.user,
            productos: nuevoArray,
            hasPrevPage: productos.hasPrevPage,
            hasNextPage: productos.hasNextPage,
            prevPage: productos.prevPage,
            nextPage: productos.nextPage,
            currentPage: productos.page,
            totalPages: productos.totalPages
        });
 
    } catch (error) {

        console.error("Error al obtener productos", error);
        res.status(500).json({error: "Error interno del servidor"});

    }

});


router.get("/carts/:cid", async (req, res) => {

    const cartId = req.params.cid;
 
    try {

        const carrito = await cartManager.getCarritoById(cartId);
 
        if (!carrito) {
            console.log("No existe el carrito con ese ID");
            return res.status(404).json({error: "Carrito no encontrado"});
        }
 
        const productosEnCarrito = carrito.products.map(item => ({
            product: item.product.toObject(),
            //Lo convertimos a objeto para pasar las restricciones de Exp Handlebars. 
            quantity: item.quantity
        }));
 
        res.render("carts", { productos: productosEnCarrito });

    } catch (error) {

        console.error("Error al obtener el carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });

    }

});


router.get("/", async (req, res) => {

    res.render("chat");

})


router.get("/login", (req, res) => {

    // Verifica si el usuario ya está logueado y redirige a la página de perfil si es así
    if (req.session.login) {

        return res.redirect("/products");

    }
 
    res.render("login");

});

 
router.get("/register", (req, res) => {

    // Verifica si el usuario ya está logueado y redirige a la página de perfil si es así
    if (req.session.login) {

        return res.redirect("/profile");

    }

    res.render("register");

});


router.get("/profile", (req, res) => {

    // Verifica si el usuario está logueado
    if (!req.session.login) {

        // Redirige al formulario de login si no está logueado
        return res.redirect("/login");

    }
 
    // Renderiza la vista de perfil con los datos del usuario
    res.render("profile", { user: req.session.user });

});


module.exports = router;