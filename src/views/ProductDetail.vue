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
            :class="randomFilter"
            alt="unsplash image"
            @mouseover="mainImage = imgUrl"
            @mouseleave="mainImage = productImage"
          />
        </div>
      </div>
      <div class="product_title_price_box">
        <h2 class="product_name medium sb">{{ product.name }}</h2>
        <p class="product_price big b">{{ product.price.toLocaleString() }}원</p>
        <div class="product_quantity">
          <button @click="decreaseQty"><span></span></button>
          <input type="number" v-model.number="quantity" min="1" class="quantity_input medium sb" />
          <button @click="increaseQty"><span></span><span></span></button>
        </div>
      </div>
      <button class="add_cart_btn medium sb" @click="handleAddCart">장바구니 담기</button>
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
      <div class="describe_box"><p class="text n"></p></div>
      <div class="product_detaim_images_box">
        <img v-for="n in 5" :key="n" :src="imgUrl" :class="randomFilter" alt="unsplash image" />
      </div>
    </section>

    <!-- 리뷰 -->
    <section class="review_wrap">
      <h3 class="big b">상품 리뷰</h3>
      <button class="text n" @click="openModal('review')">리뷰 작성</button>

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
              <td colspan="2">
                <img v-if="review.image" :src="review.image" class="review_image" />
                <p class="review_content">{{ review.content }}</p>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
      <p v-else>등록된 리뷰가 없습니다.</p>
    </section>

    <!-- QNA -->
    <section class="qna_wrap">
      <h3 class="big b">Q&A</h3>
      <button class="text n" @click="openModal('qna')">상품 문의</button>

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
                <div v-if="qna.secret && !qna.showContent">
                  <input
                    type="password"
                    v-model="enteredPassword"
                    placeholder="비밀번호를 입력하세요"
                    class="text n"
                  />
                  <button class="text n" @click="checkPassword(qna)">확인</button>
                </div>

                <!-- 내용 -->
                <div v-else>
                  <img v-if="qna.image" :src="qna.image" class="qna_image" />
                  <p class="qna_content">{{ qna.content }}</p>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
      <p v-else>등록된 문의가 없습니다.</p>
    </section>
  </article>

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
import Modal from '@/components/Modal.vue'
import { addToCart } from '@/api/cart.js'
import { randomImages } from '../store/randomImages.js'

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

// 새로 추가: 메인 이미지 상태
const mainImage = ref('')

// product가 바뀌거나 로드될 때 초기화
watch(product, (newVal) => {
  if (newVal) mainImage.value = productImage.value
})

// onMounted 시 초기화 (만약 이미 product가 로드돼 있다면)
onMounted(() => {
  if (product.value) mainImage.value = productImage.value
})
</script>

<style scoped lang="scss">
.review_form {
  .form_group {
    margin-bottom: 12px;
    label {
      display: block;
      font-weight: 600;
      margin-bottom: 4px;
    }
  }
  .preview_image {
    max-width: 100%;
    margin-top: 8px;
  }
}
</style>
