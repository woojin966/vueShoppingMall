<template>
  <Header />
  <article class="order_complete_wrap">
    <section class="order_complete_top_box">
      <div class="check_success"></div>
      <h2 class="bb">{{ t('order.completeTitle') }}</h2>
    </section>
    <section class="order_complete_content">
      <h3 class="sb">
        <span>{{ t('order.orderNumber') }}</span>
        <span class="bb">{{ orderNumber }}</span>
      </h3>
      <ul class="customer_info_list">
        <li>
          <p class="medium">
            <span class="sb">{{ t('order.complete_order.customer') }}</span>
            <span class="bb">{{ customer.name }}</span>
          </p>
        </li>
        <li>
          <p class="medium">
            <span class="sb">{{ t('order.complete_order.phone') }}</span>
            <span class="bb">{{ customer.phone }}</span>
          </p>
        </li>
        <li>
          <p class="medium">
            <span class="sb">{{ t('order.complete_order.email') }}</span>
            <span class="bb">{{ customer.email }}</span>
          </p>
        </li>
      </ul>
      <ul class="shipping_info_list">
        <li>
          <p class="medium">
            <span class="sb">{{ t('order.complete_order.recipient') }}</span>
            <span class="bb">{{ shipping.name }}</span>
          </p>
        </li>
        <li>
          <p class="medium">
            <span class="sb">{{ t('order.complete_order.phone') }}</span>
            <span class="bb">{{ shipping.phone }}</span>
          </p>
        </li>
        <li>
          <p class="medium">
            <span class="sb">{{ t('order.complete_order.email') }}</span>
            <span class="bb">{{ shipping.email }}</span>
          </p>
        </li>
        <li>
          <p class="medium">
            <span class="sb">{{ t('order.complete_order.adress') }}</span>
            <span class="bb">{{ shipping.address }} {{ shipping.detailAddress }}</span>
          </p>
        </li>
        <li>
          <p class="medium">
            <span class="sb">{{ t('order.complete_order.ship_msg') }}</span>
            <span class="bb">{{ shipping.message }}</span>
          </p>
        </li>
      </ul>
    </section>
    <!-- <section class="order_complte_btn_box">
      <router-link to="/" class="btn home medium n">홈으로</router-link>
      <router-link to="/mypage/orders" class="btn medium n">주문 내역 보기</router-link>
    </section> -->
  </article>
  <Footer />
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'

const store = useStore()
const { t } = useI18n()
const orderNumber = computed(() => store.state.order.orderNumber)
const customer = computed(() => store.state.order.customer)
const shipping = computed(() => store.state.order.shipping)

onMounted(() => {})
</script>

<style scoped lang="scss">
@import '../assets/style/OrderComplete.scss';
</style>
