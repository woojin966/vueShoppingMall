// axios로 API 통신하는 함수들
// 📁 src/api/cart.js
const CART_KEY = 'cartItems'

// 📦 LocalStorage에서 장바구니 불러오기
export function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || []
  } catch {
    return []
  }
}

// 💾 장바구니 저장
function saveCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items))
}

// ➕ 장바구니 추가
export function addToCart(product) {
  const cart = getCart()
  const existing = cart.find((item) => item.name === product.name)

  if (existing) {
    // 이미 존재하면 수량 증가
    existing.quantity += 1
  } else {
    cart.push({ ...product, quantity: 1 })
  }

  saveCart(cart)
  return cart
}

// ➖ 장바구니에서 하나 삭제
export function removeFromCart(productName) {
  const cart = getCart().filter((item) => item.name !== productName)
  saveCart(cart)
  return cart
}

// 🔢 수량 변경
export function updateQuantity(productName, quantity) {
  const cart = getCart()
  const item = cart.find((i) => i.name === productName)
  if (item) item.quantity = quantity
  saveCart(cart)
  return cart
}

// 🗑 장바구니 비우기
export function clearCart() {
  localStorage.removeItem(CART_KEY)
}

// 📊 장바구니 총합
export function getCartTotal() {
  const cart = getCart()
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
}
