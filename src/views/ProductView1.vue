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
    <ul class="filter_box">
      <li>
        <a href="javascript:void(0)"> 등록순 </a>
      </li>
      <li>
        <a href="javascript:void(0)"> 인기순 </a>
      </li>
      <li>
        <a href="javascript:void(0)"> 낮은가격순 </a>
      </li>
      <li>
        <a href="javascript:void(0)"> 높은가격순 </a>
      </li>
    </ul>

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
