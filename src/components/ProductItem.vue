<template>
  <li class="product">
    <div class="img_box">
      <img :src="currentImage" @mouseover="hover = true" @mouseleave="hover = false" />
      <div class="badges">
        <span v-if="product.best" class="badge best">BEST</span>
        <span v-if="product.clearance" class="badge clearance"
          >CLEARANCE {{ product.percentage }}%</span
        >
      </div>
    </div>
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
    <p class="desc">{{ product.description }}</p>
  </li>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  product: Object,
})

const hover = ref(false)

const getImgUrl = (filename) => new URL(`../assets/img/apparel/${filename}`, import.meta.url).href
// hover상태에 따라 img src변경
const currentImage = computed(() =>
  hover.value ? getImgUrl(props.product.hoverImage) : getImgUrl(props.product.image),
)
</script>
