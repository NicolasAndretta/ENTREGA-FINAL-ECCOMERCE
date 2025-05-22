import { Router } from 'express'
import { ProductModel } from '../models/product.model.js'
import { CartModel } from '../models/cart.model.js'

const router = Router()

// Redirigir la raíz a /products
router.get('/', (req, res) => {
  res.redirect('/products')
})

// Vista general de productos con paginación, filtros y orden
router.get('/products', async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, category, status } = req.query

    const options = {
      limit: parseInt(limit),
      page: parseInt(page),
      lean: true,
    }

    if (sort) options.sort = { price: sort === 'asc' ? 1 : -1 }

    // Filtros por categoría y disponibilidad (status)
    let filters = {}
    if (category) {
      filters.category = category
    }
    if (status === 'true' || status === 'false') {
      filters.status = status === 'true'
    }

    const result = await ProductModel.paginate(filters, options)

    // Armado de links de paginación con query params actuales (sin duplicar page)
    const paramString = [
      limit ? `limit=${limit}` : '',
      sort ? `sort=${sort}` : '',
      category ? `category=${category}` : '',
      (status === 'true' || status === 'false') ? `status=${status}` : ''
    ].filter(Boolean).join('&')

    const baseUrl = '/products'
    const prevLink = result.hasPrevPage
      ? `${baseUrl}?page=${result.prevPage}${paramString ? `&${paramString}` : ''}`
      : null
    const nextLink = result.hasNextPage
      ? `${baseUrl}?page=${result.nextPage}${paramString ? `&${paramString}` : ''}`
      : null

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
      limit,
      sort,
      category,
      status,
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

// Vista amigable del carrito
router.get('/cart', async (req, res) => {
  const cartId = '682582878f14fb618c8369c5' // <-- Usa lógica de usuario si tienes auth
  try {
    const cart = await CartModel.findById(cartId).populate('products.productId').lean()
    if (!cart) return res.status(404).send('Carrito no encontrado')
    res.render('cart', { cart })
  } catch (error) {
    console.error(error)
    res.status(500).send('Error al mostrar el carrito.')
  }
})

export default router