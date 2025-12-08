<template>
  <Header />
  <div class="page_banner_box">
    <p :class="randomFilter">REIAS</p>
    <img :src="imgUrl" :class="randomFilter" alt="unsplash image" />
  </div>

  <div class="search_results">
    <ProductList
      :category="'all'"
      :filter-type="filterType"
      :search-keyword="keyword"
      :path="'/all-products'"
      @update:noResults="noResults = $event"
    />

    <p v-if="noResults" class="no_results">{{ t('search.noResults') }}</p>
  </div>

  <Footer />
</template>

<script setup>
import { ref, watch, onMounted, getCurrentInstance } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import ProductList from '@/components/ProductList.vue'

const { t } = useI18n()
const route = useRoute()
const store = useStore()

// 검색 키워드
const keyword = ref(route.query.q || '')
console.log('SearchResults mounted — initial keyword =', keyword.value)
watch(
  () => route.query.q,
  (v) => {
    console.log('⭐ SearchResults: query 변함 =', v)
    keyword.value = v || ''
  },
  { immediate: true },
)

// no-result 신호 받기
const noResults = ref(false)

// 배너 이미지
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
const filterType = ref('filters.latest')

onMounted(async () => {
  // 검색 페이지는 항상 전체 상품 로딩
  await store.dispatch('product/fetchProducts', { category: 'all' })

  // 랜덤 필터 + 배너사진
  const randomIndex = Math.floor(Math.random() * filters.length)
  randomFilter.value = filters[randomIndex]

  const res = await proxy.$unsplash.get('/photos/random')
  imgUrl.value = res.data.urls.regular
})
</script>

<style scoped lang="scss">
@import '../assets/style/Header.scss';
</style>
<style scoped lang="scss">
@import '../assets/style/SearchResult.scss';
</style>
