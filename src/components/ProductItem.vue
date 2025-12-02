<template>
  <li v-if="product" class="product">
    <router-link :to="`/product/${product.id}`" class="product_link">
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
          <p class="price b_price">{{ formattedPrice }}원</p>
          <p class="price c_price">{{ formattedBeforePrice }}원</p>
        </div>
        <div v-else>
          <p class="price">{{ formattedPrice }}원</p>
        </div>
      </div>
      <p class="desc small n">{{ product.description }}</p>
      <button type="button" class="item_cart_btn" @click.stop.prevent="handleAddCart">
        <font-awesome-icon icon="fa-solid fa-cart-shopping" />
      </button>
    </router-link>
    <Modal
      :visible="showCartModal"
      message="장바구니로 이동하시겠습니까?"
      @confirm="goToCart"
      @cancel="cancelCart"
    />
  </li>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick, computed } from 'vue'
import { useRouter } from 'vue-router'
import Modal from './Modal.vue'

const hover = ref(false)
const props = defineProps({
  product: Object,
})
const router = useRouter()
const showCartModal = ref(false)

const handleAddCart = () => {
  addToCart(props.product)
  showCartModal.value = true // 모달 띄우기
}

const goToCart = () => {
  showCartModal.value = false
  router.push('/cart') // 이동
}

const cancelCart = () => {
  showCartModal.value = false // 그냥 모달 닫기
}

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

// 3자리마다 콤마 찍는 함수
const formatPrice = (num) => {
  if (num === undefined || num === null) return ''
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
const formattedPrice = computed(() => formatPrice(props.product.price))
const formattedBeforePrice = computed(() => formatPrice(props.product.beforePrice))
</script>

<style scoped lang="scss">
@import '../assets/style/ProductItem.scss';
</style>
