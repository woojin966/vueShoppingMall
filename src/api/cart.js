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
  const quantityToAdd = product.quantity || 1 // 기본값 1

  // ✅ id와 option을 기준으로 같은 상품 판별
  const existing = cart.find((item) => item.id === product.id && item.option === product.option)

  if (existing) {
    // 기존 수량에 합산
    existing.quantity += quantityToAdd
  } else {
    // 새 상품 추가
    cart.push({ ...product, quantity: quantityToAdd })
  }

  // ✅ 중복된 항목 병합 (예방용)
  const mergedCart = cart.reduce((acc, curr) => {
    const existingItem = acc.find((item) => item.id === curr.id && item.option === curr.option)
    if (existingItem) {
      existingItem.quantity += curr.quantity
    } else {
      acc.push(curr)
    }
    return acc
  }, [])

  saveCart(mergedCart)
  return mergedCart
}

// ➖ 장바구니에서 하나 삭제
export function removeFromCart(productId, option) {
  const cart = getCart().filter((item) => !(item.id === productId && item.option === option))
  saveCart(cart)
  return cart
}

// 🔢 수량 변경
export function updateQuantity(productId, option, quantity) {
  const cart = getCart()
  const item = cart.find((i) => i.id === productId && i.option === option)
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
