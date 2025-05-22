import express from 'express'
import {
  createCart,
  getCartById,
  addProductToCart,
  updateProductQuantity,
  removeProductFromCart,
  emptyCart,
  updateAllProductsInCart // <-- Agregado
} from '../controllers/cart.controller.js'

const router = express.Router()

// Crear carrito vacío
router.post('/', createCart)

// Obtener carrito por ID (con productos poblados)
router.get('/:cid', getCartById)

// Agregar producto al carrito (AHORA EN PLURAL)
router.post('/:cid/products/:pid', addProductToCart)

// Actualizar TODOS los productos del carrito (PUT requerido por la consigna)
router.put('/:cid', updateAllProductsInCart)

// Actualizar cantidad de producto en carrito (AHORA EN PLURAL)
router.put('/:cid/products/:pid', updateProductQuantity)

// Eliminar producto del carrito (AHORA EN PLURAL)
router.delete('/:cid/products/:pid', removeProductFromCart)

// Vaciar carrito
router.delete('/:cid', emptyCart)

export default router