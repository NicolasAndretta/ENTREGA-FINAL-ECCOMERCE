import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const productSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  price: {
    type: Number,
    required: true
  },
  category: String,
  status: {
    type: Boolean,
    default: true
  },
  stock: Number,
  thumbnails: {
    type: [String],
    default: []
  }
})

productSchema.plugin(mongoosePaginate)

// Evitar sobreescritura del modelo
export const ProductModel = mongoose.models.Product || mongoose.model('Product', productSchema)
