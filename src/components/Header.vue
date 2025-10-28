<template>
  <header :class="{ fixed: isFixed }">
    <!-- PC 헤더 -->
    <article class="pc_header" v-if="isPc">
      <router-link to="/" class="logo">
        <img src="@/assets/img/favicon/reias_logo.png" alt="logo" />
      </router-link>
      <ul class="etc_menu_list">
        <li><a href="javascript:void(0)" class="text n">LOGIN</a></li>
        <li><a href="javascript:void(0)" class="text n">JOIN</a></li>
        <li>
          <router-link to="/cart" class="cart_icon">
            <font-awesome-icon icon="fa-solid fa-cart-shopping" />
            <span v-if="cartCount" class="cart_count">{{ cartCount }}</span>
          </router-link>
        </li>
        <li>
          <a href="javascript:void(0)"
            ><font-awesome-icon icon="fa-solid fa-magnifying-glass" class="text n"
          /></a>
        </li>
      </ul>
      <div class="nav_wrapper">
        <a
          href="javascript:void(0)"
          class="menu_spread_btn"
          :class="{ active: isMenuOpen }"
          @click="toggleMenu"
        >
          <span></span>
          <span></span>
          <span></span>
        </a>

        <ul class="menu_list">
          <li
            v-for="(menu, i) in menus"
            :key="i"
            @mouseenter="onMenuMouseEnter(i)"
            @mouseleave="onMenuMouseLeave"
          >
            <router-link class="menu_btn menu" :to="menu.path">{{ menu.label }}</router-link>
          </li>
        </ul>

        <!-- PC 서브메뉴 -->
        <transition name="submenu-fade">
          <div
            v-if="hoverIndex !== null || isPcMenuVisible"
            class="sub_group pc"
            v-show="isPcMenuVisible || hoverIndex !== null"
            @mouseenter="onSubMouseEnter"
            @mouseleave="onSubMouseLeave"
          >
            <!-- 모든 대메뉴의 서브메뉴 ul이 항상 함께 노출됨 -->
            <ul div v-for="(menu, i) in menus" :key="i" class="sub_menu_list">
              <li>
                <p class="text sb label">{{ menu.label }}</p>
              </li>
              <li v-for="(sub, j) in menu.subs" :key="`${i}-${j}`">
                <router-link :to="sub.path" class="sub_menu text n">
                  {{ sub.label }}
                </router-link>
              </li>
            </ul>
          </div>
        </transition>
      </div>
    </article>

    <!-- 모바일 헤더 -->
    <article class="mo_header" v-else>
      <a
        href="javascript:void(0)"
        class="menu_spread_btn"
        :class="{ active: isMenuOpen }"
        @click="toggleMenu"
      >
        <span></span>
        <span></span>
        <span></span>
      </a>
      <a href="javascript:void(0)" class="logo">
        <img src="@/assets/img/favicon/reias_logo.png" />
      </a>
      <div class="menu_box">
        <router-link to="/cart" class="cart_icon">
          <font-awesome-icon icon="fa-solid fa-cart-shopping" />
          <span v-if="cartCount" class="cart_count">{{ cartCount }}</span>
        </router-link>
        <a href="javascript:void(0)"><font-awesome-icon icon="fa-solid fa-magnifying-glass" /></a>
      </div>
      <div class="nav_wrapper mo" v-show="isMoMenuVisible">
        <div class="menulist_top_box">
          <a href="javascript:void(0)" class="login_btn">LOGIN</a>
          <a href="javascript:void(0)" class="close_btn" @click="toggleMenu">
            <span></span>
            <span></span>
          </a>
        </div>
        <ul class="menu_list" ref="menuList">
          <li v-for="(menu, i) in menus" :key="i">
            <button class="menu_btn menu1" @click="toggleSubMenu(i)">
              {{ menu.label }}
              <span class="arrow" :class="{ open: activeIndex === i }">▼</span>
            </button>
            <transition name="slide-toggle">
              <ul v-if="activeIndex === i" class="sub_menu_list mo">
                <li v-for="(sub, j) in menu.subs" :key="j">
                  <router-link :to="sub.path" class="menu2">{{ sub.label }}</router-link>
                </li>
              </ul>
            </transition>
          </li>
        </ul>
      </div>
    </article>
  </header>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { getCart } from '@/api/cart.js'

const cartCount = ref(0)

const updateCartCount = () => {
  cartCount.value = getCart().reduce((sum, item) => sum + item.quantity, 0)
}

// ✅ 새로고침 시 개수 유지
onMounted(() => updateCartCount())

