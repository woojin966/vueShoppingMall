<template>
  <Header />

  <article v-if="product" class="product_detail_wrap">
    <!-- 상품 정보 -->
    <section class="product_info">
      <div class="thumbnail_box">
        <!-- 메인 상품 이미지 -->
        <img :src="mainImage" :alt="product.description[locale]" class="product_img" />

        <!-- 썸네일 -->
        <div class="thumbnails">
          <img
            v-for="n in 3"
            :key="n"
            :src="imgUrl"
            :class="[randomFilter, { hover: hovered === n, active: selected === n }]"
            alt="unsplash image"
            @mouseover="onThumbOver(n)"
            @mouseleave="onThumbLeave()"
            @click="selectThumbnail(n)"
          />
        </div>
      </div>

      <div class="product_title_price_box">
        <div>
          <h2 class="product_name medium sb">{{ product.name[locale] }}</h2>
          <p class="product_price big bb">
            {{ Number(product.price).toLocaleString() }}{{ t('common.currency') }}
          </p>
          <div class="product_quantity">
            <button @click="decreaseQty"><span></span></button>
            <input
              type="number"
              v-model.number="quantity"
              min="1"
              class="quantity_input medium sb"
            />
            <button @click="increaseQty"><span></span><span></span></button>
          </div>
        </div>

        <button class="add_cart_btn medium sb" @click="handleAddCart">
          {{ t('productDetail.addToCart') }}
        </button>
      </div>
    </section>

    <!-- 탭 -->
    <section class="productdetails_tab_btn_wrap">
      <ul>
        <li>
          <a
            href="javascript:void(0)"
            class="detailpage_tab_btn medium n"
            @click="scrollToSection('productdetails_wrap')"
          >
            {{ t('productDetail.tabs.detail') }}
          </a>
        </li>
        <li>
          <a
            href="javascript:void(0)"
            class="detailpage_tab_btn medium n"
            @click="scrollToSection('review_wrap')"
          >
            {{ t('productDetail.tabs.review') }}
          </a>
        </li>
        <li>
          <a
            href="javascript:void(0)"
            class="detailpage_tab_btn medium n"
            @click="scrollToSection('qna_wrap')"
          >
            {{ t('productDetail.tabs.qna') }}
          </a>
        </li>
      </ul>
    </section>

    <!-- 상세정보 -->
    <section class="productdetails_wrap">
      <div class="describe_box">
        <p class="text n">
          <span class="bb">{{ t('productDetail.sections.detailTitle') }}</span
          ><br />
          {{ t('productDetail.detailLorem') }}
        </p>
      </div>

      <div class="product_detaim_images_box">
        <img v-for="n in 3" :key="n" :src="imgUrl" :class="randomFilter" alt="unsplash image" />
      </div>

      <div class="product_detail_bottom_box">
        <p class="text n">
          <span class="bb">{{ t('productDetail.sections.shippingTitle') }}</span
          ><br />
          {{ t('productDetail.sections.shippingArea') }}
          <br />
          {{ t('productDetail.sections.shippingFee') }}
          <br />
          {{ t('productDetail.sections.shippingPeriod') }}
          <br />
          {{ t('productDetail.sections.shippingNotice') }}
        </p>

        <p class="text n">
          <span class="bb">{{ t('productDetail.sections.exchangeTitle') }}</span
          ><br />
          {{ t('productDetail.sections.exchange1') }}
          <br />
          {{ t('productDetail.sections.exchange2') }}
          <br />
          {{ t('productDetail.sections.exchange3') }}
        </p>
      </div>
    </section>

    <!-- 리뷰 -->
    <section class="review_wrap">
      <div>
        <h3 class="big sb">{{ t('productDetail.review.title') }}</h3>
        <button class="text n" @click="openModal('review')">
          {{ t('productDetail.review.write') }}
        </button>
      </div>

      <table v-if="reviews.length" class="review_table">
        <thead>
          <tr>
            <th>{{ t('productDetail.review.subject') }}</th>
            <th>{{ t('productDetail.review.writer') }}</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(review, index) in reviews" :key="index">
            <tr @click="toggleDetail('review', index)" class="review_row">
              <td>{{ review.title }}</td>
              <td>{{ review.name }}</td>
            </tr>

            <tr v-if="activeReviewIndex === index" class="review_detail_row">
              <td colspan="2" class="content">
                <img v-if="review.image" :src="review.image" class="review_image" />
                <p class="review_content text n">{{ review.content }}</p>
              </td>
            </tr>
          </template>
        </tbody>
      </table>

      <p v-else>{{ t('productDetail.review.noData') }}</p>
    </section>

    <!-- QNA -->
    <section class="qna_wrap">
      <div>
        <h3 class="big sb">{{ t('productDetail.qna.title') }}</h3>
        <button class="text n" @click="openModal('qna')">
          {{ t('productDetail.qna.write') }}
        </button>
      </div>

      <table v-if="qnas.length" class="review_table">
        <thead>
          <tr>
            <th>{{ t('productDetail.qna.subject') }}</th>
            <th>{{ t('productDetail.qna.writer') }}</th>
          </tr>
        </thead>

        <tbody>
          <template v-for="(qna, index) in qnas" :key="index">
            <tr @click="toggleDetail('qna', index)" class="qna_row">
              <td>
                <!-- <th>{{ t('productDetail.qna.writer') }}</th> -->
                {{ qna.secret && !qna.showContent ? t('productDetail.qna.locked') : qna.title }}
              </td>
              <td>{{ qna.name }}</td>
            </tr>

            <tr v-if="activeQnaIndex === index" class="qna_detail_row">
              <td colspan="2">
                <div v-if="qna.secret && !qna.showContent" class="password">
                  <input
                    type="password"
                    v-model="enteredPassword"
                    :placeholder="t('productDetail.qna.secretPlaceholder')"
                    class="text n"
                  />
                  <button class="text n" @click="checkPassword(qna)">
                    {{ t('common.confirm') }}
                  </button>
                </div>

                <div class="content" v-else>
                  <img v-if="qna.image" :src="qna.image" class="qna_image" />
                  <p class="qna_content text n">{{ qna.content }}</p>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>

      <p v-else>{{ t('productDetail.qna.noData') }}</p>
    </section>

    <!-- 랜덤 상품 -->
    <div v-if="randomProductsWithSrc.length" class="random_products_wrap">
      <Swiper
        :modules="[Navigation, Autoplay]"
        :space-between="20"
        :slides-per-view="3"
        class="random_product_swiper"
        :autoplay="{ delay: 4000, disableOnInteraction: false }"
        :preventClicks="false"
        :touchStartPreventDefault="false"
        :breakpoints="{
          0: { slidesPerView: 1 },
          481: { slidesPerView: 2 },
          769: { slidesPerView: 3 },
        }"
      >
        <SwiperSlide v-for="item in randomProductsWithSrc" :key="item.id">
          <router-link :to="`/product/${item.id}`" class="slide_link">
            <img :src="item.src" :alt="item.name[locale]" />
            <p class="slide_name text n">{{ item.name[locale] }}</p>
          </router-link>
        </SwiperSlide>
      </Swiper>
    </div>
  </article>

  <Footer />

  <!-- 장바구니 확인 모달 -->
  <Modal
    :visible="showCartModal"
    :message="t('productDetail.moveCartMsg')"
    @confirm="goToCart"
    @cancel="cancelCart"
  />

  <!-- 리뷰/QNA 작성 모달 -->
  <Modal
    :visible="showWriteModal"
    :confirmText="t('common.submit')"
    :cancelText="t('common.cancel')"
    @confirm="submitForm"
    @cancel="cancelForm"
  >
    <template #default>
      <div class="review_form">
        <!-- 작성자 -->
        <div class="form_group">
          <label class="text n">{{ t('productDetail.review.writer') }}</label>

          <div v-if="isLoggedIn">
            <p class="user_id text sb">{{ userId }}</p>
          </div>

          <div v-else>
            <input
              v-model="formData.name"
              type="text"
              :placeholder="t('productDetail.form.writerPlaceholder')"
              class="text n"
              required
            />
          </div>
        </div>

        <!-- 제목 -->
        <div class="form_group">
          <label class="text n">{{ t('productDetail.form.title') }}</label>
          <input
            v-model="formData.title"
            type="text"
            :placeholder="t('productDetail.form.enterTitle')"
            class="text n"
            required
          />
        </div>

        <!-- 비공개(QNA) -->
        <div v-if="modalType === 'qna'" class="form_group for_qna">
          <label class="text n">
            <input
              type="checkbox"
              v-model="formData.secret"
              :class="{ checked: formData.secret }"
            />
            {{ t('productDetail.qna.secret') }}
          </label>

          <input
            v-if="formData.secret"
            v-model="formData.password"
            type="password"
            :placeholder="t('productDetail.qna.secretPlaceholder')"
            class="text n"
            required
          />
        </div>

        <!-- 사진 업로드 -->
        <div class="form_group file_upload_box">
          <label class="text n">{{ t('productDetail.form.imageOptional') }}</label>

          <label class="file_upload_btn text n">
            {{ t('productDetail.form.chooseImage') }}
            <input type="file" accept="image/*" @change="onImageChange" />
          </label>

          <p v-if="fileName" class="file_name text n">{{ fileName }}</p>
        </div>

        <!-- 내용 -->
        <div class="form_group">
          <label class="text n">{{ t('productDetail.form.content') }}</label>
          <textarea
            v-model="formData.content"
            :placeholder="t('productDetail.form.enterContent')"
            class="text n"
            required
          ></textarea>
        </div>
      </div>
    </template>
  </Modal>

  <!-- ALERT 모달 -->
  <Modal
    :visible="showAlertModal"
    :message="alertMessage"
    @confirm="showAlertModal = false"
    :confirmText="t('common.confirm')"
    :cancelText="''"
  />
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import Modal from '@/components/Modal.vue'
import { addToCart } from '@/api/cart.js'
import { randomImages } from '../store/randomImages.js'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/navigation'
import { Navigation, Autoplay } from 'swiper/modules'

