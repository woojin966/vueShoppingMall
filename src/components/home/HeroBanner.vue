<template>
  <section class="hero_banner">
    <div class="hero_bg">
      <img :src="imgUrl" :class="filterClass" alt="banner bg" />
    </div>
    <div class="hero_content">
      <h1 class="hero_title">REIAS MARKET 2025</h1>
      <p class="hero_subtitle big b">Taste · Lifestyle · Selection</p>
      <button class="hero_btn medium sb" @click="goToShop">Shop Now</button>
    </div>
  </section>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

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
