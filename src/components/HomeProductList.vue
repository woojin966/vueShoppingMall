<template>
  <div>
    <article>
      <h2>
        {{
          menuType === 'kitchen' || menuType === 'uncommon'
            ? t('home.section.new')
            : menuType === 'selection'
              ? t('home.section.sale')
              : menuType === 'brand'
                ? t('home.section.best')
                : ''
        }}
      </h2>
      <ul class="home_products_list">
        <HomeProductItem v-for="item in filteredItems" :key="item.id" :product="item" />
      </ul>
    </article>
  </div>
</template>

<script setup>
import { onMounted, computed, defineProps, watch } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import HomeProductItem from '@/components/HomeProductItem.vue'

const { t } = useI18n()

const props = defineProps({
  menuType: { type: String, required: true },
})

const store = useStore()
const items = computed(() => store.state.product.items)

const filteredItems = computed(() => {
  let list = items.value

  if (props.menuType === 'brand') {
    list = list.filter((p) => p.category !== 'foodit')
  }

  return list
})

const loadProducts = async () => {
  await store.dispatch('product/fetchProducts', {
    menuType: props.menuType,
  })
}

onMounted(loadProducts)

watch(
  () => props.menuType,
  async () => {
    await loadProducts()
  },
)
</script>

<style scoped lang="scss">
@import '../assets/style/ProductList.scss';
</style>
