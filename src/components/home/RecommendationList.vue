<template>
  <section class="recommend_section">
    <h2 class="section_title">Recommended for You</h2>

    <ul class="product_grid">
      <HomeProductItem
        v-for="(item, i) in products"
        :key="i"
        :product="item"
        class="home_item_card"
      />
    </ul>
  </section>
</template>

<script setup>
import HomeProductItem from '@/components/HomeProductItem.vue'
import { ref, onMounted } from 'vue'
import { getAllProducts as getMenu1 } from '@/api/productmenu1'
import { getAllProducts as getMenu2 } from '@/api/productmenu2'

const products = ref([])

onMounted(async () => {
  const menu1 = await getMenu1()
  const menu2 = await getMenu2()
  const all = [...menu1, ...menu2]

  // 랜덤 6개 추천
  const randomized = all.sort(() => Math.random() - 0.5)
  products.value = randomized.slice(0, 6)
})
</script>

<style scoped lang="scss">
@import '../../assets/style/RecommendationList.scss';
</style>
