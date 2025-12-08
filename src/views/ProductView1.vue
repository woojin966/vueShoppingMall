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
        <router-link to="/kitchen" exact-active-class="active" class="text n">{{
          t('pageTabs.kitchen.all')
        }}</router-link>
        <router-link to="/kitchen/summerdish" exact-active-class="active" class="text n">{{
          t('pageTabs.kitchen.summerdish')
        }}</router-link>
        <router-link to="/kitchen/maindish" exact-active-class="active" class="text n">{{
          t('pageTabs.kitchen.maindish')
        }}</router-link>
        <router-link to="/kitchen/sidedish" exact-active-class="active" class="text n">{{
          t('pageTabs.kitchen.sidedish')
        }}</router-link>
        <router-link to="/kitchen/desert" exact-active-class="active" class="text n">{{
          t('pageTabs.kitchen.desert')
        }}</router-link>
        <router-link to="/kitchen/foodit" exact-active-class="active" class="text n">{{
          t('pageTabs.kitchen.foodit')
        }}</router-link>
      </div>
    </nav>
    <FilterDropdown
      v-model="filterType"
      :options="['filters.latest', 'filters.popular', 'filters.lowPrice', 'filters.highPrice']"
      @change="onChangeFilter"
    />
    <ProductList
      :category="category"
      :filter-type="filterType"
      :path="route.path"
      :search-keyword="keyword"
    />
  </div>
  <Footer />
</template>

<script setup>
import { computed, onMounted, ref, getCurrentInstance } from 'vue'
import { randomImages } from '../store/randomImages.js'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import ProductList from '@/components/ProductList.vue'
import FilterDropdown from '@/components/FilterDropdown.vue'

const route = useRoute()
const { t } = useI18n()
const keyword = ref(route.query.q || '')

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
const filterType = ref('filters.latest')

const onChangeFilter = (option) => {
  filterType.value = option
}

// banner
const { imgUrl, randomFilter } = randomImages()
</script>

<style scoped lang="scss">
@import '../assets/style/Product.scss';
</style>
