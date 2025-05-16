// src/dao/productManager.mongo.js
import mongoose from 'mongoose' // 👉 Agregado
import { ProductModel } from '../models/product.model.js'

class ProductManagerMongo {
  async getProducts() {
    try {
      const products = await ProductModel.find()
      console.log('📦 Productos obtenidos de MongoDB')
      return products
    } catch (error) {
      console.error('❌ Error al obtener productos:', error)
      return []
    }
  }

  async addProduct(productData) {
    try {
      const newProduct = await ProductModel.create(productData)
      console.log('✅ Producto agregado a MongoDB')
      return newProduct
    } catch (error) {
      console.error('❌ Error al agregar producto:', error)
      return null
    }
  }

  async getProductById(id) {
    try {
      const product = await ProductModel.findById(id)
      return product
    } catch (error) {
      console.error('❌ Error al buscar producto por ID:', error)
      return null
    }
  }

  async updateProduct(id, updateData) {
    try {
      const result = await ProductModel.findByIdAndUpdate(id, updateData, {
        new: true
      })
      console.log('📝 Producto actualizado en MongoDB')
      return result
    } catch (error) {
      console.error('❌ Error al actualizar producto:', error)
      return null
    }
  }

  async deleteProduct(id) {
    try {
      const result = await ProductModel.findByIdAndDelete(id)
      console.log('🗑️ Producto eliminado de MongoDB')
      return result
    } catch (error) {
      console.error('❌ Error al eliminar producto:', error)
      return null
    }
  }
}

// Exportamos una instancia
export const productManagerMongo = new ProductManagerMongo()
