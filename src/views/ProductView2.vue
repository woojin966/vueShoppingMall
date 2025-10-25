<template>
  <Header />
  <router-view />
  <div>
    <nav class="tabs">
      <router-link to="/uncommon" exact-active-class="active">전체</router-link>
      <router-link to="/uncommon/life" exact-active-class="active">라이프아이템</router-link>
      <router-link to="/uncommon/bag" exact-active-class="active">가방</router-link>
      <router-link to="/uncommon/apparel" exact-active-class="active">의류</router-link>
      <router-link to="/uncommon/socks" exact-active-class="active">양말</router-link>
      <router-link to="/uncommon/fashion" exact-active-class="active">패션</router-link>
      <router-link to="/uncommon/thai-it" exact-active-class="active">타이잇</router-link>
    </nav>

    <ProductList :category="category" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Header from '@/components/Header.vue'
import ProductList from '@/components/ProductList.vue'

const route = useRoute()

// 경로에 따른 카테고리 매핑 (예: 전체는 'all' 처리)
const category = computed(() => {
  const cat = route.path.split('/')[2]
  return cat || 'all'
})
</script>

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
