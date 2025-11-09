<template>
  <article class="cart_wrap">
    <section class="cart_top_box">
      <h2 class="bb">장바구니</h2>
      <div class="delete_btn_box">
        <button
          @click="
            () => {
              clearCart()
              refreshCart()
            }
          "
        >
          전체 비우기
        </button>
      </div>
    </section>
    <section class="cart_content_box">
      <ul v-if="cartItems.length">
        <li
          v-for="item in cartItems"
          :key="`${item.id}-${item.option || 'noopt'}`"
          class="cart_item"
        >
          <img :src="getImgUrl(item.category, item.image)" :alt="item.name" />

          <div class="cart_info">
            <p class="name">{{ item.name }}</p>
            <p v-if="item.option" class="option">옵션: {{ item.option }}</p>

            <div class="qty_row">
              <input
                type="number"
                min="1"
                :value="item.quantity"
                @change="handleQuantityChange(item.id, item.option, Number($event.target.value))"
              />
              <button @click="handleRemove(item.id, item.option)">삭제</button>
            </div>

            <p class="price">
              {{ (Number(item.price) * Number(item.quantity)).toLocaleString() }}원
            </p>
          </div>
        </li>
      </ul>
      <p v-else>장바구니가 비어 있습니다.</p>
    </section>
    <section class="cart_bottom_box">
      <div class="total_price_box">
        <p class="total">총합: {{ total.toLocaleString() }}원</p>
      </div>
      <div class="order_btn_box">
        <button class="order_btn" @click="goToOrder">주문하기</button>
      </div>
    </section>
  </article>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getCart, removeFromCart, updateQuantity, clearCart, getCartTotal } from '@/api/cart.js'
import { saveOrder } from '@/api/order.js'
import { useRouter } from 'vue-router'
const router = useRouter()

// 🔗 Vite에서 정적 에셋 동적 경로 만들기
const getImgUrl = (category, filename) =>
  new URL(`../assets/img/${category}/${filename}`, import.meta.url).href

const cartItems = ref([])
const total = ref(0)

const refreshCart = () => {
  cartItems.value = getCart()
  total.value = getCartTotal()
}

const handleRemove = (id, option) => {
  removeFromCart(id, option)
  refreshCart()
}

const handleQuantityChange = (id, option, qty) => {
  if (!qty || qty < 1) qty = 1
  updateQuantity(id, option, qty)
  refreshCart()
}

// 주문페이지로 가기
const goToOrder = () => {
  if (!cartItems.value.length) return
  // 장바구니 데이터 저장
  saveOrder(cartItems.value)
  router.push('/order')
}

onMounted(refreshCart)
</script>

<style scoped>
.cart_item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  margin-bottom: 16px;
}
.cart_item img {
  width: 96px;
  height: 96px;
  object-fit: cover;
}
.cart_info .name {
  font-weight: 600;
}
.qty_row {
  display: flex;
  gap: 8px;
  align-items: center;
  margin: 6px 0;
}
.total {
  margin-top: 16px;
  font-weight: 700;
}
</style>
