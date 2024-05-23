const express = require("express");
const router = express.Router();
const CartManager = require("../controllers/CartManager.js");
const cartManager = new CartManager();
const CartModel = require("../models/carts.model.js");


router.post("/", async (req, res) => {

    try {

      const carrito = await cartManager.crearCarrito();
      res.status(200).json({ message: "Carrito creado con exito", carrito });

    } catch (error) {

      res.status(500).json({ message: "Error interno del servidor" });
      console.log(error);

    }

});


//Creamos un nuevo carrito
router.post("/", async (req, res) => {

    try {
        
        const nuevoCarrito = await cartManager.crearCarrito();
        res.json(nuevoCarrito);

    } catch (error) {
        
        res.status(500).json({error: "Error interno del servidor"});

    }

})


//Listamos productos que pertenecen a un carrito determinado
router.get("/:cid", async (req, res) => {

    const cartId = req.params.cid;

    try {
        
        const carrito = await CartModel.findById(cartId);

        if (!carrito) {

            console.log("No existe el carrito con ese ID");
            return res.status(404).json({ error: "Carrito no encontrado" });

        }

        return res.json(carrito.products);


    } catch (error) {

        res.status(500).json({error: "Error interno del servidor"});
        
    }

})


//Agregar productos a distintos carritos:
router.post("/:cid/product/:pid", async (req, res) => {

    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1; 

    try {

        const actualizarCarrito = await cartManager.agregarProductoAlCarrito(cartId,productId, quantity);
        res.json(actualizarCarrito.products);

    } catch (error) {

        console.error("Error al agregar producto al carrito", error);
        res.status(500).json({error: "Error interno del servidor"});

    }

})


//Eliminamos un producto especifico del carrito: 
router.delete("/:cid/product/:pid", async (req, res) => {

    try {

        const cartId = req.params.cid;
        const productId = req.params.pid;

        const updatedCart = await cartManager.eliminarProductoDelCarrito(cartId, productId);

        res.json({message: "Producto eliminado del carrito correctamente", updatedCart});

    } catch (error) {
        
        console.error("Error al eliminar el producto del carrito", error);
        res.status(500).json({error: "Error interno del servidor"});

    }

})


//Actualizamos productos del carrito: 
router.put("/:cid", async (req, res) => {

    const cartId = req.params.cid;
    const updatedProducts = req.body;

    try {

        const updatedCart = await cartManager.actualizarCarrito(cartId, updatedProducts);
        res.json(updatedCart);

    } catch (error) {

        console.error("Error al actualizar el carrito", error);
        res.status(500).json({error: "Error interno del servidor"});

    }

})


//Actualizamos las cantidades de productos
router.put("/:cid/product/:pid", async (req, res) => {

    try {

        const cartId = req.params.cid;
        const productId = req.params.pid;
        const newQuantity = req.body.quantity;

        const updatedCart = await cartManager.actualizarCantidadDeProducto(cartId, productId, newQuantity);

        res.json({message: "Cantidad del producto actualizada correctamente", updatedCart});

    } catch (error) {

        console.error("Error al actualizar la cantidad del producto en el carrito", error);
        res.status(500).json({error: "Error interno del servidor"});

    }

})


//Vaciamos el carrito: 
router.delete("/:cid", async (req, res) => {

    try {

        const cartId = req.params.cid;
        
        const updatedCart = await cartManager.vaciarCarrito(cartId);

        res.json({message: "Todos los productos del carrito fueron eliminados correctamente", updatedCart});

    } catch (error) {

        console.error("Error al vaciar el carrito", error);
        res.status(500).json({error: "Error interno del servidor"});

    }

})



module.exports = router;