<template>
  <li v-if="product" class="home_product">
    <div class="img_box">
      <img :src="currentImage" @mouseover="hover = true" @mouseleave="hover = false" />
    </div>
    <div class="name_price_box">
      <h3>{{ product.name }}</h3>
      <div class="price_box">
        <div v-if="product.clearance">
          <p class="">{{ product.price }}원</p>
          <p class="b_price">{{ product.beforePrice }}원</p>
        </div>
        <div v-else>
          <p class="">{{ product.price }}</p>
        </div>
      </div>
    </div>
    <a href="javascript:void(0)" class="to_detail_btn">MORE</a>
  </li>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  product: Object,
})

const hover = ref(false)

const getImgUrl = (category, filename) =>
  new URL(`../assets/img/${category}/${filename}`, import.meta.url).href
// hover상태에 따라 img src변경
const currentImage = computed(() =>
  hover.value
    ? getImgUrl(props.product.category, props.product.hoverImage)
    : getImgUrl(props.product.category, props.product.image),
)
</script>

<style scoped lang="scss">
@import '../assets/style/ProductItem.scss';
</style>
