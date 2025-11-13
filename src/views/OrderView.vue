<template>
  <Header />
  <article class="order_wrap">
    <section class="order_top_box">
      <h2 class="bb">주문서</h2>
    </section>
    <section class="order_content_box">
      <div class="product_box">
        <h3 class="sb">주문 상품</h3>
        <ul class="order_list">
          <li v-for="item in orderItems" :key="item.id" class="order_item">
            <img :src="getImgUrl(item.category, item.image)" alt="" />
            <div class="item_info">
              <div>
                <p class="name text sb">{{ item.name }}</p>
                <!-- <p class="option" v-if="item.option">옵션: {{ item.option }}</p> -->
                <p class="quantity text n">수량 : {{ item.quantity }}</p>
              </div>

              <p class="price medium sb">{{ (item.price * item.quantity).toLocaleString() }}원</p>
            </div>
          </li>
        </ul>
      </div>
      <div class="ship_box">
        <h3 class="sb">배송 정보</h3>
        <div class="shipping_form">
          <input
            v-model="shipping.name"
            placeholder="이름"
            class="text n"
            required
            ref="nameInput"
            @keyup.enter="focusNext('phoneInput')"
          />

          <input
            v-model="shipping.phone"
            placeholder="연락처"
            class="text n"
            required
            ref="phoneInput"
            @keyup.enter="focusNext('addrSearchBtn')"
          />

          <div class="address_box">
            <input
              v-model="shipping.address"
              placeholder="주소"
              class="text n"
              required
              readonly
              ref="addressInput"
            />
            <button type="button" class="addr_search_btn" ref="addrSearchBtn" @click="openPostcode">
              주소찾기
            </button>
          </div>

          <input
            v-model="shipping.detailAddress"
            placeholder="상세주소"
            class="text n"
            required
            ref="detailInput"
            @keyup.enter="focusNext('payBtn')"
          />
        </div>
      </div>
      <div class="pay_box">
        <h3 class="sb">결제수단</h3>
        <div class="payment_method">
          <label class="text n pay"
            ><input type="radio" value="card" v-model="paymentMethod" /> 페이크결제</label
          >
          <!-- <label><input type="radio" value="bank" v-model="paymentMethod" /> 무통장입금</label> -->
        </div>
      </div>
    </section>
    <section class="total_section">
      <div class=" ">
        <p class="total medium bb">
          총 합계 : <span class="big">{{ total.toLocaleString() }}</span
          >원
        </p>
      </div>
      <button class="pay_btn medium n" @click="handlePayment" :disabled="loading">
        <span v-if="!loading">결제하기</span>
        <span v-else>결제 중...</span>
      </button>
    </section>
  </article>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { getOrder, clearOrder } from '@/api/order.js'

const router = useRouter()
const store = useStore()
const orderItems = ref([])
const shipping = ref({ name: '', phone: '', address: '', detailAddress: '' })
const paymentMethod = ref('card')
const total = ref(0)
const loading = ref(false)

const getImgUrl = (category, filename) =>
  new URL(`../assets/img/${category}/${filename}`, import.meta.url).href

// ⭐ input refs (자동 포커스에 사용)
const nameInput = ref(null)
const phoneInput = ref(null)
const addrSearchBtn = ref(null)
const addressInput = ref(null)
const detailInput = ref(null)
const payBtn = ref(null)

const focusNext = (nextRef) => {
  if (nextRef === 'payBtn') {
    payBtn.value?.focus()
  } else {
    const target = eval(nextRef)
    target?.value?.focus()
  }
}

// ⭐ 주소 검색 기능
const openPostcode = () => {
  if (!window.daum || !window.daum.Postcode) {
    alert('주소 검색 기능을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.')
    return
  }

  new window.daum.Postcode({
    oncomplete(data) {
      shipping.value.address = data.address
      setTimeout(() => detailInput.value?.focus(), 50)
    },
  }).open()
}

onMounted(() => {
  // Vuex에서 바로 가져오기
  orderItems.value = store.state.order.items

  total.value = orderItems.value.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0,
  )

  nameInput.value?.focus()
})

const handlePayment = () => {
  loading.value = true

  setTimeout(() => {
    loading.value = false
    const orderNo = 'ORD' + Date.now()

    // ✅ 주문 정보 Vuex 저장
    store.commit('order/setShipping', shipping.value)
    store.commit('order/setPaymentMethod', paymentMethod.value)
    store.commit('order/setOrderNumber', orderNo)

    // ✅ 완료 페이지 이동 (clearOrder 제거)
    router.push('/order/complete')
  }, 2000)
}
</script>

<style scoped lang="scss">
@import '../assets/style/Order.scss';
</style>
