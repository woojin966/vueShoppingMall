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

    <ProductList :category="category" :filter-type="filterType" />
  </div>
</template>

<script setup>
import { computed, onMounted, ref, getCurrentInstance } from 'vue'
import { randomImages } from '../store/randomImages.js'
import { useRoute } from 'vue-router'
import Header from '@/components/Header.vue'
import ProductList from '@/components/ProductList.vue'

const route = useRoute()

// 경로에 따른 카테고리 매핑 (예: 전체는 'all' 처리)
const category = computed(() => {
  const cat = route.path.split('/')[2]
  return cat || 'all'
})

// banner
const { imgUrl, randomFilter } = randomImages()

// filter
const filterType = ref('등록순') // 기본값
const dropdownOpen = ref(false)
const filterOptions = ['등록순', '인기순', '낮은가격순', '높은가격순']

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
}

const selectFilter = (option) => {
  filterType.value = option
  dropdownOpen.value = false
}
</script>

<style scoped lang="scss">
@import '../assets/style/Product.scss';
</style>
