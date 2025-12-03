<template>
  <Header />
  <router-view />
  <div class="product_wrap">
    <div class="page_banner_box">
      <p :class="randomFilter">REIAS</p>
      <img :src="imgUrl" :class="randomFilter" alt="unsplash image" />
    </div>
    <nav class="tabs">
      <div>
        <router-link to="/uncommon" exact-active-class="active" class="text n">전체</router-link>
        <router-link to="/uncommon/life" exact-active-class="active" class="text n"
          >라이프아이템</router-link
        >
        <router-link to="/uncommon/bag" exact-active-class="active" class="text n"
          >가방</router-link
        >
        <router-link to="/uncommon/apparel" exact-active-class="active" class="text n"
          >의류</router-link
        >
        <router-link to="/uncommon/socks" exact-active-class="active" class="text n"
          >양말</router-link
        >
        <router-link to="/uncommon/fashion" exact-active-class="active" class="text n"
          >패션</router-link
        >
        <router-link to="/uncommon/thai-it" exact-active-class="active" class="text n"
          >타이잇</router-link
        >
      </div>
    </nav>
    <FilterDropdown
      v-model="filterType"
      :options="['등록순', '인기순', '낮은가격순', '높은가격순']"
      @change="onChangeFilter"
    />
    <ProductList :category="category" :filter-type="filterType" :path="route.path" />
  </div>
  <Footer />
</template>

<script setup>
import { computed, onMounted, ref, getCurrentInstance } from 'vue'
import { randomImages } from '../store/randomImages.js'
import { useRoute } from 'vue-router'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import ProductList from '@/components/ProductList.vue'
import FilterDropdown from '@/components/FilterDropdown.vue'

const route = useRoute()

// 경로에 따른 카테고리 매핑 (예: 전체는 'all' 처리)
// const category = computed(() => {
//   const cat = route.path.split('/')[2]
//   return cat || 'all'
// })
const category = computed(() => {
  const second = route.path.split('/')[2]

  // 타이잇 페이지는 true 필터(isThai)만 써야 함
  if (second === 'thai-it') return 'all'

  return second || 'all'
})

// filter
const filterType = ref('등록순')

const onChangeFilter = (option) => {
  filterType.value = option
}

// banner
const { imgUrl, randomFilter } = randomImages()
</script>

<style scoped lang="scss">
@import '../assets/style/Product.scss';
</style>
