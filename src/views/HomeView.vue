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
        <ul class="menu_list custom_scroll">
          <li v-for="(menu, i) in menus" :key="i">
            <a href="javascript:void(0)" class="menu_btn menu1" @click="toggleMenu(i, menu.label)">
              {{ menu.label }}
            </a>

            <!-- 트랜지션 래퍼 추가 -->
            <transition name="slide-toggle">
              <ul v-show="activeIndex === i" class="sub_menu_list">
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
import { ref, onMounted, getCurrentInstance } from 'vue'
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
