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
        <router-link to="/selection/new" exact-active-class="active" class="text n"
          >NEW</router-link
        >
        <router-link to="/selection/best" exact-active-class="active" class="text n"
          >BEST</router-link
        >
        <router-link to="/selection/sale" exact-active-class="active" class="text n"
          >SALE</router-link
        >
      </div>
    </nav>
    <FilterDropdown
      v-model="filterType"
      :options="['등록순', '인기순', '낮은가격순', '높은가격순']"
      @change="onChangeFilter"
    />
    <ProductList
      :category="category"
      :filter-type="filterType"
      :path="route.path"
      menu-type="selection"
    />
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

// 라우트에 따라 selection 카테고리 매핑
const category = computed(() => 'all')

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