const { t, locale } = useI18n()

const { imgUrl, randomFilter } = randomImages()
const route = useRoute()
const router = useRouter()
const store = useStore()

const product = ref(null)
const selectedOption = ref('')
const quantity = ref(1)

const increaseQty = () => quantity.value++
const decreaseQty = () => quantity.value > 1 && quantity.value--

const showCartModal = ref(false)
const handleAddCart = () => {
  if (!product.value?.id) return
  addToCart({ ...product.value, quantity: Number(quantity.value) })
  showCartModal.value = true
}
const goToCart = () => {
  showCartModal.value = false
  router.push('/cart')
}
const cancelCart = () => (showCartModal.value = false)

// =====================
// 상품 로딩
// =====================
onMounted(() => {
  loadProduct(route.params.id)
})

watch(
  () => route.params.id,
  (newId) => {
    loadProduct(newId)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  },
)

const showAlertModal = ref(false)
const alertMessage = ref('')

// 리뷰/QNA
const showWriteModal = ref(false)
const modalType = ref('review')
const isLoggedIn = ref(false)
const userId = ref('user123')

const formData = ref({
  name: '',
  title: '',
  content: '',
  image: '',
  secret: false,
  password: '',
})

const reviews = ref([])
const qnas = ref([])

const activeReviewIndex = ref(null)
const activeQnaIndex = ref(null)
const enteredPassword = ref('')

