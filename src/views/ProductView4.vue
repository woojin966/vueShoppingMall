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
        <router-link to="/brand/hamblepie" exact-active-class="active">HAMBLEPIE</router-link>
        <router-link to="/brand/puco" exact-active-class="active" class="text n">PUCO</router-link>
        <router-link to="/brand/phutawan" exact-active-class="active" class="text n"
          >PHUTAWAN</router-link
        >
        <router-link to="/brand/smell" exact-active-class="active" class="text n"
          >SMELL LEMONGRASS</router-link
        >
        <router-link to="/brand/orumm" exact-active-class="active" class="text n"
          >ORUMM</router-link
        >
        <router-link to="/brand/backstage" exact-active-class="active" class="text n"
          >BACKSTAGE</router-link
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

    <!-- ProductList에 현재 경로도 함께 전달 -->
    <ProductList :category="category" :path="route.path" :filterType="filterType" />
  </div>
</template>

<script setup>
import { computed, onMounted, ref, getCurrentInstance } from 'vue'
import { randomImages } from '../store/randomImages.js'
import { useRoute } from 'vue-router'
import Header from '@/components/Header.vue'
import ProductList from '@/components/ProductList.vue'

const route = useRoute()

// 브랜드 페이지는 category가 모두 'all'로 고정
const category = computed(() => 'all')

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
