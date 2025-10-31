<template>
  <li v-if="product" class="home_product">
    <div class="img_box">
      <img :src="currentImage" @mouseover="hover = true" @mouseleave="hover = false" />
    </div>
    <div class="name_price_box">
      <h3 class="medium sb">{{ product.name }}</h3>
      <div class="price_box">
        <div class="clearance_price_box" v-if="product.clearance">
          <p class="price_num b_price text">₩ {{ product.beforePrice }}</p>
          <p class="price_num c_price big">₩ {{ product.price }}</p>
        </div>
        <p v-else class="price_num price big">₩ {{ product.price }}</p>
      </div>
      <div class="more_btn_box">
        <router-link :to="`/product/${product.id}`" class="to_detail_btn medium n">
          MORE
        </router-link>
      </div>
    </div>
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
