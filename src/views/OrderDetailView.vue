<template>
  <Header />

  <article class="order_detail_wrap" v-if="order">
    <section class="order_detail_top_box">
      <h2 class="bb">{{ t('order.detailTitle') }}</h2>
      <p class="order_num text n">Order #{{ order.id }}</p>
      <p class="order_date text n">{{ order.date }}</p>
    </section>

    <!-- 배송 상태 -->
    <section class="status_box">
      <h3 class="sb">{{ t('order.detail_order.shippingInfo') }}</h3>

      <div class="progress_wrap">
        <div v-for="(step, i) in steps" :key="i" class="step" :class="{ active: i <= currentStep }">
          <span class="dot"></span>
          <p class="text n">{{ step }}</p>
        </div>
      </div>
    </section>

    <!-- 주문 상품 -->
    <section class="order_products_box">
      <h3 class="sb">{{ t('order.detail_order.order_item') }}</h3>

      <ul class="order_list">
        <li v-for="(item, i) in order.items" :key="i" class="order_item">
          <img :src="getImgUrl(item.category, item.image)" alt="" />

          <div class="info">
            <p class="name text sb">{{ item.name[locale] }}</p>
            <p class="text n">{{ t('common.quantity') }}: {{ item.quantity }}</p>
          </div>

          <p class="price medium sb">
            {{ (item.price * item.quantity).toLocaleString() }}{{ t('common.currency') }}
          </p>
        </li>
      </ul>
    </section>

    <!-- 가격 요약 -->
    <section class="price_summary_box">
      <h3 class="sb">{{ t('order.detail_order.total_amount') }}</h3>

      <div class="summary_row">
        <span class="text n">{{ t('order.subtotal') }}</span>
        <span class="text n">{{ subtotal.toLocaleString() }}{{ t('common.currency') }}</span>
      </div>

      <div class="summary_row">
        <span class="text n">{{ t('order.shippingFee') }}</span>
        <span class="text n">{{ shippingFee.toLocaleString() }}{{ t('common.currency') }}</span>
      </div>

      <p class="total medium bb">
        Total <span>{{ total.toLocaleString() }}{{ t('common.currency') }}</span>
      </p>
    </section>
  </article>

  <p v-else class="empty_msg text n">{{ t('order.detail_order.order_err_msg') }}</p>

  <Footer />
</template>

<script setup>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { getOrderById } from '@/api/order.js'

const route = useRoute()
const { t, locale } = useI18n()
const orderId = route.params.id

const order = ref(null)

onMounted(() => {
  order.value = getOrderById(orderId)
})

// 배송 단계
const steps = [
  t('order.detail_order.completed'),
  t('order.detail_order.preparing'),
  t('order.detail_order.shipping'),
  t('order.detail_order.delivered'),
]

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
