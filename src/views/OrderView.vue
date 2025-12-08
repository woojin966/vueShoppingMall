<template>
  <Header />
  <article class="order_wrap">
    <section class="order_top_box">
      <h1>Order form</h1>
    </section>
    <section class="order_content_box">
      <div class="product_box">
        <h3 class="sb">{{ t('order.detail_order.order_item') }}</h3>
        <ul class="order_list">
          <li v-for="item in orderItems" :key="item.id" class="order_item">
            <img :src="getImgUrl(item.category, item.image)" alt="" />
            <div class="item_info">
              <div>
                <p class="name text sb">{{ item.name[locale] }}</p>
                <!-- <p class="option" v-if="item.option">옵션: {{ item.option }}</p> -->
                <p class="quantity text n">{{ t('common.quantity') }} : {{ item.quantity }}</p>
              </div>

              <p class="price medium sb">
                {{ (item.price * item.quantity).toLocaleString() }}{{ t('common.currency') }}
              </p>
            </div>
          </li>
        </ul>
      </div>
      <div class="customer_box">
        <h3 class="sb">{{ t('order.customerInfo') }}</h3>
        <div class="customer_form">
          <input
            v-model="customer.name"
            :placeholder="t('order.name')"
            class="text n"
            required
            ref="customerNameInput"
            @keyup.enter="focusNext('customerPhoneInput')"
          />

          <input
            v-model="customer.phone"
            :placeholder="t('order.complete_order.phone')"
            class="text n"
            required
            ref="customerPhoneInput"
            @keyup.enter="focusNext('customerEmailInput')"
          />

          <input
            v-model="customer.email"
            :placeholder="t('order.complete_order.email')"
            class="text n"
            required
            ref="customerEmailInput"
            @keyup.enter="focusNext('nameInput')"
          />
        </div>
      </div>
      <div class="ship_box">
        <h3 class="sb">{{ t('order.detail_order.shippingInfo') }}</h3>
        <div class="shipping_form">
          <div class="same_info_box">
            <label>
              <input
                type="checkbox"
                v-model="sameInfo"
                @change="handleSameInfo"
                :class="{ checked: sameInfo }"
              />
              {{ t('order.sameAsCustomer') }}
            </label>
          </div>
          <div class="user">
            <input
              v-model="shipping.name"
              :placeholder="t('order.name')"
              class="text n"
              required
              ref="nameInput"
              @keyup.enter="focusNext('phoneInput')"
            />

            <input
              v-model="shipping.phone"
              :placeholder="t('order.complete_order.phone')"
              class="text n"
              required
              ref="phoneInput"
              @keyup.enter="focusNext('emailInput')"
            />

            <input
              v-model="shipping.email"
              :placeholder="t('order.complete_order.email')"
              class="text n"
              required
              ref="emailInput"
              @keyup.enter="focusNext('addrSearchBtn')"
            />
          </div>

          <div class="address">
            <div>
              <input
                v-model="shipping.address"
                :placeholder="t('order.complete_order.adress')"
                class="text n"
                required
                readonly
                ref="addressInput"
              />
              <button
                type="button"
                class="addr_search_btn"
                ref="addrSearchBtn text n"
                @click="openPostcode"
              >
                {{ t('order.check.addressSearch') }}
              </button>
            </div>
            <input
              v-model="shipping.detailAddress"
              :placeholder="t('order.check.detailAddress')"
              class="text n"
              required
              ref="shipDetail"
              @keyup.enter="focusNext('messageInput')"
            />
          </div>
          <div class="shipping_msg">
            <input
              v-model="shipping.message"
              :placeholder="t('order.check.shippingMessage')"
              class="text n"
              required
              ref="messageInput"
              @keyup.enter="focusNext('payBtn')"
            />
          </div>
        </div>
      </div>
      <div class="pay_box">
        <h3 class="sb">{{ t('order.check.paymentMethod') }}</h3>
        <div class="payment_method">
          <label class="radio_wrap text n pay">
            <input type="radio" value="card" v-model="paymentMethod" />
            <span class="radio_custom"></span>
            {{ t('order.check.fakePayment') }}
          </label>
        </div>
      </div>
      <div class="terms_box">
        <h3 class="sb">{{ t('order.check.termsTitle') }}</h3>
        <label>
          <input type="checkbox" v-model="agreeTerms" :class="{ checked: agreeTerms }" />
          <span>{{ t('order.check.termsAgree') }}</span>
        </label>
        <div>
          <div class="">
            <p class="text sb">{{ t('order.check.privacyPurpose') }}</p>
            <p class="text n">
              {{ t('order.check.privacyPurpose1') }}<br />
              {{ t('order.check.privacyPurpose1Detail') }}
            </p>
            <p class="text n">
              {{ t('order.check.privacyPurpose2') }}<br />
              {{ t('order.check.privacyPurpose2Detail') }}
            </p>
          </div>
          <div class="">
            <p class="text sb">
              {{ t('order.check.privacyItems') }}{{ t('order.check.privacyItemsDetail') }}
            </p>
          </div>
          <div class="">
            <p class="text sb">{{ t('order.check.privacyRetention') }}</p>
            <p class="text n">{{ t('order.check.privacyRetentionDetail') }}</p>
            <p class="text sb">※ {{ t('order.check.privacyReject') }}</p>
          </div>
        </div>
      </div>
    </section>
    <section class="total_section">
      <p class="total medium bb">
        <span>{{ t('order.check.totalAmount') }}</span>
        <span class="big">{{ total.toLocaleString() }}{{ t('common.currency') }}</span>
      </p>
      <button class="pay_btn medium n" @click="handlePayment" :disabled="loading">
        <span v-if="!loading">{{ t('order.check.pay') }}</span>
        <span v-else>{{ t('order.check.payLoading') }}</span>
      </button>
    </section>
  </article>
  <Footer />

  <Modal
    :visible="showCustomerEmptyModal"
    :message="t('order.check.modalCustomerEmpty')"
    @confirm="showCustomerEmptyModal = false"
    :confirmText="t('common.confirm')"
    :cancelText="''"
  />
  <Modal
    :visible="adressAlert"
    :message="t('order.check.modalAddressFail')"
    @confirm="adressAlert = false"
    :confirmText="t('common.confirm')"
    :cancelText="''"
  />
  <Modal
    :visible="showTermsAlert"
    :message="t('order.check.modalTerms')"
    @confirm="showTermsAlert = false"
    :confirmText="t('common.confirm')"
    :cancelText="''"
  />
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
// import { getOrder, clearOrder } from '@/api/order.js'
import { clearCart } from '@/api/cart.js'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import Modal from '@/components/Modal.vue'

