const express = require("express");
const router = express.Router();
const ProductManager = require("../controllers/ProductManager.js");
const productManager = new ProductManager();


// Obtengo todos los productos del JSON
router.get("/", async (req, res) => {

    try {

        const { limit = 10, page = 1, sort, query } = req.query;

        const productos = await productManager.getProducts({
            limit: parseInt(limit),
            page: parseInt(page),
            sort,
            query,
        });

        res.json({
            status: 'success',
            payload: productos,
            totalPages: productos.totalPages,
            prevPage: productos.prevPage,
            nextPage: productos.nextPage,
            page: productos.page,
            hasPrevPage: productos.hasPrevPage,
            hasNextPage: productos.hasNextPage,
            prevLink: productos.hasPrevPage ? `/api/products?limit=${limit}&page=${productos.prevPage}&sort=${sort}&query=${query}` : null,
            nextLink: productos.hasNextPage ? `/api/products?limit=${limit}&page=${productos.nextPage}&sort=${sort}&query=${query}` : null,
        });

    } catch (error) {

        console.error("Error al obtener los productos: ", error);
        res.status(500).json({error: "Error interno del servidor"});

    }

});


// Obtener un producto por ID
router.get("/:pid", async (req, res) => {
    
    const id = req.params.pid;

    try {

        const producto = await productManager.getProductById(id);

        if (!producto) {

            return res.json({error: "Producto no encontrado"});

        }

        res.json(producto);

    } catch (error) {

        console.error("Error al obtener producto", error);
        res.status(500).json({error: "Error interno del servidor"});

    }

});


//Agregar un nuevo producto
router.post("/", async (req, res) => {

    const nuevoProducto = req.body;

    try {

        await productManager.addProduct(nuevoProducto);
        res.status(201).json({message: "Producto agregado exitosamente"});

    } catch (error) {

        res.status(500).json({error: "Error interno del servidor"});

    }

})


//Actualizar por ID
router.put("/:pid", async (req, res) => {

    const id = req.params.pid;
    const productoActualizado = req.body;

    try {

        await productManager.updateProduct(id, productoActualizado);
        res.json({message: "Producto actualizado correctamente"});

    } catch (error) {

        res.status(500).json({error: "Error interno del servidor"});

    }

})


//Eliminar producto

router.delete("/:pid", async (req, res) => {

    const id = req.params.pid;

    try {

        await productManager.deleteProduct(id);
        res.json({messaje: "Producto eliminado exitosamente"});

    } catch (error) {

        res.status(500).json({error: "Error interno del servidor"});

    }
    
})


//Productos para Postman:

//Agregar Productos
/*
{
    "title": "Teclado",
    "description": "Logitech G413 Carbon",
    "price": 55000,
    "thumbnail": "https://d2r9epyceweg5n.cloudfront.net/stores/001/715/976/products/teclado-logitech1-a0d0f03734ef17c46216506377238422-1024-1024.jpg",
    "code": "G413",
    "stock": 15
}
{
    "title": "Microfono",
    "description": "HyperX Quadcast",
    "price": 78000,
    "thumbnail": "https://cellplay.com.ar/img/Public/producto-137331-0.jpg",
    "code": "HX-QC",
    "stock": 10
}
*/

//Actualizar Producto
/*
{
    "title": "Microfono",
    "description": "HyperX Quadcast",
    "price": 500000,
    "thumbnail": "https://cellplay.com.ar/img/Public/producto-137331-0.jpg",
    "code": "HX-QC",
    "stock": 1
}
*/

module.exports = router;