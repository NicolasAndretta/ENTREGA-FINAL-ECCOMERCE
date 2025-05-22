import { ProductModel } from '../models/product.model.js'

// Obtener todos los productos con paginación, filtros y ordenamiento
export const getAllProducts = async (req, res) => {
  try {
    // Extracción y parsing de parámetros
    const {
      limit = 10,
      page = 1,
      sort,
      category,
      status
    } = req.query

    const filtro = {}

    // Filtro por categoría
    if (category) {
      filtro.category = category
    }

    // Filtro por disponibilidad (status)
    if (status === 'true' || status === 'false') {
      filtro.status = status === 'true'
    }

    let sortOption = {}
    // Ordenamiento por precio ascendente/descendente
    if (sort === 'asc') sortOption.price = 1
    else if (sort === 'desc') sortOption.price = -1

    // Paginación usando mongoose-paginate-v2
    const result = await ProductModel.paginate(
      filtro,
      {
        limit: parseInt(limit),
        page: parseInt(page),
        sort: Object.keys(sortOption).length > 0 ? sortOption : undefined,
        lean: true
      }
    )

    // Armado de URLs base para paginación
    const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl || req.path}`.replace(/\/$/, '')

    // Generación de cadena de parámetros actuales (sin page)
    const paramString = [
      limit ? `limit=${limit}` : '',
      sort ? `sort=${sort}` : '',
      category ? `category=${category}` : '',
      (status === 'true' || status === 'false') ? `status=${status}` : ''
    ].filter(Boolean).join('&')

    // prevLink y nextLink en formato requerido
    const prevLink = result.hasPrevPage
      ? `${baseUrl}?page=${result.prevPage}${paramString ? `&${paramString}` : ''}`
      : null

    const nextLink = result.hasNextPage
      ? `${baseUrl}?page=${result.nextPage}${paramString ? `&${paramString}` : ''}`
      : null

    // Respuesta exacta según consigna
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

// (el resto del archivo queda igual)
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

export const createProduct = async (req, res) => {
  try {
    const { code } = req.body
    if (!code) {
      return res.status(400).json({ status: 'error', message: 'El campo code es obligatorio y único' })
    }

    const exists = await ProductModel.findOne({ code })
    if (exists) {
      return res.status(409).json({ status: 'error', message: 'Ya existe un producto con ese código' })
    }

    const nuevoProducto = await ProductModel.create(req.body)
    res.status(201).json({ status: 'success', payload: nuevoProducto })
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message })
  }
}

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