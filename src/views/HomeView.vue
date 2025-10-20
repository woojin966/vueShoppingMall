<template>
  <article class="home_wrapper">
    <section class="preview_section custom_scroll">
      <HomeProductList
        v-if="showPreview && menuType !== 'community'"
        category="all"
        :menuType="menuType"
        class="preview_box"
      />
      <div v-else-if="menuType === 'community'">
        <!-- community일 때 보여질 내용 -->
        커뮤니티 전용 콘텐츠입니다.
      </div>
      <div class="home_img_box" v-else>
        <p :class="randomFilter">REIAS</p>
        <img :src="imgUrl" :class="randomFilter" alt="unsplash image" />
      </div>
    </section>

    <section class="header_section">
      <div>
        <h1>REIAS</h1>
      </div>
      <div>
        <img class="logo" src="../assets/img/favicon/initial.svg" />
      </div>
      <div>
        <p class="small n">ⓒ 2025 미식부터 라이프웨어까지</p>
      </div>
    </section>

    <section class="navigation_section">
      <nav>
        <ul class="menu_list custom_scroll" ref="menuList">
          <li v-for="(menu, i) in menus" :key="i">
            <a
              href="javascript:void(0)"
              class="menu_btn menu1"
              @click="toggleMenu(i, menu.label, $event)"
            >
              {{ menu.label }}
            </a>

            <!-- 트랜지션 래퍼 추가 -->
            <transition name="slide-toggle">
              <ul v-if="activeIndex === i" class="sub_menu_list">
                <li v-for="(sub, j) in menu.subs" :key="j">
                  <router-link :to="sub.path" class="menu2">{{ sub.label }}</router-link>
                </li>
              </ul>
            </transition>
          </li>
        </ul>
      </nav>
    </section>
  </article>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance, nextTick } from 'vue'
import { getAllProducts as getMenu1Products } from '@/api/productmenu1'
import { getAllProducts as getMenu2Products } from '@/api/productmenu2'
import HomeProductList from '@/components/HomeProductList.vue'

const { proxy } = getCurrentInstance()
const imgUrl = ref('')
const filters = [
  'filter-clarendon',
  'filter-gingham',
  'filter-juno',
  'filter-lark',
  'filter-reyes',
  'filter-valencia',
  'filter-willow',
]
const randomFilter = ref('')
onMounted(() => {
  const randomIndex = Math.floor(Math.random() * filters.length)
  randomFilter.value = filters[randomIndex]
})

const menus = ref([])
const showPreview = ref(false)
const menuType = ref('') // 'kitchen' 또는 'uncommon'
const activeIndex = ref(null)
const menuList = ref(null)

onMounted(async () => {
  const res = await proxy.$unsplash.get('/photos/random', {
    params: { query: 'nature' },
  })
  imgUrl.value = res.data.urls.regular

  const menu1 = await getMenu1Products()
  const menu2 = await getMenu2Products()

  const all = [...menu1, ...menu2]

  // 브랜드 추출 후 중복 제거
  const uniqueBrands = [
    ...new Set(
      all.map((p) => p.brand).filter(Boolean), // null/undefined 제거
    ),
  ]

  const brandSubs = uniqueBrands.map((brand) => ({
    label: brand.toUpperCase(),
    path: `/brand/${brand.toLowerCase()}`,
  }))

  menus.value = [
    {
      label: 'KITCHEN',
      subs: [
        { label: '전체', path: '/kitchen' },
        { label: '여름의 맛', path: '/kitchen/summerdish' },
        { label: '메인디시', path: '/kitchen/maindish' },
        { label: '사이드디시', path: '/kitchen/sidedish' },
        { label: '디저트', path: '/kitchen/desert' },
        { label: '푸드아이템', path: '/kitchen/foodit' },
      ],
    },
    {
      label: 'UNCOMMON',
      subs: [
        { label: '전체', path: '/uncommon' },
        { label: '라이프아이템', path: '/uncommon/life' },
        { label: '가방', path: '/uncommon/bag' },
        { label: '의류', path: '/uncommon/apparel' },
        { label: '양말', path: '/uncommon/socks' },
        { label: '패션', path: '/uncommon/fashion' },
        { label: '타이잇', path: '/uncommon/thai-it' },
      ],
    },
    {
      label: 'SELECTION',
      subs: [
        { label: 'NEW', path: '/selection/new' },
        { label: 'BEST', path: '/selection/best' },
        { label: 'SALE', path: '/selection/sale' },
      ],
    },
    {
      label: 'BRAND',
      // subs: [
      //   { label: 'HAMBLEPIE', path: '/brand/hamblepie' },
      //   { label: 'PUCO', path: '/brand/puco' },
      //   { label: 'PHUTAWAN', path: '/brand/phutawan' },
      //   { label: 'SMELL LEMONGRASS', path: '/brand/smell' },
      //   { label: 'ORUMM', path: '/brand/orumm' },
      //   { label: 'BACKSTAGE', path: '/brand/backstage' },
      // ],
      subs: brandSubs,
    },
    {
      label: 'COMMUNITY',
      subs: [
        { label: 'NOTICE', path: '/community/notice' },
        { label: 'FAQ', path: '/community/faq' },
        { label: 'QNA', path: '/community/qna' },
        { label: 'REVIEWS', path: '/community/review' },
        { label: 'PLAYLIST', path: '/community/playlist' },
      ],
    },
  ]
})

