<template>
  <Header />

  <article class="mypage_wrap">
    <section class="mypage_top_box">
      <h2 class="bb">마이페이지</h2>
    </section>

    <section class="mypage_content_box">
      <h3 class="sb">주문 내역</h3>

      <ul class="order_list" v-if="orders.length">
        <li v-for="order in orders" :key="order.id" class="order_card">
          <div class="order_info">
            <p class="order_num text sb">Order #{{ order.id }}</p>
            <p class="order_date text n">{{ order.date }}</p>
            <p class="order_summary text n">
              상품 {{ order.items.length }}개 • Total {{ format(order.total) }}원
            </p>
          </div>

          <router-link :to="`/order/detail/${order.id}`" class="detail_btn text sb">
            상세보기
          </router-link>
        </li>
      </ul>

      <p v-else class="empty_msg text n">주문 내역이 없습니다.</p>
    </section>
  </article>

  <Footer />
</template>

<script setup>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import { ref, onMounted } from 'vue'
import { getOrders } from '@/api/order.js'

const orders = ref([])

onMounted(() => {
  orders.value = getOrders()
})

const format = (num) => num.toLocaleString()
</script>

<style scoped lang="scss">
@import '../assets/style/MyPage.scss';
</style>
