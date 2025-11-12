<template>
  <section class="order_view">
    <h2 class="title">🧾 주문서</h2>

    <!-- Progress -->
    <div class="progress_bar">
      <span class="step active">장바구니</span>
      <span class="arrow">→</span>
      <span class="step active">주문서</span>
      <span class="arrow">→</span>
      <span class="step">완료</span>
    </div>

    <!-- 상품 리스트 -->
    <div class="order_section">
      <h3>주문 상품</h3>
      <ul class="order_list">
        <li v-for="item in orderItems" :key="item.id" class="order_item">
          <img :src="getImgUrl(item.category, item.image)" alt="" />
          <div class="item_info">
            <p class="name">{{ item.name }}</p>
            <p class="option" v-if="item.option">옵션: {{ item.option }}</p>
            <p class="quantity">수량: {{ item.quantity }}</p>
            <p class="price">{{ (item.price * item.quantity).toLocaleString() }}원</p>
          </div>
        </li>
      </ul>
    </div>

    <!-- 배송지 -->
    <div class="order_section">
      <h3>배송 정보</h3>
      <div class="shipping_form">
        <input v-model="shipping.name" placeholder="이름" required />
        <input v-model="shipping.phone" placeholder="연락처" required />
        <input v-model="shipping.address" placeholder="주소" required />
      </div>
    </div>

    <!-- 결제수단 -->
    <div class="order_section">
      <h3>결제수단</h3>
      <div class="payment_method">
        <label><input type="radio" value="card" v-model="paymentMethod" /> 카드결제</label>
        <label><input type="radio" value="bank" v-model="paymentMethod" /> 무통장입금</label>
      </div>
    </div>

    <!-- 결제 -->
    <div class="order_section total_section">
      <p class="total">
        총 합계: <span>{{ total.toLocaleString() }}</span
        >원
      </p>
      <button class="pay_btn" @click="handlePayment" :disabled="loading">
        <span v-if="!loading">결제하기</span>
        <span v-else>결제 중...</span>
      </button>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { getOrder, clearOrder } from '@/api/order.js'

const router = useRouter()
const store = useStore()
const orderItems = ref([])
const shipping = ref({ name: '', phone: '', address: '' })
const paymentMethod = ref('card')
const total = ref(0)
const loading = ref(false)

const getImgUrl = (category, filename) =>
  new URL(`../assets/img/${category}/${filename}`, import.meta.url).href

onMounted(() => {
  // Vuex에서 바로 가져오기
  orderItems.value = store.state.order.items

  total.value = orderItems.value.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0,
  )
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
.order_view {
  max-width: 800px;
  margin: 60px auto;
  padding: 24px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  .title {
    font-size: 1.8rem;
    margin-bottom: 20px;
    text-align: center;
  }

  .progress_bar {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    margin-bottom: 30px;
    .step {
      color: #bbb;
      &.active {
        color: #222;
        font-weight: 600;
      }
    }
    .arrow {
      color: #888;
    }
  }

  .order_section {
    margin-bottom: 32px;
    h3 {
      font-size: 1.2rem;
      margin-bottom: 12px;
      border-bottom: 1px solid #ddd;
      padding-bottom: 4px;
    }

    .order_list {
      list-style: none;
      padding: 0;

      .order_item {
        display: flex;
        gap: 16px;
        padding: 12px 0;
        border-bottom: 1px solid #eee;
        img {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: 8px;
        }
        .item_info {
          flex: 1;
          .name {
            font-weight: 600;
            margin-bottom: 4px;
          }
          .quantity,
          .price {
            color: #555;
          }
        }
      }
    }

    .shipping_form input {
      display: block;
      width: 100%;
      margin-bottom: 10px;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 6px;
    }

    .payment_method {
      label {
        margin-right: 16px;
        input {
          margin-right: 6px;
        }
      }
    }

    &.total_section {
      text-align: center;
      .total {
        font-size: 1.4rem;
        margin-bottom: 20px;
        span {
          font-weight: 700;
          color: #e44;
        }
      }
      .pay_btn {
        padding: 14px 40px;
        border: none;
        border-radius: 8px;
        background: #e44;
        color: #fff;
        font-size: 1.1rem;
        cursor: pointer;
        &:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      }
    }
  }

  @media (max-width: 480px) {
    padding: 16px;
    .order_item {
      flex-direction: column;
      align-items: center;
    }
  }
}
</style>
