// axios로 API 통신하는 함수들
// 📁 src/api/order.js
const ORDER_KEY = 'orderItems'

// 💾 주문 데이터 저장
export function saveOrder(items) {
  localStorage.setItem(ORDER_KEY, JSON.stringify(items))
}

// 📦 주문 데이터 불러오기
export function getOrder() {
  try {
    return JSON.parse(localStorage.getItem(ORDER_KEY)) || []
  } catch {
    return []
  }
}

// 🗑 주문 데이터 초기화
export function clearOrder() {
  localStorage.removeItem(ORDER_KEY)
}