// ✅ Storage가 바뀔 때마다 업데이트
window.addEventListener('storage', (e) => {
  if (e.key === 'cartItems') updateCartCount()
})

const isPc = ref(window.innerWidth > 1024)
const isMenuOpen = ref(false)
const isPcMenuVisible = ref(false)
const isMoMenuVisible = ref(false)
const hoverIndex = ref(null) // PC 대메뉴 호버용
const activeIndex = ref(null) // 모바일 서브메뉴 토글용
const subHovered = ref(false)
let hoverClearTimer = null
const isFixed = ref(false)

const menus = ref([
  {
    label: 'KITCHEN',
    path: '/kitchen',
    subs: [
      { label: '여름의 맛', path: '/kitchen/summerdish' },
      { label: '메인디시', path: '/kitchen/maindish' },
      { label: '사이드디시', path: '/kitchen/sidedish' },
      { label: '디저트', path: '/kitchen/desert' },
      { label: '푸드아이템', path: '/kitchen/foodit' },
    ],
  },
  {
    label: 'UNCOMMON',
    path: '/uncommon',
    subs: [
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
    path: '/selection/new',
    subs: [
      { label: 'NEW', path: '/selection/new' },
      { label: 'BEST', path: '/selection/best' },
      { label: 'SALE', path: '/selection/sale' },
    ],
  },
  {
    label: 'BRAND',
    path: '/brand/hamblepie',
    subs: [
      { label: 'HAMBLEPIE', path: '/brand/hamblepie' },
      { label: 'PUCO', path: '/brand/puco' },
      { label: 'PHUTAWAN', path: '/brand/phutawan' },
      { label: 'SMELL LEMONGRASS', path: '/brand/smell' },
      { label: 'ORUMM', path: '/brand/orumm' },
      { label: 'BACKSTAGE', path: '/brand/backstage' },
    ],
  },
  {
    label: 'COMMUNITY',
    path: '/community/notice',
    subs: [
      { label: 'NOTICE', path: '/community/notice' },
      { label: 'FAQ', path: '/community/faq' },
      { label: 'QNA', path: '/community/qna' },
      { label: 'REVIEWS', path: '/community/review' },
      { label: 'PLAYLIST', path: '/community/playlist' },
    ],
  },
])

// 스프레드 버튼 클릭
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
  if (isPc.value) {
    isPcMenuVisible.value = isMenuOpen.value
  } else {
    isMoMenuVisible.value = isMenuOpen.value
    if (!isMoMenuVisible.value) activeIndex.value = null
  }
}

// 대메뉴 mouseenter
const onMenuMouseEnter = (i) => {
  if (hoverClearTimer) {
    clearTimeout(hoverClearTimer)
    hoverClearTimer = null
  }
  hoverIndex.value = i
}

// 대메뉴 mouseleave: 짧은 딜레이 후 hoverIndex 제거 (서브가 호버이면 제거하지 않음)
const onMenuMouseLeave = () => {
  if (hoverClearTimer) clearTimeout(hoverClearTimer)
  hoverClearTimer = setTimeout(() => {
    // 만약 서브영역으로 들어간 상태라면 아무것도 하지 않음
    if (!subHovered.value) hoverIndex.value = null
    hoverClearTimer = null
  }, 120) // 80~150ms 정도가 자연스럽습니다
}

// 서브메뉴에 마우스 들어오면 subHovered true (접힘 방지)
const onSubMouseEnter = () => {
  subHovered.value = true
  if (hoverClearTimer) {
    clearTimeout(hoverClearTimer)
    hoverClearTimer = null
  }
}

// 서브메뉴에서 나가면 subHovered false 이고 즉시 접히게 hoverIndex null
const onSubMouseLeave = () => {
  subHovered.value = false
  hoverIndex.value = null
}

// 모바일 서브메뉴 토글
const toggleSubMenu = (index) => {
  activeIndex.value = activeIndex.value === index ? null : index
}

// 리사이즈 이벤트
const handleResize = () => {
  isPc.value = window.innerWidth >= 1024
  isMenuOpen.value = false
  isPcMenuVisible.value = false
  isMoMenuVisible.value = false
  hoverIndex.value = null
  activeIndex.value = null
}
// 스크롤 핸들러
const handleScroll = () => {
  isFixed.value = window.scrollY > 50 // 50px 이상 스크롤 시 고정
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
  window.addEventListener('scroll', handleScroll)
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped lang="scss">
@import '../assets/style/Header.scss';
</style>
