import { Router } from 'express'
import { ProductModel } from './models/Product.model.js'

const router = Router()

// Vista general de productos con paginación
router.get('/products', async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query

    const options = {
      limit: parseInt(limit),
      page: parseInt(page),
      lean: true,
    }

    if (sort) options.sort = { price: sort === 'asc' ? 1 : -1 }

    const filters = {}
    if (query) {
      filters.$or = [
        { category: { $regex: query, $options: 'i' } },
        { title: { $regex: query, $options: 'i' } },
      ]
    }

    const result = await ProductModel.paginate(filters, options)

    // Armamos links de paginación
    const baseUrl = '/products?'
    const prevLink = result.hasPrevPage ? `${baseUrl}page=${result.prevPage}&limit=${limit}` : null
    const nextLink = result.hasNextPage ? `${baseUrl}page=${result.nextPage}&limit=${limit}` : null

    res.render('products', {
      products: result.docs,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      totalPages: result.totalPages,
      prevLink,
      nextLink,
      cartId: '682582878f14fb618c8369c5',
    })
  } catch (error) {
    console.error(error)
    res.status(500).send('Error al cargar los productos.')
  }
})

// Vista de detalle de un producto
router.get('/products/:pid', async (req, res) => {
  try {
    const { pid } = req.params
    const product = await ProductModel.findById(pid).lean()

    if (!product) {
      return res.status(404).send('Producto no encontrado.')
    }

    const cartId = '682582878f14fb618c8369c5' // ID de carrito de prueba

    res.render('productDetails', { product, cartId })
  } catch (error) {
    console.error(error)
    res.status(500).send('Error al cargar el detalle del producto.')
  }
})

export default router