// async로 선언해서 await 사용 가능하게 함
const toggleMenu = async (index, label, event) => {
  const list = menuList.value || document.querySelector('.menu_list')
  const btn = (event && event.currentTarget) || (list && list.querySelectorAll('.menu_btn')[index])
  const parentLi = btn.closest('li')
  const isSame = activeIndex.value === index

  // 1️⃣ 모든 서브메뉴 width 고정 (transition 중 scrollWidth 변화 방지)
  const allSubMenus = list.querySelectorAll('.sub_menu_list')
  allSubMenus.forEach((sub) => {
    sub.style.transition = 'none'
    sub.style.width = `${sub.offsetWidth}px`
  })

  // 2️⃣ 기존 메뉴 닫기
  activeIndex.value = null

  // 3️⃣ 기존 transition 끝날 때까지 기다림
  await new Promise((resolve) => setTimeout(resolve, 100))

  // 4️⃣ 새로운 메뉴 스크롤 고정 (이 시점엔 scrollWidth가 변하지 않음)
  const listRect = list.getBoundingClientRect()
  const liRect = parentLi.getBoundingClientRect()
  const leftPos = list.scrollLeft + (liRect.left - listRect.left)
  list.scrollTo({ left: leftPos, behavior: 'smooth' })

  // 5️⃣ 스크롤 완료 후 메뉴 열기
  await new Promise((resolve) => setTimeout(resolve, 100))
  // 스크롤이 안정된 뒤 열기
  if (!isSame) activeIndex.value = index

  // 6️⃣ 서브메뉴 원래 transition 복원
  allSubMenus.forEach((sub) => {
    sub.style.transition = ''
    sub.style.width = ''
  })

  // 5️⃣ preview 표시
  if (label === 'KITCHEN') {
    menuType.value = 'kitchen'
    showPreview.value = true
  } else if (label === 'UNCOMMON') {
    menuType.value = 'uncommon'
    showPreview.value = true
  } else if (label === 'SELECTION') {
    menuType.value = 'selection'
    showPreview.value = true
  } else if (label === 'BRAND') {
    menuType.value = 'brand'
    showPreview.value = true
  } else if (label === 'COMMUNITY') {
    menuType.value = 'community'
    showPreview.value = false
  } else {
    showPreview.value = false
  }

  // 6️⃣ preview 섹션 스크롤 맨 위로
  const preview = document.querySelector('.preview_section')
  if (preview) preview.scrollTo({ top: 0, behavior: 'smooth' })
}
// const toggleMenu = async (index, label, event) => {
//   const list = menuList.value || document.querySelector('.menu_list')
//   const btn = (event && event.currentTarget) || (list && list.querySelectorAll('.menu_btn')[index])
//   const parentLi = btn.closest('li')
//   const isSame = activeIndex.value === index

//   // 1️⃣ 기존 메뉴 닫기
//   activeIndex.value = null

//   // 2️⃣ transition 끝날 때까지 잠깐 대기
//   await new Promise((resolve) => setTimeout(resolve, 300))

//   // 3️⃣ 새로운 메뉴 열기 (같은 버튼이면 토글)
//   if (!isSame) activeIndex.value = index

//   // 4️⃣ nextTick으로 DOM 업데이트 대기 (서브메뉴 펼쳐짐)
//   await nextTick()

//   // 5️⃣ 스크롤 위치 계산
//   const listRect = list.getBoundingClientRect()
//   const liRect = parentLi.getBoundingClientRect()

//   // 가로 스크롤: 768~1024px
//   if (window.innerWidth >= 360 && window.innerWidth <= 1024) {
//     let leftPos = list.scrollLeft + (liRect.left - listRect.left)

//     // 마지막 메뉴일 경우 list.scrollWidth 넘지 않도록 제한
//     leftPos = Math.min(leftPos, list.scrollWidth - list.clientWidth)
//     list.scrollTo({ left: leftPos, behavior: 'smooth' })
//   } else if (window.innerWidth > 1024) {
//     // PC 기준: 클릭된 메뉴가 화면 중앙에 오도록
//     const centerPos =
//       list.scrollLeft + (liRect.left - listRect.left) - listRect.width / 2 + liRect.width / 2
//     list.scrollTo({ left: centerPos, behavior: 'smooth' })
//   } else {
//     // 세로 스크롤 (모바일 등)
//     // const topPos = list.scrollTop + (liRect.top - listRect.top)
//     // list.scrollTo({ top: topPos, behavior: 'smooth' })
//   }

//   // 5️⃣ preview 표시
//   if (label === 'KITCHEN') {
//     menuType.value = 'kitchen'
//     showPreview.value = true
//   } else if (label === 'UNCOMMON') {
//     menuType.value = 'uncommon'
//     showPreview.value = true
//   } else if (label === 'SELECTION') {
//     menuType.value = 'selection'
//     showPreview.value = true
//   } else if (label === 'BRAND') {
//     menuType.value = 'brand'
//     showPreview.value = true
//   } else if (label === 'COMMUNITY') {
//     menuType.value = 'community'
//     showPreview.value = false
//   } else {
//     showPreview.value = false
//   }

//   // 6️⃣ preview 섹션 스크롤 맨 위로
//   const preview = document.querySelector('.preview_section')
//   if (preview) preview.scrollTo({ top: 0, behavior: 'smooth' })
// }
</script>

<style scoped lang="scss">
@import '../assets/style/Home.scss';
</style>
