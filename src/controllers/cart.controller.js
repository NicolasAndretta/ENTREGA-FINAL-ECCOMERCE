import { CartModel } from '../models/cart.model.js'
import { ProductModel } from '../models/product.model.js'

// Crear un carrito vacío
export const createCart = async (req, res) => {
  try {
    const newCart = await CartModel.create({ products: [] })
    res.status(201).json({ status: 'success', payload: newCart })
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message })
  }
}

// Obtener un carrito con sus productos poblados
export const getCartById = async (req, res) => {
  try {
    const cart = await CartModel.findById(req.params.cid).populate('products.productId').lean()
    if (!cart) {
      return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' })
    }
    res.status(200).json({ status: 'success', payload: cart })
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message })
  }
}

// Agregar un producto al carrito
export const addProductToCart = async (req, res) => {
  try {
    const { cid, pid } = req.params
    const quantityToAdd = parseInt(req.body.quantity) || 1

    if (quantityToAdd < 1) {
      return res.status(400).json({ status: 'error', message: 'Cantidad inválida' })
    }

    const cart = await CartModel.findById(cid)
    if (!cart) {
      return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' })
    }

    const product = await ProductModel.findById(pid)
    if (!product) {
      return res.status(404).json({ status: 'error', message: 'Producto no encontrado' })
    }

    const itemIndex = cart.products.findIndex(item => item.productId.equals(pid))
    if (itemIndex > -1) {
      cart.products[itemIndex].quantity += quantityToAdd
    } else {
      cart.products.push({ productId: pid, quantity: quantityToAdd })
    }

    await cart.save()

    // Redirigimos de nuevo a la vista de productos
    res.redirect('/products')
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message })
  }
}

// Actualizar cantidad de un producto en el carrito (PUT /api/carts/:cid/products/:pid)
export const updateProductQuantity = async (req, res) => {
  try {
    const { cid, pid } = req.params
    const { quantity } = req.body

    if (quantity < 1) {
      return res.status(400).json({ status: 'error', message: 'La cantidad debe ser al menos 1' })
    }

    const cart = await CartModel.findById(cid)
    if (!cart) {
      return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' })
    }

    const itemIndex = cart.products.findIndex(item => item.productId.equals(pid))
    if (itemIndex === -1) {
      return res.status(404).json({ status: 'error', message: 'Producto no en el carrito' })
    }

    cart.products[itemIndex].quantity = quantity
    await cart.save()
    res.status(200).json({ status: 'success', message: 'Cantidad actualizada', payload: cart })
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message })
  }
}

// Eliminar un producto del carrito (DELETE /api/carts/:cid/products/:pid)
export const removeProductFromCart = async (req, res) => {
  try {
    const { cid, pid } = req.params
    const cart = await CartModel.findById(cid)
    if (!cart) {
      return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' })
    }

    const originalLength = cart.products.length
    cart.products = cart.products.filter(item => !item.productId.equals(pid))

    if (cart.products.length === originalLength) {
      return res.status(404).json({ status: 'error', message: 'Producto no encontrado en el carrito' })
    }

    await cart.save()
    res.status(200).json({ status: 'success', message: 'Producto eliminado del carrito', payload: cart })
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message })
  }
}

// Vaciar el carrito (DELETE /api/carts/:cid)
export const emptyCart = async (req, res) => {
  try {
    const { cid } = req.params
    const cart = await CartModel.findById(cid)
    if (!cart) {
      return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' })
    }

    cart.products = []
    await cart.save()
    res.status(200).json({ status: 'success', message: 'Carrito vaciado', payload: cart })
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message })
  }
}

// Actualizar todos los productos del carrito (PUT /api/carts/:cid)
export const updateAllProductsInCart = async (req, res) => {
  try {
    const { cid } = req.params
    const { products } = req.body // [{ productId, quantity }, ...]

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ status: 'error', message: 'Debes enviar un array de productos' })
    }

    // Validar existencia y cantidad de cada producto
    for (const item of products) {
      if (!item.productId || !item.quantity || item.quantity < 1) {
        return res.status(400).json({ status: 'error', message: 'Cada producto debe tener productId y cantidad válida' })
      }
      const prodExist = await ProductModel.exists({ _id: item.productId })
      if (!prodExist) {
        return res.status(404).json({ status: 'error', message: `El producto con id ${item.productId} no existe` })
      }
    }

    const cart = await CartModel.findById(cid)
    if (!cart) {
      return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' })
    }

    cart.products = products.map(item => ({
      productId: item.productId,
      quantity: item.quantity
    }))
    await cart.save()

    res.status(200).json({ status: 'success', message: 'Productos del carrito actualizados', payload: cart })
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message })
  }
}