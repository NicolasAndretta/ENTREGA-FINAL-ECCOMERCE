import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { ProductModel } from './models/product.model.js';

async function main() {
  try {
    console.log('🟢 Intentando conectar a MongoDB...');
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Conectado a MongoDB');

    const producto = {
      title: 'Aceite 10W40',
      description: 'Aceite sintético para motor',
      price: 9500,
      thumbnail: 'aceite10w40.jpg',
      code: 'ACE10W40',
      stock: 20,
      category: 'Lubricantes',
      status: true,
    };

    let productoCreado = null;
    try {
      productoCreado = await ProductModel.create(producto);
      console.log('✅ Producto creado:', productoCreado);
    } catch (error) {
      console.error('❌ Error al agregar producto:', error.message);
    }

    const productos = await ProductModel.find().lean();
    console.log('🟢 Productos obtenidos:', productos);

    if (productoCreado) {
      console.log('Producto creado tiene ID:', productoCreado._id.toString());
    } else {
      console.log('No se creó el producto, probablemente ya existe.');
    }

    await mongoose.disconnect();
    console.log('🟠 Desconectado de MongoDB');
  } catch (error) {
    console.error('❌ Error en main:', error);
  }
}

main();

