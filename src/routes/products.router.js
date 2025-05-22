import { Router } from 'express'
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/product.controller.js'

const router = Router()

// Rutas de productos
router.get('/', getAllProducts)
router.get('/:pid', getProductById)
router.post('/', createProduct)
router.put('/:pid', updateProduct)
router.delete('/:pid', deleteProduct)

export default router