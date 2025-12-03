<template>
  <Header />

  <article class="order_detail_wrap" v-if="order">
    <section class="order_detail_top_box">
      <h2 class="bb">주문 상세</h2>
      <p class="order_num text n">Order #{{ order.id }}</p>
      <p class="order_date text n">{{ order.date }}</p>
    </section>

    <!-- 배송 상태 -->
    <section class="status_box">
      <h3 class="sb">배송 상태</h3>

      <div class="progress_wrap">
        <div v-for="(step, i) in steps" :key="i" class="step" :class="{ active: i <= currentStep }">
          <span class="dot"></span>
          <p class="text n">{{ step }}</p>
        </div>
      </div>
    </section>

    <!-- 주문 상품 -->
    <section class="order_products_box">
      <h3 class="sb">주문 상품</h3>

      <ul class="order_list">
        <li v-for="(item, i) in order.items" :key="i" class="order_item">
          <img :src="getImgUrl(item.category, item.image)" alt="" />

          <div class="info">
            <p class="name text sb">{{ item.name }}</p>
            <p class="text n">수량: {{ item.quantity }}</p>
          </div>

          <p class="price medium sb">{{ (item.price * item.quantity).toLocaleString() }}원</p>
        </li>
      </ul>
    </section>

    <!-- 가격 요약 -->
    <section class="price_summary_box">
      <h3 class="sb">결제 금액</h3>

      <div class="summary_row">
        <span class="text n">Subtotal</span>
        <span class="text n">{{ subtotal.toLocaleString() }}원</span>
      </div>

      <div class="summary_row">
        <span class="text n">Shipping</span>
        <span class="text n">{{ shippingFee.toLocaleString() }}원</span>
      </div>

      <p class="total medium bb">
        Total <span>{{ total.toLocaleString() }}원</span>
      </p>
    </section>
  </article>

  <p v-else class="empty_msg text n">주문 정보를 찾을 수 없습니다.</p>

  <Footer />
</template>

<script setup>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getOrderById } from '@/api/order.js'

const route = useRoute()
const orderId = route.params.id

const order = ref(null)

onMounted(() => {
  order.value = getOrderById(orderId)
})

// 배송 단계
const steps = ['주문 완료', '배송 준비', '배송 중', '배송 완료']

const currentStep = computed(() => {
  if (!order.value) return 0
  switch (order.value.status) {
    case 'ready':
      return 1
    case 'delivering':
      return 2
    case 'done':
      return 3
    default:
      return 0
  }
})

// 가격 계산
const subtotal = computed(() =>
  order.value
    ? order.value.items.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0)
    : 0,
)

const shippingFee = 3000

const total = computed(() => subtotal.value + shippingFee)

// 이미지 경로
const getImgUrl = (category, filename) =>
  new URL(`../assets/img/${category}/${filename}`, import.meta.url).href
</script>

<style scoped lang="scss">
@import '../assets/style/OrderDetail.scss';
</style>
