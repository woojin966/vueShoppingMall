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
      <div class="customer_box">
        <h3 class="sb">주문자 정보</h3>
        <div class="customer_form">
          <input
            v-model="customer.name"
            placeholder="이름"
            class="text n"
            required
            ref="customerNameInput"
            @keyup.enter="focusNext('customerPhoneInput')"
          />

          <input
            v-model="customer.phone"
            placeholder="연락처"
            class="text n"
            required
            ref="customerPhoneInput"
            @keyup.enter="focusNext('customerEmailInput')"
          />

          <input
            v-model="customer.email"
            placeholder="이메일"
            class="text n"
            required
            ref="customerEmailInput"
            @keyup.enter="focusNext('nameInput')"
          />
        </div>
      </div>
      <div class="ship_box">
        <h3 class="sb">배송 정보</h3>
        <div class="shipping_form">
          <div class="same_info_box">
            <label>
              <input
                type="checkbox"
                v-model="sameInfo"
                @change="handleSameInfo"
                :class="{ checked: sameInfo }"
              />
              주문자와 동일
            </label>
          </div>
          <div class="user">
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
              @keyup.enter="focusNext('emailInput')"
            />

            <input
              v-model="shipping.email"
              placeholder="이메일"
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
                placeholder="주소"
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
                주소찾기
              </button>
            </div>
            <input
              v-model="shipping.detailAddress"
              placeholder="상세주소"
              class="text n"
              required
              ref="detailInput"
              @keyup.enter="focusNext('messageInput')"
            />
          </div>
          <div class="shipping_msg">
            <input
              v-model="shipping.message"
              placeholder="배송메시지"
              class="text n"
              required
              ref="messageInput"
              @keyup.enter="focusNext('payBtn')"
            />
          </div>
        </div>
      </div>
      <div class="pay_box">
        <h3 class="sb">결제수단</h3>
        <div class="payment_method">
          <label class="radio_wrap text n pay">
            <input type="radio" value="card" v-model="paymentMethod" />
            <span class="radio_custom"></span>
            페이크결제
          </label>
          <!-- <label><input type="radio" value="bank" v-model="paymentMethod" /> 무통장입금</label> -->
        </div>
      </div>
      <div class="terms_box">
        <h3 class="sb">이용 및 정보 제공 약관</h3>
        <label>
          <input type="checkbox" v-model="agreeTerms" :class="{ checked: agreeTerms }" />
          <span> 결제 전 이용 및 정보 제공 약관 등의 내용을 확인했으며 이에 동의합니다. </span>
        </label>
        <div>
          <div class="">
            <p class="text sb">1. 개인정보 수집 및 이용 목적</p>
            <p class="text n">
              (1) 비회원 구매 서비스 제공<br />
              비회원 구매에 따른 본인 확인, 물품 배송, 서비스 제공, 계약서․청구서 발송, 본인인증,
              연령인증, 요금결제 및 정산, 채권추심, 서비스 부정 이용 방지, 각종 고지 및 통지 등의
              목적
            </p>
            <p class="text n">
              (2) 고충처리<br />
              민원인의 신원 확인, 민원사항 확인, 사실조사를 위한 연락․통지, 처리 결과 통보 등
            </p>
          </div>
          <div class="">
            <p class="text sb">
              2. 수집하는 개인정보 항목 성명, 주소, 휴대폰번호, 이메일, 결제 정보
            </p>
          </div>
          <div class="">
            <p class="text sb">3. 개인정보 보유 및 이용</p>
            <p class="text n">기간 전자상거래법 등 관계 법령에 의거 구매 후 5년간 보관</p>
            <p class="text sb">
              ※ 동의를 거부할 수 있으나 거부 시 비회원 구매 서비스 이용이 불가합니다. 자세히
              구매조건 확인 및 결제진행 동의
            </p>
          </div>
        </div>
      </div>
    </section>
    <section class="total_section">
      <p class="total medium bb">
        <span>결제금액</span>
        <span class="big">{{ total.toLocaleString() }}원</span>
      </p>
      <button class="pay_btn medium n" @click="handlePayment" :disabled="loading">
        <span v-if="!loading">결제하기</span>
        <span v-else>결제 중...</span>
      </button>
    </section>
  </article>
  <Footer />

  <Modal
    :visible="showCustomerEmptyModal"
    message="주문자 정보를 먼저 모두 입력해주세요."
    @confirm="showCustomerEmptyModal = false"
    :confirmText="'확인'"
    :cancelText="''"
  />
  <Modal
    :visible="adressAlert"
    message="주소 검색 기능을 불러오지 못했습니다. 잠시 후 다시 시도해주세요."
    @confirm="adressAlert = false"
    :confirmText="'확인'"
    :cancelText="''"
  />
  <Modal
    :visible="showTermsAlert"
    message="약관에 동의해야 결제가 가능합니다."
    @confirm="showTermsAlert = false"
    :confirmText="'확인'"
    :cancelText="''"
  />
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { getOrder, clearOrder } from '@/api/order.js'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import Modal from '@/components/Modal.vue'

const router = useRouter()
const store = useStore()
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
      setTimeout(() => detailInput.value?.focus(), 50)
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

const handlePayment = () => {
  if (!agreeTerms.value) {
    showTermsAlert.value = true
    return
  }

  loading.value = true

  setTimeout(() => {
    loading.value = false
    const orderNo = 'ORD' + Date.now()

    // ✅ 주문 정보 Vuex 저장
    store.commit('order/setShipping', shipping.value)
    store.commit('order/setPaymentMethod', paymentMethod.value)
    store.commit('order/setOrderNumber', orderNo)
    store.commit('order/setCustomer', customer.value)

    // ✅ 완료 페이지 이동 (clearOrder 제거)
    router.push('/order/complete')
  }, 2000)
}
</script>

<style scoped lang="scss">
@import '../assets/style/Order.scss';
</style>
