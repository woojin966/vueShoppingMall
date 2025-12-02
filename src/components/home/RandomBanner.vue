<template>
  <section class="random_banner">
    <p :class="filterClass">REIAS</p>
    <img :src="imgUrl" :class="filterClass" alt="random banner" />
  </section>
</template>

<script setup>
const props = defineProps({
  imgUrl: { type: String, required: true },
  filterClass: { type: String, required: true },
})
</script>

<style scoped lang="scss">
.random_banner {
  position: relative;
  width: 100%;
  margin-top: 20px;

  p {
    position: absolute;
    z-index: 2;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 48px;
    font-weight: 800;
    color: rgba(255, 255, 255, 0.7);
  }

  img {
    width: 100%;
    height: 360px;
    object-fit: cover;
    border-radius: 12px;
  }
}
</style>
