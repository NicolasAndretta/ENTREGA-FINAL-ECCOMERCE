import { ProductModel } from '../models/product.model.js'

// Obtener todos los productos con paginación, filtros y ordenamiento
export const getAllProducts = async (req, res) => {
  try {
    const {
      limit = 10,
      page = 1,
      sort,
      query
    } = req.query

    const filtro = {}

    if (query) {
      if (query === 'true' || query === 'false') {
        filtro.status = query === 'true'
      } else {
        filtro.category = query
      }
    }

    let sortOption = {}
    if (sort === 'asc') sortOption.price = 1
    else if (sort === 'desc') sortOption.price = -1

    const result = await ProductModel.paginate(
      filtro,
      {
        limit: parseInt(limit),
        page: parseInt(page),
        sort: sortOption,
        lean: true
      }
    )

    const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`

    const prevLink = result.hasPrevPage
      ? `${baseUrl}?page=${result.prevPage}&limit=${limit}${sort ? `&sort=${sort}` : ''}${query ? `&query=${query}` : ''}`
      : null

    const nextLink = result.hasNextPage
      ? `${baseUrl}?page=${result.nextPage}&limit=${limit}${sort ? `&sort=${sort}` : ''}${query ? `&query=${query}` : ''}`
      : null

    res.status(200).json({
      status: 'success',
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink,
      nextLink
    })

  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message })
  }
}

// Obtener un producto por ID
export const getProductById = async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.pid).lean()
    if (!product) {
      return res.status(404).json({ status: 'error', message: 'Producto no encontrado' })
    }
    res.status(200).json({ status: 'success', payload: product })
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message })
  }
}

// Crear un nuevo producto
export const createProduct = async (req, res) => {
  try {
    const { code } = req.body
    if (!code) {
      return res.status(400).json({ status: 'error', message: 'El campo code es obligatorio y único' })
    }

    const nuevoProducto = await ProductModel.create(req.body)
    res.status(201).json({ status: 'success', payload: nuevoProducto })
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message })
  }
}

// Actualizar un producto
export const updateProduct = async (req, res) => {
  try {
    const updated = await ProductModel.findByIdAndUpdate(
      req.params.pid,
      req.body,
      { new: true }
    ).lean()

    if (!updated) {
      return res.status(404).json({ status: 'error', message: 'Producto no encontrado' })
    }

    res.status(200).json({ status: 'success', payload: updated })
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message })
  }
}

// Eliminar un producto
export const deleteProduct = async (req, res) => {
  try {
    const deleted = await ProductModel.findByIdAndDelete(req.params.pid)
    if (!deleted) {
      return res.status(404).json({ status: 'error', message: 'Producto no encontrado' })
    }
    res.status(200).json({ status: 'success', message: 'Producto eliminado' })
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message })
  }
}
