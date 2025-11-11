<template>
  <Header />
  <article class="cart_wrap">
    <section class="cart_top_box">
      <h2 class="bb">장바구니</h2>
    </section>
    <section class="cart_content_box">
      <div class="btn_box top">
        <div class="sel_btn_box">
          <button class="all_sel_btn text n">전체선택</button>
          <button class="sel_off_btn text n">선택해제</button>
        </div>
        <!-- <div class="delete_btn_box">
          <button
            @click="
              () => {
                clearCart()
                refreshCart()
              }
            "
            class="all_del_btn text n"
          >
            전체삭제
          </button>
          <button class="sel_del_btn text n">선택삭제</button>
        </div> -->
      </div>
      <ul class="product_list" v-if="cartItems.length">
        <li
          v-for="item in cartItems"
          :key="`${item.id}-${item.option || 'noopt'}`"
          class="cart_item"
        >
          <input type="checkbox" class="item_check" />
          <div class="img_box">
            <img :src="getImgUrl(item.category, item.image)" :alt="item.name" />
          </div>

          <div class="cart_info">
            <div class="name_del_row">
              <div>
                <p class="name text sb">{{ item.name }}</p>
                <p v-if="item.option" class="option">옵션: {{ item.option }}</p>
              </div>
              <button @click="handleRemove(item.id, item.option)">
                <span></span>
                <span></span>
              </button>
            </div>

            <div class="qty_row">
              <button class="change_qty_btn minus">
                <span></span>
              </button>
              <input
                type="number"
                min="1"
                :value="item.quantity"
                @change="handleQuantityChange(item.id, item.option, Number($event.target.value))"
                class="text n"
              />
              <button class="change_qty_btn plus">
                <span></span>
                <span></span>
              </button>
            </div>

            <div class="price_row">
              <p class="price medium sb">
                {{ (Number(item.price) * Number(item.quantity)).toLocaleString() }}원
              </p>
            </div>
          </div>
        </li>
      </ul>
      <p class="empty_cart_msg text sb" v-else>장바구니가 비어 있습니다.</p>
      <div class="btn_box bottom">
        <!-- <div class="sel_btn_box">
          <button class="all_sel_btn text n">전체선택</button>
          <button class="sel_off_btn text n">선택해제</button>
        </div> -->
        <div class="delete_btn_box">
          <button
            @click="
              () => {
                clearCart()
                refreshCart()
              }
            "
            class="all_del_btn text n"
          >
            전체삭제
          </button>
          <button class="sel_del_btn text n">선택삭제</button>
        </div>
      </div>
    </section>
    <section class="cart_bottom_box">
      <div class="total_price_box">
        <p class="total big bb">{{ total.toLocaleString() }}원</p>
      </div>
      <div class="order_btn_box">
        <button class="sel_order_btn medium n">선택 주문</button>
        <button class="all_order_btn medium n" @click="goToOrder">전체 주문</button>
      </div>
    </section>
  </article>
  <Footer />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getCart, removeFromCart, updateQuantity, clearCart, getCartTotal } from '@/api/cart.js'
import { saveOrder } from '@/api/order.js'
import { useRouter } from 'vue-router'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'

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

<style scoped lang="scss">
@import '../assets/style/Cart.scss';
</style>
