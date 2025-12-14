<template>
  <section class="hero_banner">
    <div class="hero_bg">
      <img :src="imgUrl" :class="filterClass" alt="banner bg" />
    </div>
    <div class="hero_content">
      <h1 class="hero_title">REIAS MARKET 2025</h1>
      <p class="hero_subtitle big b">Taste · Lifestyle · Selection</p>
      <div>
        <button class="hero_btn medium sb" @click="goToShop">Shop Now</button>
        <a href="javascript:void(0)" class="medium sb lang_btn" @click="toggleLang">
          {{ locale === 'ko' ? 'KO' : 'EN' }}
        </a>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const { locale } = useI18n()
const toggleLang = () => {
  const next = locale.value === 'ko' ? 'en' : 'ko'
  locale.value = next
  localStorage.setItem('locale', next)
}

const props = defineProps({
  imgUrl: { type: String, required: true },
  filterClass: { type: String, required: true },
})

const goToShop = () => {
  router.push('/kitchen')
}
</script>

<style scoped lang="scss">
@import '../../assets/style/HeroBanner.scss';
</style>
