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

    <div class="filter_box">
      <p class="selected_filter text sb" @click="toggleDropdown">
        {{ filterType }}
        <span class="arrow small n" :class="{ open: dropdownOpen }">▼</span>
      </p>
      <ul v-show="dropdownOpen" class="filter_options">
        <li
          v-for="option in filterOptions"
          :key="option"
          @click="selectFilter(option)"
          :class="{ active: filterType === option }"
        >
          {{ option }}
        </li>
      </ul>
    </div>

    <!-- Selection용 category prop으로 전달 -->
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

const route = useRoute()

// 라우트에 따라 selection 카테고리 매핑
const category = computed(() => 'all')

// banner
const { imgUrl, randomFilter } = randomImages()

// filter
const filterType = ref('등록순')
const dropdownOpen = ref(false)
const filterOptions = ['등록순', '인기순', '낮은가격순', '높은가격순']

const toggleDropdown = () => (dropdownOpen.value = !dropdownOpen.value)
const selectFilter = (option) => {
  filterType.value = option
  dropdownOpen.value = false
}
</script>

<style scoped lang="scss">
@import '../assets/style/Product.scss';
</style>
