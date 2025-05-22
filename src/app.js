import express from 'express'
import dotenv from 'dotenv'
import { connectDB } from './config/db.js'
import exphbs from 'express-handlebars'
import path from 'path'
import { fileURLToPath } from 'url'
import methodOverride from 'method-override'

import productsRouter from './routes/products.router.js'
import cartsRouter from './routes/carts.router.js'
import viewsRouter from './routes/views.router.js'

// Importa los helpers de handlebars
import { multiply, cartTotal, ifCond } from './helpers/handlebars.js'

dotenv.config()

const app = express()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

connectDB()

// Registra helpers personalizados
app.engine(
  'handlebars',
  exphbs.engine({
    helpers: {
      multiply,
      cartTotal,
      ifCond
    }
  })
)
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, 'views'))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))

// Rutas principales de la API
app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)
app.use('/', viewsRouter)

// Middleware opcional para pasar datos globales a las vistas (ejemplo: año actual)
app.use((req, res, next) => {
  res.locals.year = new Date().getFullYear()
  next()
})

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`)
})