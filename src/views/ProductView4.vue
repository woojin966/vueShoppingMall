<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import ProductList from '@/components/ProductList.vue'

const route = useRoute()

// 브랜드 페이지는 category가 모두 'all'로 고정
const category = computed(() => 'all')
</script>

<template>
  <div>
    <nav class="tabs">
      <router-link to="/brand/hamblepie" exact-active-class="active">HAMBLEPIE</router-link>
      <router-link to="/brand/puco" exact-active-class="active">PUCO</router-link>
      <router-link to="/brand/phutawan" exact-active-class="active">PHUTAWAN</router-link>
      <router-link to="/brand/smell" exact-active-class="active">SMELL LEMONGRASS</router-link>
      <router-link to="/brand/orumm" exact-active-class="active">ORUMM</router-link>
      <router-link to="/brand/backstage" exact-active-class="active">BACKSTAGE</router-link>
    </nav>

    <!-- ProductList에 현재 경로도 함께 전달 -->
    <ProductList :category="category" :path="route.path" />
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
