<template>
  <li v-if="product" class="product">
    <router-link class="product_link">
      <div class="img_box">
        <img :src="currentImage" @mouseover="hover = true" @mouseleave="hover = false" />
      </div>
      <div class="title">
        <span v-if="product.best" class="badge best">BEST</span>
        <span v-if="product.clearance" class="badge clearance"
          >CLEARANCE {{ product.percentage }}%</span
        >
        <h3 class="text sb">{{ product.name }}</h3>
      </div>
      <div class="price_box">
        <div v-if="product.clearance" class="clearance_price">
          <p class="price b_price">{{ product.price }}원</p>
          <p class="price c_price">{{ product.beforePrice }}원</p>
        </div>
        <div v-else>
          <p class="price">{{ product.price }}원</p>
        </div>
      </div>
      <p class="desc small n">{{ product.description }}</p>
    </router-link>
  </li>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick, computed } from 'vue'

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

const setImgHeight = () => {
  const images = document.querySelectorAll('.img_box img')
  images.forEach((img) => {
    const width = img.clientWidth
    img.style.height = `${width}px` // 세로를 가로에 맞춤
  })
}

onMounted(() => {
  nextTick(() => {
    setImgHeight()

    const productList = document.querySelector('.product_list')
    if (productList) {
      const observer = new MutationObserver(() => setImgHeight())
      observer.observe(productList, { childList: true, subtree: true })

      onBeforeUnmount(() => {
        observer.disconnect()
      })
    }
  })

  window.addEventListener('resize', setImgHeight)
  onBeforeUnmount(() => window.removeEventListener('resize', setImgHeight))
})
</script>

<style scoped lang="scss">
@import '../assets/style/ProductItem.scss';
</style>
