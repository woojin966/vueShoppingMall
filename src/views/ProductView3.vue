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
      <router-link to="/selection/new" exact-active-class="active">NEW</router-link>
      <router-link to="/selection/best" exact-active-class="active">BEST</router-link>
      <router-link to="/selection/sale" exact-active-class="active">SALE</router-link>
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
