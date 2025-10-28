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

    <!-- ProductList에 현재 경로도 함께 전달 -->
    <ProductList :category="category" :path="route.path" />
  </div>
</template>

<script setup>
import { computed, onMounted, ref, getCurrentInstance } from 'vue'
import { useRoute } from 'vue-router'
import Header from '@/components/Header.vue'
import ProductList from '@/components/ProductList.vue'

const route = useRoute()

// 브랜드 페이지는 category가 모두 'all'로 고정
const category = computed(() => 'all')

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
