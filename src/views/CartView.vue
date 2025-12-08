<template>
  <Header />
  <article class="cart_wrap">
    <section class="cart_top_box">
      <h2 class="bb">장바구니</h2>
    </section>
    <section class="cart_content_box">
      <div class="btn_box top">
        <div class="sel_btn_box">
          <button class="all_sel_btn text n" @click="selectAll">{{ t('cart.selectAll') }}</button>
          <button class="sel_off_btn text n" @click="deselectAll">
            {{ t('cart.deselectAll') }}
          </button>
        </div>
      </div>
      <ul class="product_list" v-if="cartItems.length">
        <li
          v-for="item in cartItems"
          :key="`${item.id}-${item.option || 'noopt'}`"
          class="cart_item"
          :class="{ checked: item.checked }"
        >
          <input type="checkbox" class="item_check" v-model="item.checked" />
          <div class="img_box">
            <img :src="getImgUrl(item.category, item.image)" :alt="item.name" />
          </div>

          <div class="cart_info">
            <div class="name_del_row">
              <div>
                <p class="name text sb">{{ item.name[locale] }}</p>
                <p v-if="item.option" class="option">{{ t('cart.option') }}: {{ item.option }}</p>
              </div>
              <button @click="handleRemove(item.id, item.option)">
                <span></span>
                <span></span>
              </button>
            </div>

            <div class="qty_row">
              <button class="change_qty_btn minus" @click="decreaseQty(item)">
                <span></span>
              </button>

              <input
                type="number"
                min="1"
                :value="item.quantity"
                @change="handleQuantityChange(item.id, item.option, Number($event.target.value))"
                class="text n"
              />

              <button class="change_qty_btn plus" @click="increaseQty(item)">
                <span></span>
                <span></span>
              </button>
            </div>

            <div class="price_row">
              <p class="price medium sb">
                {{ (Number(item.price) * Number(item.quantity)).toLocaleString()
                }}{{ t('common.currency') }}
              </p>
            </div>
          </div>
        </li>
      </ul>
      <p class="empty_cart_msg text sb" v-else>{{ t('cart.empty') }}</p>
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
            {{ t('cart.deleteAll') }}
          </button>
          <button class="sel_del_btn text n" @click="deleteSelected">
            {{ t('cart.deleteSelected') }}
          </button>
        </div>
      </div>
    </section>
    <section class="cart_bottom_box">
      <div class="total_price_box">
        <p class="total big bb">{{ total.toLocaleString() }}{{ t('common.currency') }}</p>
      </div>
      <div class="order_btn_box">
        <button class="sel_order_btn medium n" @click="goToSelectedOrder">
          {{ t('cart.orderSelected') }}
        </button>
        <button class="all_order_btn medium n" @click="goToOrder">{{ t('cart.orderAll') }}</button>
      </div>
    </section>
  </article>
  <Footer />

  <Modal
    :visible="noselectalert"
    :message="t('cart.noSelectionAlert')"
    @confirm="noselectalert = false"
    :confirmText="t('cart.noSelectionAlert')"
    :cancelText="''"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getCart, removeFromCart, updateQuantity, clearCart, getCartTotal } from '@/api/cart.js'
import { saveOrder } from '@/api/order.js'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import Modal from '@/components/Modal.vue'

const router = useRouter()
const store = useStore()
const { t, locale } = useI18n()

// 🔗 Vite에서 정적 에셋 동적 경로 만들기
const getImgUrl = (category, filename) =>
  new URL(`../assets/img/${category}/${filename}`, import.meta.url).href

const cartItems = ref([])
const total = ref(0)
const noselectalert = ref(false)

const refreshCart = () => {
  // 기존 cart 데이터 불러오기
  const items = getCart()

  // checked 필드 추가 (없으면 false로 초기화)
  cartItems.value = items.map((item) => ({
    ...item,
    checked: item.checked ?? false,
  }))

  // 총합도 갱신
  total.value = getCartTotal()
  store.commit('order/setItems', cartItems.value)
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

// 전체 선택 / 해제 기능
const selectAll = () => {
  cartItems.value.forEach((item) => (item.checked = true))
}
const deselectAll = () => {
  cartItems.value.forEach((item) => (item.checked = false))
}

// 선택 삭제
const deleteSelected = () => {
  const selected = cartItems.value.filter((item) => item.checked)

  if (!selected.length) {
    // alert('선택된 상품이 없습니다.')
    noselectalert.value = true
    return
  }
  selected.forEach((item) => {
    removeFromCart(item.id, item.option)
  })

  refreshCart()
}

// 수량변경
const decreaseQty = (item) => {
  if (item.quantity > 1) {
    item.quantity--
    updateQuantity(item.id, item.option, item.quantity)
    refreshCart()
  }
}
const increaseQty = (item) => {
  item.quantity++
  updateQuantity(item.id, item.option, item.quantity)
  refreshCart()
}

// 선택주문
const goToSelectedOrder = () => {
  const selected = cartItems.value.filter((item) => item.checked)

  if (!selected.length) {
    // alert('선택된 상품이 없습니다.')
    noselectalert.value = true
    return
  }

  // Vuex에 선택된 상품만 저장
  store.commit('order/setItems', selected)
  router.push('/order')
}

// 전체주문
const goToOrder = () => {
  if (!cartItems.value.length) return

  // ✅ Vuex에 바로 저장
  store.commit('order/setItems', cartItems.value)

  // ✅ 주문 페이지 이동
  router.push('/order')
}
onMounted(refreshCart)
</script>

<style scoped lang="scss">
@import '../assets/style/Cart.scss';
</style>
