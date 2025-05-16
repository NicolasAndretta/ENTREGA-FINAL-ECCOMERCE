import express from 'express'
import {
  createCart,
  getCartById,
  addProductToCart,
  updateProductQuantity,
  removeProductFromCart,
  emptyCart
} from '../controllers/cart.controller.js'

const router = express.Router()

// Crear carrito vacío
router.post('/', createCart)

// Obtener carrito por ID (con productos poblados)
router.get('/:cid', getCartById)

// Agregar producto al carrito
router.post('/:cid/product/:pid', addProductToCart)

// Actualizar cantidad de producto en carrito
router.put('/:cid/product/:pid', updateProductQuantity)

// Eliminar producto del carrito
router.delete('/:cid/product/:pid', removeProductFromCart)

// Vaciar carrito
router.delete('/:cid', emptyCart)

export default router
