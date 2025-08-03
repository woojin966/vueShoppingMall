<template>
  <article class="home_wrapper">
    <section class="preview_section">
      <HomeProductList
        v-if="showPreview && menuType !== 'community'"
        category="all"
        :menuType="menuType"
      />
      <div v-else-if="menuType === 'community'">
        <!-- community일 때 보여질 내용 -->
        커뮤니티 전용 콘텐츠입니다.
      </div>
      <div v-else>하하하</div>
    </section>

    <section class="header_section">
      <div>
        <h1>REIAS</h1>
      </div>
      <div>
        <img src="../assets/img/favicon/initial.svg" />
      </div>
      <div>ⓒ 2025 미식부터 라이프웨어까지</div>
    </section>

    <section class="navigation_section">
      <nav>
        <ul class="menu_list">
          <li v-for="(menu, i) in menus" :key="i">
            <a href="javascript:void(0)" class="menu_btn" @click="toggleMenu(i, menu.label)">
              {{ menu.label }}
            </a>
            <ul class="sub_menu_list" v-show="activeIndex === i">
              <li v-for="(sub, j) in menu.subs" :key="j">
                <router-link :to="sub.path">{{ sub.label }}</router-link>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </section>
  </article>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getAllProducts as getMenu1Products } from '@/api/productmenu1'
import { getAllProducts as getMenu2Products } from '@/api/productmenu2'
import HomeProductList from '@/components/HomeProductList.vue'

const menus = ref([])
const showPreview = ref(false)
const menuType = ref('') // 'kitchen' 또는 'uncommon'
const activeIndex = ref(null)

onMounted(async () => {
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

const toggleMenu = (index, label) => {
  activeIndex.value = activeIndex.value === index ? null : index

  // 상품 프리뷰 보여주기
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
    showPreview.value = true
  } else {
    //showPreview.value = false
  }
}
</script>

<style scoped lang="scss">
@import '../assets/style/Home.scss';
</style>
