<template>
  <article class="home_wrapper">
    <section class="preview_section custom_scroll">
      <HomeProductList
        v-if="showPreview && menuType !== 'community'"
        category="all"
        :menuType="menuType"
        class="preview_box"
      />
      <div v-else-if="menuType === 'community'" class="ready_wrap">
        <div>
          <font-awesome-icon icon="fa-solid fa-triangle-exclamation" />
          <h1 v-html="t('ready.title')"></h1>
        </div>
        <p class="big sb" v-html="t('ready.subtitle')"></p>
      </div>
      <div v-else class="home_initial">
        <HeroBanner :imgUrl="imgUrl" :filterClass="randomFilter" />
        <RecommendationList />
      </div>
    </section>

    <section class="header_section">
      <div>
        <h1 @click="goHomeInitial">REIAS</h1>
      </div>
      <div>
        <img class="logo" src="../assets/img/favicon/initial.svg" />
      </div>
      <div>
        <p class="small n">ⓒ 2025 {{ t('home.tagline') }}</p>
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
              {{ t(menu.label) }}
            </a>

            <!-- 트랜지션 래퍼 추가 -->
            <transition name="slide-toggle">
              <ul v-if="activeIndex === i" class="sub_menu_list">
                <li v-for="(sub, j) in menu.subs" :key="j">
                  <router-link :to="sub.path" class="menu2">{{ t(sub.label) }}</router-link>
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
import { randomImages } from '../store/randomImages.js'
import { getAllProducts as getMenu1Products } from '@/api/productmenu1'
import { getAllProducts as getMenu2Products } from '@/api/productmenu2'
import { useI18n } from 'vue-i18n'
import HomeProductList from '@/components/HomeProductList.vue'
import HeroBanner from '@/components/home/HeroBanner.vue'
import RecommendationList from '@/components/home/RecommendationList.vue'

const { imgUrl, randomFilter } = randomImages()
const { t } = useI18n()
const menus = ref([])
const showPreview = ref(false)
const menuType = ref('') // 'kitchen' 또는 'uncommon'
const activeIndex = ref(null)
const menuList = ref(null)

onMounted(async () => {
  const menu1 = await getMenu1Products()
  const menu2 = await getMenu2Products()

  const all = [...menu1, ...menu2]

  // 브랜드 추출 후 중복 제거
  const uniqueBrands = [...new Set(all.map((p) => p.brand).filter(Boolean))]

  const brandSubs = uniqueBrands.map((brand) => ({
    label: brand.toUpperCase(),
    path: `/brand/${brand.toLowerCase()}`,
  }))

  menus.value = [
    {
      id: 'kitchen',
      label: 'nav.kitchen',
      subs: [
        { label: 'nav.all', path: '/kitchen' },
        { label: 'nav.kitchen_summer', path: '/kitchen/summerdish' },
        { label: 'nav.kitchen_main', path: '/kitchen/maindish' },
        { label: 'nav.kitchen_side', path: '/kitchen/sidedish' },
        { label: 'nav.kitchen_dessert', path: '/kitchen/desert' },
        { label: 'nav.kitchen_food', path: '/kitchen/foodit' },
      ],
    },
    {
      id: 'uncommon',
      label: 'nav.uncommon',
      subs: [
        { label: 'nav.all', path: '/uncommon' },
        { label: 'nav.lifeItem', path: '/uncommon/life' },
        { label: 'nav.bag', path: '/uncommon/bag' },
        { label: 'nav.apparel', path: '/uncommon/apparel' },
        { label: 'nav.socks', path: '/uncommon/socks' },
        { label: 'nav.fashion', path: '/uncommon/fashion' },
        { label: 'nav.thai', path: '/uncommon/thai-it' },
      ],
    },
    {
      id: 'selection',
      label: 'nav.selection',
      subs: [
        { label: 'nav.new', path: '/selection/new' },
        { label: 'nav.best', path: '/selection/best' },
        { label: 'nav.sale', path: '/selection/sale' },
      ],
    },
    {
      id: 'brand',
      label: 'nav.brand',
      subs: [
        { label: 'nav.hamblepie', path: '/brand/hamblepie' },
        { label: 'nav.puco', path: '/brand/puco' },
        { label: 'nav.phutawan', path: '/brand/phutawan' },
        { label: 'nav.smell', path: '/brand/smell' },
        { label: 'nav.orumm', path: '/brand/orumm' },
        { label: 'nav.backstage', path: '/brand/backstage' },
      ],
    },
    {
      id: 'community',
      label: 'nav.community',
      subs: [
        { label: 'nav.notice', path: '/community/notice' },
        { label: 'nav.faq', path: '/community/faq' },
        { label: 'nav.qna', path: '/community/qna' },
        { label: 'nav.reviews', path: '/community/review' },
        { label: 'nav.playlist', path: '/community/playlist' },
      ],
    },
  ]
})

const toggleMenu = async (index, label, event) => {
  const list = menuList.value || document.querySelector('.menu_list')
  const btn = (event && event.currentTarget) || (list && list.querySelectorAll('.menu_btn')[index])
  const parentLi = btn.closest('li')
  const isSame = activeIndex.value === index
  const menu = menus.value[index]
  const id = menu.id

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

  // 4️⃣ 스크롤 위치 계산 및 이동
  const listRect = list.getBoundingClientRect()
  const liRect = parentLi.getBoundingClientRect()
  const leftPos = list.scrollLeft + (liRect.left - listRect.left)
  list.scrollTo({ left: leftPos, behavior: 'smooth' })

  // 5️⃣ 스크롤 완료 후 메뉴 열기
  await new Promise((resolve) => setTimeout(resolve, 100))
  if (!isSame) activeIndex.value = index

  // 6️⃣ 메뉴가 실제로 열리고 scrollWidth가 변한 뒤 재보정
  await new Promise((resolve) => setTimeout(resolve, 300)) // transition 끝날 시간
  const updatedListRect = list.getBoundingClientRect()
  const updatedLiRect = parentLi.getBoundingClientRect()
  const updatedLeftPos = list.scrollLeft + (updatedLiRect.left - updatedListRect.left)
  list.scrollTo({ left: updatedLeftPos, behavior: 'smooth' })

  // 7️⃣ 서브메뉴 transition 복원
  allSubMenus.forEach((sub) => {
    sub.style.transition = ''
    sub.style.width = ''
  })

  // 8️⃣ preview 표시
  if (id === 'kitchen') {
    menuType.value = 'kitchen'
    showPreview.value = true
  } else if (id === 'uncommon') {
    menuType.value = 'uncommon'
    showPreview.value = true
  } else if (id === 'selection') {
    menuType.value = 'selection'
    showPreview.value = true
  } else if (id === 'brand') {
    menuType.value = 'brand'
    showPreview.value = true
  } else if (id === 'community') {
    menuType.value = 'community'
    showPreview.value = false
  } else {
    showPreview.value = false
  }

  // 9️⃣ preview 스크롤 초기화
  const preview = document.querySelector('.preview_section')
  if (preview) preview.scrollTo({ top: 0, behavior: 'smooth' })
}

const goHomeInitial = () => {
  // 메뉴 상태 리셋
  activeIndex.value = null
  menuType.value = ''
  showPreview.value = false

  // 좌측 preview 스크롤 맨 위로 이동
  const preview = document.querySelector('.preview_section')
  if (preview) preview.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<style scoped lang="scss">
@import '../assets/style/Home.scss';
</style>
