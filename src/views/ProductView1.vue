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
      <router-link to="/kitchen" exact-active-class="active">전체</router-link>
      <router-link to="/kitchen/summerdish" exact-active-class="active">여름의 맛</router-link>
      <router-link to="/kitchen/maindish" exact-active-class="active">메인디시</router-link>
      <router-link to="/kitchen/sidedish" exact-active-class="active">사이드디시</router-link>
      <router-link to="/kitchen/desert" exact-active-class="active">디저트</router-link>
      <router-link to="/kitchen/foodit" exact-active-class="active">푸드아이템</router-link>
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
