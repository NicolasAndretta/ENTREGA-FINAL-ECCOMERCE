import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL)
    console.log('🟢 Conectado a MongoDB Atlas')
  } catch (error) {
    console.error('🔴 Error al conectar a MongoDB Atlas:', error)
    process.exit(1) // Corta la ejecución si falla la DB
  }
}
