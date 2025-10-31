<template>
  <Header />

  <div v-if="product" class="product_detail_wrap">
    <!-- 상품 정보 -->
    <div class="product_info">
      <h2 class="product_name">{{ product.name }}</h2>
      <p class="product_price">{{ product.price.toLocaleString() }}원</p>

      <!-- 옵션 선택 -->
      <div v-if="product.options?.length" class="product_options">
        <label v-for="(opt, idx) in product.options" :key="idx">
          <input type="radio" name="option" :value="opt" v-model="selectedOption" />
          {{ opt }}
        </label>
      </div>

      <!-- 수량 -->
      <div class="product_quantity">
        <button @click="decreaseQty">-</button>
        <span>{{ quantity }}</span>
        <button @click="increaseQty">+</button>
      </div>

      <!-- 장바구니 버튼 -->
      <button class="add_cart_btn" @click="handleAddCart">장바구니 담기</button>
    </div>

    <!-- 랜덤 상품 스와이퍼 -->
    <div v-if="randomProductsWithSrc.length" class="random_products_wrap">
      <Swiper
        :modules="[Navigation, Autoplay]"
        navigation
        space-between="10"
        slides-per-view="3"
        class="random_product_swiper"
        :autoplay="{ delay: 4000, disableOnInteraction: false }"
        :preventClicks="false"
        :touchStartPreventDefault="false"
      >
        <SwiperSlide v-for="item in randomProductsWithSrc" :key="item.id">
          <router-link :to="`/product/${item.id}`" class="slide_link">
            <img :src="item.src" :alt="item.name" />
            <p class="slide_name">{{ item.name }}</p>
            <p class="slide_price">{{ item.price.toLocaleString() }}원</p>
          </router-link>
        </SwiperSlide>
      </Swiper>
    </div>
  </div>

  <!-- 장바구니 확인 모달 -->
  <Modal
    :visible="showCartModal"
    message="장바구니로 이동하시겠습니까?"
    @confirm="goToCart"
    @cancel="cancelCart"
  />
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import Header from '@/components/Header.vue'
import Modal from '@/components/Modal.vue'
import { addToCart } from '@/api/cart.js'

// Swiper
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/navigation'
import { Navigation, Autoplay } from 'swiper/modules'

const route = useRoute()
const router = useRouter()
const store = useStore()

const product = ref(null)

// 함수: 현재 route.param.id 기준으로 product 세팅
const loadProduct = async (id) => {
  if (!store.state.product.items.length) {
    await store.dispatch('product/fetchProducts')
  }
  product.value = store.state.product.items.find((item) => item.id == id) || null
}

// 초기 로딩
onMounted(() => {
  loadProduct(route.params.id)
})

// route.params.id가 바뀌면 product 다시 로딩
watch(
  () => route.params.id,
  (newId) => {
    loadProduct(newId)
  },
)

// 옵션/수량
const selectedOption = ref('')
const quantity = ref(1)
const increaseQty = () => quantity.value++
const decreaseQty = () => {
  if (quantity.value > 1) quantity.value--
}

// product 바뀔 때 옵션 초기화
watch(product, (newVal) => {
  selectedOption.value = newVal?.options?.[0] || ''
})

// 장바구니 모달
const showCartModal = ref(false)
const handleAddCart = () => {
  if (!product.value?.id) return
  addToCart({
    ...product.value,
    option: selectedOption.value,
    quantity: quantity.value,
  })
  showCartModal.value = true
}

const goToCart = () => {
  showCartModal.value = false
  router.push('/cart')
}
const cancelCart = () => {
  showCartModal.value = false
}

// 랜덤 상품
const randomProducts = computed(() => {
  if (!store.state.product.items.length || !product.value) return []
  return store.state.product.items
    .filter((item) => item.id !== product.value.id && item.image)
    .sort(() => Math.random() - 0.5)
    .slice(0, 9)
})

// 이미지 경로
const randomProductsWithSrc = computed(() =>
  randomProducts.value.map((item) => ({
    ...item,
    src: item.image
      ? new URL(`../assets/img/${item.category}/${item.image}`, import.meta.url).href
      : '',
  })),
)
</script>

<style scoped></style>
