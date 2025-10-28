<script setup>
import { ref, onMounted } from 'vue'
import { getCart, removeFromCart, updateQuantity, clearCart, getCartTotal } from '@/api/cart.js'

const cartItems = ref([])
const total = ref(0)

const refreshCart = () => {
  cartItems.value = getCart()
  total.value = getCartTotal()
}

const handleRemove = (name) => {
  removeFromCart(name)
  refreshCart()
}

const handleQuantityChange = (name, qty) => {
  updateQuantity(name, qty)
  refreshCart()
}

onMounted(refreshCart)
</script>

<template>
  <section class="cart_view">
    <h2>🛒 장바구니</h2>
    <ul v-if="cartItems.length">
      <li v-for="item in cartItems" :key="item.name">
        <img :src="`/assets/img/${item.category}/${item.image}`" />
        <div>
          <p>{{ item.name }}</p>
          <input
            type="number"
            min="1"
            :value="item.quantity"
            @change="handleQuantityChange(item.name, $event.target.value)"
          />
          <button @click="handleRemove(item.name)">삭제</button>
        </div>
      </li>
    </ul>
    <p v-else>장바구니가 비어 있습니다.</p>
    <p class="total">총합: {{ total.toLocaleString() }}원</p>
    <button @click="(clearCart(), refreshCart())">전체 비우기</button>
  </section>
</template>