const openModal = (type) => {
  modalType.value = type
  showWriteModal.value = true
}

const cancelForm = () => {
  showWriteModal.value = false
  resetForm()
}

const resetForm = () => {
  formData.value = {
    name: '',
    title: '',
    content: '',
    image: '',
    secret: false,
    password: '',
  }
}

// 파일 업로드
const fileName = ref('')
const onImageChange = (e) => {
  const file = e.target.files[0]
  if (file) {
    fileName.value = file.name
    formData.value.image = URL.createObjectURL(file)
  } else {
    fileName.value = ''
    formData.value.image = null
  }
}

// 제출
const submitForm = () => {
  if (!isLoggedIn.value && !formData.value.name) {
    alertMessage.value = t('productDetail.alert.needWriter')
    showAlertModal.value = true
    return
  }
  if (!formData.value.title || !formData.value.content) {
    alertMessage.value = t('productDetail.alert.needTitleContent')
    showAlertModal.value = true
    return
  }

  const item = {
    name: isLoggedIn.value ? userId.value : formData.value.name,
    title: formData.value.title,
    content: formData.value.content,
    image: formData.value.image,
    secret: formData.value.secret,
    password: formData.value.password,
    showContent: !formData.value.secret,
  }

  if (modalType.value === 'review') reviews.value.push(item)
  else qnas.value.push(item)

  showWriteModal.value = false
  resetForm()
}

// 토글
const toggleDetail = (type, index) => {
  if (type === 'review') {
    activeReviewIndex.value = activeReviewIndex.value === index ? null : index
  } else {
    activeQnaIndex.value = activeQnaIndex.value === index ? null : index
    enteredPassword.value = ''
  }
}

// 비밀번호 확인
const checkPassword = (qna) => {
  if (enteredPassword.value === qna.password) {
    qna.showContent = true
  } else {
    alertMessage.value = t('productDetail.alert.wrongPassword')
    showAlertModal.value = true
  }
}

// 상품 불러오기
const loadProduct = async (id) => {
  if (!store.state.product.items.length) {
    await store.dispatch('product/fetchProducts')
  }
  product.value = store.state.product.items.find((item) => item.id == id) || null
}

// 이미지 설정
const getImgUrl = (category, filename) =>
  new URL(`../assets/img/${category}/${filename}`, import.meta.url).href

const productImage = computed(() =>
  product.value ? getImgUrl(product.value.category, product.value.image) : '',
)

const mainImage = ref('')
const hovered = ref(null)
const selected = ref(null)

const onThumbOver = (n) => {
  hovered.value = n
  if (selected.value === null) {
    mainImage.value = imgUrl.value
  }
}

const onThumbLeave = () => {
  hovered.value = null
  if (selected.value === null) {
    mainImage.value = productImage.value
  }
}

const selectThumbnail = (n) => {
  selected.value = n
  mainImage.value = imgUrl.value
}

watch(product, (v) => {
  if (v) mainImage.value = productImage.value
})

onMounted(() => {
  if (product.value) mainImage.value = productImage.value
})

// 랜덤상품
const randomProducts = computed(() => {
  if (!store.state.product.items.length || !product.value) return []
  return store.state.product.items
    .filter((item) => item.id !== product.value.id && item.image)
    .sort(() => Math.random() - 0.5)
    .slice(0, 9)
})

const randomProductsWithSrc = computed(() =>
  randomProducts.value.map((item) => ({
    ...item,
    src: item.image
      ? new URL(`../assets/img/${item.category}/${item.image}`, import.meta.url).href
      : '',
  })),
)
</script>

<style scoped lang="scss">
@import '../assets/style/ProductDetail.scss';
</style>
