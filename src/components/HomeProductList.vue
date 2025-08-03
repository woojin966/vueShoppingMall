<template>
  <div>
    <article>
      <h2>
        {{
          menuType === 'kitchen' || menuType === 'uncommon'
            ? 'NEW'
            : menuType === 'selection'
              ? 'SALE'
              : menuType === 'brand'
                ? 'BEST'
                : ''
        }}
      </h2>
      <ul class="home_products_list">
        <HomeProductItem
          v-for="item in items"
          :key="item.id"
          :product="item"
          class="product_item"
        />
      </ul>
    </article>
  </div>
</template>

<script setup>
import { onMounted, computed, defineProps, watch } from 'vue'
import { useStore } from 'vuex'
import HomeProductItem from './HomeProductItem.vue'

const props = defineProps({
  menuType: { type: String, required: true },
})

const store = useStore()
const items = computed(() => store.state.product.items)

const loadProducts = async () => {
  console.log('[loadProducts] menuType:', props.menuType)
  await store.dispatch('product/fetchProducts', {
    menuType: props.menuType,
  })
}

onMounted(loadProducts)

// ✅ menuType이 바뀔 때마다 상품 다시 불러오기
watch(
  () => props.menuType,
  async (newVal, oldVal) => {
    console.log(`[watch] menuType changed: ${oldVal} → ${newVal}`)
    await loadProducts()
  },
)
</script>

<style scoped lang="scss">
@import '../assets/style/ProductList.scss';
</style>