const router = useRouter()
const store = useStore()
const { t, locale } = useI18n()
const orderItems = ref([])
const paymentMethod = ref('card')
const total = ref(0)
const loading = ref(false)
const adressAlert = ref(false)
// 주문자 정보
const customer = ref({
  name: '',
  phone: '',
  email: '',
})
// 배송 정보
const shipping = ref({
  name: '',
  phone: '',
  email: '',
  address: '',
  detailAddress: '',
  message: '',
})
// 체크박스 : 주문자=배송자 동일
const sameInfo = ref(false)
const agreeTerms = ref(false)
const showTermsAlert = ref(false)
const showCustomerEmptyModal = ref(false)

const getImgUrl = (category, filename) =>
  new URL(`../assets/img/${category}/${filename}`, import.meta.url).href

// ⭐ input refs (자동 포커스에 사용)
const refs = {
  customerName: ref(null),
  customerPhone: ref(null),
  customerEmail: ref(null),
  shipName: ref(null),
  shipPhone: ref(null),
  shipEmail: ref(null),
  shipAddress: ref(null),
  shipDetail: ref(null),
  shipMsg: ref(null),
  payBtn: ref(null),
}

// 포커스 이동
const focusNext = (key) => {
  refs[key]?.value?.focus()
}

// 주문자 = 배송자 정보 복사
const copyCustomerInfo = () => {
  if (sameInfo.value) {
    shipping.value.name = customer.value.name
    shipping.value.phone = customer.value.phone
    shipping.value.email = customer.value.email
  }
}
const handleSameInfo = () => {
  if (sameInfo.value) {
    // 주문자 정보 빈값 체크
    if (!customer.value.name || !customer.value.phone || !customer.value.email) {
      showCustomerEmptyModal.value = true
      sameInfo.value = false // 체크 해제
      return
    }

    // 주문자 정보를 배송자에 복사
    copyCustomerInfo()
  }
}

// 주소 검색 기능
const openPostcode = () => {
  if (!window.daum || !window.daum.Postcode) {
    // alert('주소 검색 기능을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.')
    adressAlert.value = true
    return
  }

  new window.daum.Postcode({
    oncomplete(data) {
      shipping.value.address = data.address
      setTimeout(() => shipDetail.value?.focus(), 50)
    },
  }).open()
}

// 체크박스 변경 시
watch(sameInfo, () => {
  copyCustomerInfo()
})
// 주문자 입력 변경 시 → 배송자 자동 업데이트 (체크된 경우)
watch(
  customer,
  () => {
    if (sameInfo.value) copyCustomerInfo()
  },
  { deep: true },
)

onMounted(() => {
  // Vuex에서 바로 가져오기
  orderItems.value = store.state.order.items.length ? store.state.order.items : []

  total.value = orderItems.value.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0,
  )

  refs.customerName.value?.focus()
})

// const handlePayment = () => {
//   if (!agreeTerms.value) {
//     showTermsAlert.value = true
//     return
//   }

//   loading.value = true

//   setTimeout(() => {
//     loading.value = false
//     const orderNo = 'ORD' + Date.now()

//     // ✅ 주문 정보 Vuex 저장
//     store.commit('order/setShipping', shipping.value)
//     store.commit('order/setPaymentMethod', paymentMethod.value)
//     store.commit('order/setOrderNumber', orderNo)
//     store.commit('order/setCustomer', customer.value)

//     // ✅ 완료 페이지 이동 (clearOrder 제거)
//     router.push('/order/complete')
//   }, 2000)
// }
const handlePayment = () => {
  if (!agreeTerms.value) {
    showTermsAlert.value = true
    return
  }

  loading.value = true

  setTimeout(() => {
    loading.value = false

    const orderNo = 'ORD' + Date.now()

    // 총합
    const totalPrice = orderItems.value.reduce(
      (sum, item) => sum + Number(item.price) * Number(item.quantity),
      0,
    )

    // 최종 저장할 주문 객체 생성
    const orderData = {
      id: orderNo,
      date: new Date().toISOString().slice(0, 10),
      status: 'ready',
      items: orderItems.value, // 장바구니에서 가져온 상품 그대로
      total: totalPrice,
      customer: customer.value,
      shipping: shipping.value,
      payment: paymentMethod.value,
    }

    // Vuex 저장
    store.commit('order/setItems', orderItems.value)
    store.commit('order/setCustomer', customer.value)
    store.commit('order/setShipping', shipping.value)
    store.commit('order/setPaymentMethod', paymentMethod.value)
    store.commit('order/setOrderNumber', orderNo)

    // 🟢 localStorage 누적 저장
    import('@/api/order.js').then(({ saveOrder }) => {
      saveOrder(orderData)
    })

    clearCart()

    router.push('/order/complete')
  }, 1500)
}
</script>

<style scoped lang="scss">
@import '../assets/style/Order.scss';
</style>
