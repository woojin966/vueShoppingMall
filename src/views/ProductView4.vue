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
        <router-link to="/brand/hamblepie" exact-active-class="active">{{
          t('pageTabs.brand.hamblepie')
        }}</router-link>
        <router-link to="/brand/puco" exact-active-class="active" class="text n">{{
          t('pageTabs.brand.puco')
        }}</router-link>
        <router-link to="/brand/phutawan" exact-active-class="active" class="text n">{{
          t('pageTabs.brand.phutawan')
        }}</router-link>
        <router-link to="/brand/smell" exact-active-class="active" class="text n">{{
          t('pageTabs.brand.smell')
        }}</router-link>
        <router-link to="/brand/orumm" exact-active-class="active" class="text n">{{
          t('pageTabs.brand.orumm')
        }}</router-link>
        <router-link to="/brand/backstage" exact-active-class="active" class="text n">{{
          t('pageTabs.brand.backstage')
        }}</router-link>
      </div>
    </nav>
    <FilterDropdown
      v-model="filterType"
      :options="['filters.latest', 'filters.popular', 'filters.lowPrice', 'filters.highPrice']"
      @change="onChangeFilter"
    />

    <!-- ProductList에 현재 경로도 함께 전달 -->
    <!-- <ProductList :category="category" :path="route.path" :filterType="filterType" /> -->
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

// 브랜드 페이지는 category가 모두 'all'로 고정
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
