<template>
  <article>
    <transition-group name="fade-up" tag="ul" class="products_list">
      <ProductItem
        v-for="item in displayedItems"
        :key="item.id"
        :product="item"
        class="product_item"
      />
      <!-- 감지용 li -->
      <li v-if="hasMore" ref="observerTarget" class="observer_trigger" aria-hidden="true"></li>
    </transition-group>
  </article>
</template>

<script setup>
import {
  ref,
  computed,
  onMounted,
  onUnmounted,
  nextTick,
  watch,
  defineProps,
  defineEmits,
} from 'vue'
import { useStore } from 'vuex'
import ProductItem from '@/components/ProductItem.vue'

const props = defineProps({
  category: String,
  filterType: String,
  path: String,
})

const emits = defineEmits(['update:noResults'])

const store = useStore()
const batchSize = 6
const batchIndex = ref(1)
const isLoaded = ref(false)

const items = computed(() => store.state.product.items)

const maxBatchIndex = computed(() =>
  items.value.length ? Math.ceil(items.value.length / batchSize) : 1,
)

const hasMore = computed(() => batchIndex.value < maxBatchIndex.value)

const displayedItems = computed(() => {
  if (!isLoaded.value || !items.value.length) return []

  let result = [...items.value]

  // 1. 카테고리/Selection 필터
  if (props.category === 'new') result = result.filter((item) => item.new)
  else if (props.category === 'best') result = result.filter((item) => item.best)
  else if (props.category === 'sale') result = result.filter((item) => item.clearance)
  else if (props.category !== 'all')
    result = result.filter((item) => item.category === props.category)

  // 2. 검색 키워드 필터
  if (props.searchKeyword) {
    const kw = props.searchKeyword.toLowerCase()
    result = result.filter((item) => item.name.toLowerCase().includes(kw))
  }

  // 3. 정렬
  switch (props.filterType) {
    case '인기순':
      result.sort((a, b) => Number(b.popularNum) - Number(a.popularNum))
      break
    case '낮은가격순':
      result.sort((a, b) => Number(a.price) - Number(b.price))
      break
    case '높은가격순':
      result.sort((a, b) => Number(b.price) - Number(a.price))
      break
    case '등록순':
    default:
      break
  }

  emits('update:noResults', result.length === 0)

  return result.slice(0, batchIndex.value * batchSize)
})

const observerTarget = ref(null)
let observer = null

const handleIntersect = (entries) => {
  const [entry] = entries
  if (entry.isIntersecting && hasMore.value) {
    batchIndex.value++
  }
}

// observer 등록 함수
const setupObserver = async () => {
  await nextTick()
  if (observerTarget.value && observer) {
    observer.disconnect() // 이전 observer 제거
    observer.observe(observerTarget.value)
  }
}

const loadProducts = async () => {
  isLoaded.value = false
  batchIndex.value = 1

  await store.dispatch('product/fetchProducts', { category: props.category })
  isLoaded.value = true
  await setupObserver()
}

onMounted(async () => {
  observer = new IntersectionObserver(handleIntersect, {
    root: null,
    threshold: 0,
    rootMargin: '0px 0px 100px 0px', // 스크롤 끝보다 조금 일찍 감지
  })
  await loadProducts()
})

// category나 path 바뀌면 새로 로딩
watch([() => props.category, () => props.path], async () => {
  await loadProducts()
})

// displayedItems가 바뀌면 observer 재등록
watch(displayedItems, setupObserver)

onUnmounted(() => {
  if (observer) observer.disconnect()
})
</script>

<style scoped lang="scss">
@import '../assets/style/ProductList.scss';
</style>
