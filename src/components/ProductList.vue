<template>
  <div>
    <article>
      <h2>상품목록</h2>
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch, defineProps } from 'vue'
import { useStore } from 'vuex'
import ProductItem from '@/components/ProductItem.vue'

const props = defineProps({
  category: {
    type: String,
    default: 'all',
  },
})

const store = useStore()

const batchSize = 6
const batchIndex = ref(1)
const isLoaded = ref(false)
const ignoreIntersection = ref(true)

const items = computed(() => store.state.products.items)

const maxBatchIndex = computed(() =>
  items.value.length ? Math.ceil(items.value.length / batchSize) : 1,
)

const hasMore = computed(() => batchIndex.value < maxBatchIndex.value)

const displayedItems = computed(() => {
  if (!isLoaded.value || !items.value.length) return []
  return items.value.slice(0, batchIndex.value * batchSize)
})

const observerTarget = ref(null)
let observer = null

const handleIntersect = (entries) => {
  const [entry] = entries
  if (entry.isIntersecting && hasMore.value && !ignoreIntersection.value) {
    batchIndex.value++
  }
}

const setupObserver = async () => {
  if (observer) observer.disconnect()
  await nextTick()
  if (observerTarget.value && observer) {
    observer.observe(observerTarget.value)
  }
}

onMounted(async () => {
  observer = new IntersectionObserver(handleIntersect, { threshold: 0.1 })

  // 카테고리별 상품 불러오기
  await store.dispatch('products/fetchProducts', { category: props.category })

  isLoaded.value = true
  batchIndex.value = 1

  await setupObserver()

  setTimeout(() => {
    ignoreIntersection.value = false
  }, 1500)
})

// 카테고리 바뀔 때마다 다시 불러오기 및 batchIndex 초기화
watch(
  () => props.category,
  async (newCat) => {
    isLoaded.value = false
    batchIndex.value = 1
    ignoreIntersection.value = true

    await store.dispatch('products/fetchProducts', { category: newCat })

    isLoaded.value = true
    await setupObserver()

    setTimeout(() => {
      ignoreIntersection.value = false
    }, 1500)
  },
)

watch([items, batchIndex], setupObserver)

onUnmounted(() => {
  if (observer) observer.disconnect()
})
</script>

<style scoped>
.observer_trigger {
  height: 1px;
  opacity: 0;
  pointer-events: none;
  margin-top: 50px;
}
</style>
