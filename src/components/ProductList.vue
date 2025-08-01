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
  path: {
    type: String,
    required: true, // 브랜드 페이지 탭 전환 감지를 위함
  },
})

const store = useStore()

const batchSize = 6
const batchIndex = ref(1)
const isLoaded = ref(false)
const ignoreIntersection = ref(true)

const items = computed(() => store.state.product.items)

const maxBatchIndex = computed(() =>
  items.value.length ? Math.ceil(items.value.length / batchSize) : 1,
)

const hasMore = computed(() => batchIndex.value < maxBatchIndex.value)

const displayedItems = computed(() => {
  if (!isLoaded.value || !items.value.length) return []
  return items.value.slice(0, batchIndex.value * batchSize).filter((item) => item && item.id)
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

const loadProducts = async () => {
  isLoaded.value = false
  batchIndex.value = 1
  ignoreIntersection.value = true

  await store.dispatch('product/fetchProducts', {
    category: props.category,
  })

  isLoaded.value = true
  await setupObserver()

  setTimeout(() => {
    ignoreIntersection.value = false
  }, 1500)
}

onMounted(async () => {
  observer = new IntersectionObserver(handleIntersect, { threshold: 0.1 })
  await loadProducts()
})

// ✅ category나 path가 바뀌면 새로 로딩
watch(
  () => [props.category, props.path],
  async () => {
    await loadProducts()
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
