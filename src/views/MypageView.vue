<template>
  <Header />

  <article class="mypage_wrap">
    <section class="mypage_top_box">
      <h1>MY PAGE</h1>
    </section>

    <section class="mypage_content_box">
      <h3 class="bb">{{ t('mypage.orderHistory') }}</h3>

      <ul class="order_list" v-if="orders.length">
        <li v-for="order in orders" :key="order.id" class="order_card">
          <div class="order_info">
            <p class="order_num text sb">Order #{{ order.id }}</p>
            <p class="order_date text n">{{ order.date }}</p>
            <p class="order_summary text n">
              {{ t('mypage.product') }} {{ order.items.length }}{{ t('mypage.ea') }} • Total
              {{ format(order.total) }}{{ t('common.currency') }}
            </p>
          </div>

          <router-link :to="`/order/detail/${order.id}`" class="detail_btn text sb">
            {{ t('mypage.detail') }}
          </router-link>
        </li>
      </ul>

      <p v-else class="empty_msg text n">{{ t('mypage.noOrders') }}</p>
    </section>
  </article>

  <Footer />
</template>

<script setup>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { getOrders } from '@/api/order.js'

const orders = ref([])
const { t } = useI18n()

onMounted(() => {
  orders.value = getOrders()
})

const format = (num) => num.toLocaleString()
</script>

<style scoped lang="scss">
@import '../assets/style/MyPage.scss';
</style>
