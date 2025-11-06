<template>
  <Header />

  <article v-if="product" class="product_detail_wrap">
    <!-- 상품 정보 -->
    <section class="product_info">
      <div class="thumbnail_box">
        <!-- 메인 상품 이미지 -->
        <img :src="mainImage" :alt="product.description" class="product_img" />

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
          <h2 class="product_name medium sb">{{ product.name }}</h2>
          <p class="product_price big bb">{{ Number(product.price).toLocaleString() }}원</p>
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
        <button class="add_cart_btn medium sb" @click="handleAddCart">장바구니 담기</button>
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
            >상세정보</a
          >
        </li>
        <li>
          <a
            href="javascript:void(0)"
            class="detailpage_tab_btn medium n"
            @click="scrollToSection('review_wrap')"
            >구매평</a
          >
        </li>
        <li>
          <a
            href="javascript:void(0)"
            class="detailpage_tab_btn medium n"
            @click="scrollToSection('qna_wrap')"
            >Q&A</a
          >
        </li>
      </ul>
    </section>

    <!-- 상세정보 -->
    <section class="productdetails_wrap">
      <div class="describe_box">
        <p class="text n">
          <span class="bb">상품 상세설명</span><br />Lorem ipsum dolor sit amet, consectetur
          adipiscing elit. Phasellus laoreet nisi sed ultricies ullamcorper. Etiam blandit
          condimentum nunc, nec egestas leo finibus id. Aenean in justo sed dui laoreet hendrerit
          cursus at neque. Ut nec risus vitae ex facilisis aliquam. Donec vitae vestibulum est, vel
          posuere lorem. Maecenas ut metus ipsum. Fusce dignissim lacinia imperdiet. Morbi nec
          ultrices sem, vitae varius lacus. Sed sit amet suscipit libero. Curabitur laoreet
          dignissim sapien eget ullamcorper. Praesent faucibus hendrerit pretium. Curabitur cursus,
          quam eu semper fermentum, dolor orci convallis tortor, quis consequat ipsum sem ut risus.
          Morbi luctus turpis non varius luctus.
        </p>
      </div>
      <div class="product_detaim_images_box">
        <img v-for="n in 3" :key="n" :src="imgUrl" :class="randomFilter" alt="unsplash image" />
      </div>
      <div class="product_detail_bottom_box">
        <p class="text n">
          <span class="bb">배송안내</span><br />
          <span class="sb">배송 지역 |</span> 대한민국 전지역 (즉석제조식품의 경우 하절기 도서산간지
          및 제주지역 배송불가)<br />
          <span class="sb">배송비 |</span> 3,000원 (50,000원 이상 결제시 무료배송)<br />
          <span class="sb">배송기간 |</span> 주말 공휴일 제외 2~5일<br />
          - 모든 배송은 택배사 사정으로 지연될 수 있습니다.
        </p>
        <p class="text n">
          <span class="bb">교환 및 반품 안내</span><br />
          - 고객 변심으로 인한 교환/반품은 상품 수령 후 7일 이내 가능합니다.<br />
          - 고객 귀책 사유로 인한 반품의 경우 왕복 택배비는 고객 부담입니다.<br />
          - 반품접수 기한이 지난 경우, 제품 및 패키지 훼손, 사용 흔적이 있는 제품은 교환/반품이
          불가합니다.
        </p>
      </div>
    </section>

    <!-- 리뷰 -->
    <section class="review_wrap">
      <div>
        <h3 class="big sb">상품 리뷰</h3>
        <button class="text n" @click="openModal('review')">리뷰 작성</button>
      </div>
      <table v-if="reviews.length" class="review_table">
        <thead>
          <tr>
            <th>제목</th>
            <th>작성자</th>
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
      <p v-else>등록된 리뷰가 없습니다.</p>
    </section>

    <!-- QNA -->
    <section class="qna_wrap">
      <div>
        <h3 class="big sb">Q&A</h3>
        <button class="text n" @click="openModal('qna')">상품 문의</button>
      </div>
      <table v-if="qnas.length" class="review_table">
        <thead>
          <tr>
            <th>제목</th>
            <th>작성자</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(qna, index) in qnas" :key="index">
            <tr @click="toggleDetail('qna', index)" class="qna_row">
              <td>
                {{ qna.secret ? '🔒 비공개 문의' : qna.title }}
              </td>
              <td>{{ qna.name }}</td>
            </tr>

            <tr v-if="activeQnaIndex === index" class="qna_detail_row">
              <td colspan="2">
                <!-- 비공개글 비밀번호 확인 -->
                <div v-if="qna.secret && !qna.showContent" class="password">
                  <input
                    type="password"
                    v-model="enteredPassword"
                    placeholder="비밀번호를 입력하세요"
                    class="text n"
                  />
                  <button class="text n" @click="checkPassword(qna)">확인</button>
                </div>

                <!-- 내용 -->
                <div class="content" v-else>
                  <img v-if="qna.image" :src="qna.image" class="qna_image" />
                  <p class="qna_content text n">{{ qna.content }}</p>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
      <p v-else>등록된 문의가 없습니다.</p>
    </section>
    <!-- 랜덤 상품 스와이퍼 -->
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
            <img :src="item.src" :alt="item.name" />
            <p class="slide_name text n">{{ item.name }}</p>
            <!-- <p class="slide_price">{{ item.price.toLocaleString() }}원</p> -->
          </router-link>
        </SwiperSlide>
      </Swiper>
    </div>
  </article>

  <Footer />

  <!-- 장바구니 확인 모달 -->
  <Modal
    :visible="showCartModal"
    message="장바구니로 이동하시겠습니까?"
    @confirm="goToCart"
    @cancel="cancelCart"
  />

  <!-- 리뷰/QNA 작성 모달 -->
  <Modal
    :visible="showWriteModal"
    :confirmText="'등록'"
    :cancelText="'취소'"
    @confirm="submitForm"
    @cancel="cancelForm"
  >
    <template #default>
      <div class="review_form">
        <!-- 작성자 -->
        <div class="form_group">
          <label>작성자</label>
          <div v-if="isLoggedIn">
            <p class="user_id">{{ userId }}</p>
          </div>
          <div v-else>
            <input
              v-model="formData.name"
              type="text"
              placeholder="작성자"
              class="text n"
              required
            />
          </div>
        </div>

        <!-- 제목 -->
        <div class="form_group">
          <label>제목</label>
          <input
            v-model="formData.title"
            type="text"
            placeholder="제목을 입력하세요"
            class="text n"
            required
          />
        </div>

        <!-- 비공개 여부(QNA 전용) -->
        <div v-if="modalType === 'qna'" class="form_group">
          <label><input type="checkbox" v-model="formData.secret" /> 비공개</label>
          <input
            v-if="formData.secret"
            v-model="formData.password"
            type="password"
            placeholder="비밀번호 설정"
            class="text n"
            required
          />
        </div>

        <!-- 사진 업로드 -->
        <div class="form_group">
          <label>사진 (선택)</label>
          <input type="file" @change="onImageChange" accept="image/*" />
          <img v-if="formData.image" :src="formData.image" class="preview_image" />
        </div>

        <!-- 내용 -->
        <div class="form_group">
          <label>내용</label>
          <textarea
            v-model="formData.content"
            placeholder="내용을 입력하세요"
            class="text n"
            required
          ></textarea>
        </div>
      </div>
    </template>
  </Modal>

  <!-- 경고 모달 (alert 대체용) -->
  <Modal
    :visible="showAlertModal"
    :message="alertMessage"
    @confirm="showAlertModal = false"
    :confirmText="'확인'"
    :cancelText="''"
  />
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import Modal from '@/components/Modal.vue'
import { addToCart } from '@/api/cart.js'
import { randomImages } from '../store/randomImages.js'
// Swiper
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/navigation'
import { Navigation, Autoplay } from 'swiper/modules'

