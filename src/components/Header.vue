<template>
  <header>
    <!-- PC 헤더 -->
    <article class="pc_header" v-if="isPc">
      <a href="javascript:void(0)" class="logo">
        <img src="@/assets/img/favicon/reias_logo.png" alt="logo" />
      </a>
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
            @mouseenter="hoverIndex = i"
            @mouseleave="hoverIndex = null"
          >
            <router-link class="menu_btn menu1" :to="menu.path">{{ menu.label }}</router-link>
          </li>
        </ul>

        <!-- PC 서브메뉴 -->
        <ul v-if="hoverIndex !== null || isPcMenuVisible" class="sub_menu_list pc">
          <template v-for="(menu, i) in menus" :key="i">
            <li v-for="(sub, j) in menu.subs" :key="`${i}-${j}`">
              <router-link :to="sub.path" class="menu2">{{ sub.label }}</router-link>
            </li>
          </template>
        </ul>

        <ul class="etc_menu_list">
          <li><a href="javascript:void(0)">LOGIN</a></li>
          <li><a href="javascript:void(0)">JOIN</a></li>
          <li>
            <a href="javascript:void(0)"><font-awesome-icon icon="fa-solid fa-cart-shopping" /></a>
          </li>
          <li>
            <a href="javascript:void(0)"
              ><font-awesome-icon icon="fa-solid fa-magnifying-glass"
            /></a>
          </li>
        </ul>
      </div>
    </article>

    <!-- 모바일 헤더 -->
    <article class="mo_header" v-else>
      <a href="javascript:void(0)" class="logo">
        <img src="@/assets/img/favicon/reias_logo.png" />
      </a>
      <section>
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

        <div class="nav_wrapper mo" v-show="isMoMenuVisible">
          <ul class="etc_menu_list">
            <li><a href="javascript:void(0)">LOGIN</a></li>
            <li><a href="javascript:void(0)">JOIN</a></li>
            <li>
              <a href="javascript:void(0)"
                ><font-awesome-icon icon="fa-solid fa-cart-shopping"
              /></a>
            </li>
            <li>
              <a href="javascript:void(0)"
                ><font-awesome-icon icon="fa-solid fa-magnifying-glass"
              /></a>
            </li>
          </ul>

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
      </section>
    </article>
  </header>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const isPc = ref(window.innerWidth >= 1024)
const isMenuOpen = ref(false)
const isPcMenuVisible = ref(false)
const isMoMenuVisible = ref(false)
const hoverIndex = ref(null) // PC 대메뉴 호버용
const activeIndex = ref(null) // 모바일 서브메뉴 토글용

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
onMounted(() => window.addEventListener('resize', handleResize))
onBeforeUnmount(() => window.removeEventListener('resize', handleResize))
</script>

<style scoped lang="scss">
.nav_wrapper {
  position: relative;
}
.menu_list {
  display: flex;
  gap: 30px;
  li {
    position: relative;
  }
}
.sub_menu_list {
  position: absolute;
  top: 100%;
  left: 0;
  background: #fff;
  border-top: 1px solid #eee;
  display: flex;
  gap: 20px;
  padding: 10px 20px;
  z-index: 10;
}
.menu_spread_btn {
  width: 40px;
  height: 40px;
  background-color: tomato;
  cursor: pointer;
}
.slide-toggle-enter-active,
.slide-toggle-leave-active {
  transition: max-height 0.3s ease;
}
.slide-toggle-enter-from,
.slide-toggle-leave-to {
  max-height: 0;
  overflow: hidden;
}
.slide-toggle-enter-to,
.slide-toggle-leave-from {
  max-height: 500px;
  overflow: hidden;
}
.arrow {
  margin-left: 5px;
  display: inline-block;
  transition: transform 0.3s;
}
.arrow.open {
  transform: rotate(180deg);
}
</style>
