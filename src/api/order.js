// 📁 src/api/order.js

const ORDER_KEY = 'orderHistory'

/* 주문 저장 (누적) */
export function saveOrder(orderData) {
  const existing = JSON.parse(localStorage.getItem(ORDER_KEY)) || []

  // ❗ 최신 주문을 맨 위로
  existing.unshift(orderData)

  localStorage.setItem(ORDER_KEY, JSON.stringify(existing))
}

/* 모든 주문 조회 */
export function getOrders() {
  try {
    return JSON.parse(localStorage.getItem(ORDER_KEY)) || []
  } catch {
    return []
  }
}

/* 특정 주문 조회 */
export function getOrderById(orderId) {
  const orders = getOrders()
  return orders.find((o) => o.id === orderId)
}

/* 전체 주문 삭제 */
export function clearOrders() {
  localStorage.removeItem(ORDER_KEY)
}
