<template>
  <Header />
  <router-view />
  <div class="page_banner_box">
    <p :class="randomFilter">REIAS</p>
    <img :src="imgUrl" :class="randomFilter" alt="unsplash image" />
  </div>
  <div class="search_results">
    <ProductList
      :category="'all'"
      :filter-type="filterType"
      :search-keyword="keyword"
      @update:noResults="noResults = $event"
    />
    <p v-if="noResults" class="no_results">검색된 상품이 없습니다.</p>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, getCurrentInstance } from 'vue'
import { useRoute } from 'vue-router'
import Header from '@/components/Header.vue'
import ProductList from '@/components/ProductList.vue'

const route = useRoute()
const keyword = ref(route.query.q || '')
const filterType = ref('등록순')
const noResults = ref(false)

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
@import '../assets/style/Header.scss';
</style>
<style scoped lang="scss">
@import '../assets/style/SearchResult.scss';
</style>
