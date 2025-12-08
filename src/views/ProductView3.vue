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
        <router-link to="/selection/new" exact-active-class="active" class="text n">{{
          t('pageTabs.selection.new')
        }}</router-link>
        <router-link to="/selection/best" exact-active-class="active" class="text n">{{
          t('pageTabs.selection.best')
        }}</router-link>
        <router-link to="/selection/sale" exact-active-class="active" class="text n">{{
          t('pageTabs.selection.sale')
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
      menu-type="selection"
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

// 라우트에 따라 selection 카테고리 매핑
const category = computed(() => 'all')

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
