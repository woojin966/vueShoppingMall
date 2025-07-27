<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import ProductList from '@/components/ProductList.vue'

const route = useRoute()

// 경로에 따른 카테고리 매핑 (예: 전체는 'all' 처리)
const category = computed(() => {
  const cat = route.path.split('/')[2]
  return cat || 'all'
})
</script>

<template>
  <div>
    <nav class="tabs">
      <router-link to="/product" exact-active-class="active">전체</router-link>
      <router-link to="/product/life" exact-active-class="active">라이프아이템</router-link>
      <router-link to="/product/bag" exact-active-class="active">가방</router-link>
      <router-link to="/product/apparel" exact-active-class="active">의류</router-link>
      <router-link to="/product/socks" exact-active-class="active">양말</router-link>
      <router-link to="/product/fashion" exact-active-class="active">패션</router-link>
      <router-link to="/product/thai-it" exact-active-class="active">타이잇</router-link>
    </nav>

    <ProductList :category="category" />
  </div>
</template>

<style scoped>
.tabs {
  display: flex;
  gap: 12px;
}
.active {
  font-weight: bold;
  border-bottom: 2px solid #000;
}
</style>
