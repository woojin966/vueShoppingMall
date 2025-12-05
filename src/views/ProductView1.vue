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
        <router-link to="/kitchen" exact-active-class="active" class="text n">전체</router-link>
        <router-link to="/kitchen/summerdish" exact-active-class="active" class="text n"
          >여름의 맛</router-link
        >
        <router-link to="/kitchen/maindish" exact-active-class="active" class="text n"
          >메인디시</router-link
        >
        <router-link to="/kitchen/sidedish" exact-active-class="active" class="text n"
          >사이드디시</router-link
        >
        <router-link to="/kitchen/desert" exact-active-class="active" class="text n"
          >디저트</router-link
        >
        <router-link to="/kitchen/foodit" exact-active-class="active" class="text n"
          >푸드아이템</router-link
        >
      </div>
    </nav>
    <FilterDropdown
      v-model="filterType"
      :options="['filters.latest', 'filters.popular', 'filters.lowPrice', 'filters.highPrice']"
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

  // 여름의 맛은 category 필터 쓰면 안 됨!!
  if (second === 'summerdish') return 'all'

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
