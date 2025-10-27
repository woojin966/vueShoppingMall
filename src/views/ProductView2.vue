<template>
  <Header />
  <router-view />
  <div class="product_wrap">
    <div class="page_banner_box">
      <img :src="imgUrl" :class="randomFilter" alt="unsplash image" />
    </div>
    <nav class="tabs">
      <router-link to="/uncommon" exact-active-class="active" class="text n">전체</router-link>
      <router-link to="/uncommon/life" exact-active-class="active" class="text n"
        >라이프아이템</router-link
      >
      <router-link to="/uncommon/bag" exact-active-class="active" class="text n">가방</router-link>
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
    </nav>

    <ProductList :category="category" />
  </div>
</template>

<script setup>
import { computed, onMounted, ref, getCurrentInstance } from 'vue'
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
const { proxy } = getCurrentInstance()
const imgUrl = ref('')
const filters = [
  'filter-clarendon',
  'filter-gingham',
  'filter-juno',
  'filter-lark',
  'filter-reyes',
  'filter-valencia',
  'filter-willow',
]
const randomFilter = ref('')
onMounted(async () => {
  const randomIndex = Math.floor(Math.random() * filters.length)
  randomFilter.value = filters[randomIndex]

  const res = await proxy.$unsplash.get('/photos/random', {
    // params: { query: 'nature' },
  })
  imgUrl.value = res.data.urls.regular
})
</script>

<style scoped lang="scss">
@import '../assets/style/Product.scss';
</style>