// 이미지 랜덤 필터
const { imgUrl, randomFilter } = randomImages()
const route = useRoute()
const router = useRouter()
const store = useStore()

const product = ref(null)
const selectedOption = ref('')
const quantity = ref(1)
const increaseQty = () => quantity.value++
const decreaseQty = () => quantity.value > 1 && quantity.value--

// 장바구니 모달
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

// 초기 로딩
onMounted(() => {
  loadProduct(route.params.id)
})

// route.params.id가 바뀌면 product 다시 로딩
watch(
  () => route.params.id,
  (newId) => {
    loadProduct(newId)
    window.scrollTo({ top: 0, behavior: 'smooth' }) // ✅ 페이지 맨 위로 이동
  },
)

// 공통 alert 모달
const showAlertModal = ref(false)
const alertMessage = ref('')

// 리뷰/QNA 공통 데이터
const showWriteModal = ref(false)
const modalType = ref('review') // 'review' or 'qna'
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

// 열기
const openModal = (type) => {
  modalType.value = type
  showWriteModal.value = true
}

// 닫기
const cancelForm = () => {
  showWriteModal.value = false
  resetForm()
}

// 초기화
const resetForm = () => {
  formData.value = { name: '', title: '', content: '', image: '', secret: false, password: '' }
}

// 이미지 등록
const onImageChange = (e) => {
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => (formData.value.image = reader.result)
  reader.readAsDataURL(file)
}

// 제출
const submitForm = () => {
  if (!isLoggedIn.value && !formData.value.name) {
    alertMessage.value = '작성자명을 입력하세요.'
    showAlertModal.value = true
    return
  }
  if (!formData.value.title || !formData.value.content) {
    alertMessage.value = '제목과 내용을 입력하세요.'
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

// 상세 토글
const toggleDetail = (type, index) => {
  if (type === 'review') {
    activeReviewIndex.value = activeReviewIndex.value === index ? null : index
  } else {
    activeQnaIndex.value = activeQnaIndex.value === index ? null : index
    enteredPassword.value = ''
  }
}

// QNA 비밀번호 확인
const checkPassword = (qna) => {
  if (enteredPassword.value === qna.password) {
    qna.showContent = true
  } else {
    alertMessage.value = '비밀번호가 틀렸습니다.'
    showAlertModal.value = true
  }
}

// 상품 로드
const loadProduct = async (id) => {
  if (!store.state.product.items.length) await store.dispatch('product/fetchProducts')
  product.value = store.state.product.items.find((item) => item.id == id) || null
}

onMounted(() => loadProduct(route.params.id))
watch(
  () => route.params.id,
  (id) => loadProduct(id),
)

// 탭메뉴 섹션이동
const scrollToSection = (className) => {
  const section = document.querySelector(`.${className}`)
  if (section) {
    section.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

// 상품 이미지
// 기존 productImage 그대로
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
    mainImage.value = imgUrl.value // ✅ .value 붙이기!
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
  mainImage.value = imgUrl.value // ✅ .value 붙이기!
}

// product가 바뀌거나 로드될 때 초기화
watch(product, (newVal) => {
  if (newVal) mainImage.value = productImage.value
})

// onMounted 시 초기화 (만약 이미 product가 로드돼 있다면)
onMounted(() => {
  if (product.value) mainImage.value = productImage.value
})

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

<style scoped lang="scss">
@import '../assets/style/ProductDetail.scss';
</style>
