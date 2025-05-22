// Multiplicar dos valores
export const multiply = (a, b) => a * b

// Calcular el total del carrito sumando (precio * cantidad) para cada producto
export const cartTotal = (products) => {
  if (!products || !products.length) return 0
  return products.reduce((acc, item) => {
    // Si el producto está poblado (populate)
    const price = item.productId.price || 0
    return acc + (price * item.quantity)
  }, 0)
}

// Helper ifCond para comparación flexible en Handlebars (==, ===, !=, !==, <, >, <=, >=)
export const ifCond = function (v1, operator, v2, options) {
  switch (operator) {
    case '==':
      return (v1 == v2) ? options.fn(this) : options.inverse(this)
    case '===':
      return (v1 === v2) ? options.fn(this) : options.inverse(this)
    case '!=':
      return (v1 != v2) ? options.fn(this) : options.inverse(this)
    case '!==':
      return (v1 !== v2) ? options.fn(this) : options.inverse(this)
    case '<':
      return (v1 < v2) ? options.fn(this) : options.inverse(this)
    case '<=':
      return (v1 <= v2) ? options.fn(this) : options.inverse(this)
    case '>':
      return (v1 > v2) ? options.fn(this) : options.inverse(this)
    case '>=':
      return (v1 >= v2) ? options.fn(this) : options.inverse(this)
    case '&&':
      return (v1 && v2) ? options.fn(this) : options.inverse(this)
    case '||':
      return (v1 || v2) ? options.fn(this) : options.inverse(this)
    default:
      return options.inverse(this)
  }
}