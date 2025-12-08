<template>
  <article class="ready_wrap">
    <div>
      <font-awesome-icon icon="fa-solid fa-triangle-exclamation" />
      <h1 v-html="t('ready.title')"></h1>
    </div>
    <p class="big sb" v-html="t('ready.subtitle')"></p>
  </article>
</template>
<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>
<style scoped lang="scss">
.ready_wrap {
  padding: 60px 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: $pointRed;
  flex-direction: column;
  height: 100dvh;
  background-color: $bg;
  .mo_blk {
    display: none;
  }
  div {
    margin-bottom: 40px;
    text-align: center;
    svg {
      width: 200px;
      height: 200px;
    }
    h1 {
      font-family: $bbh;
      font-size: 60px;
    }
  }
  @media all and (max-width: 1024px) {
    padding: 60px 20px;
    div {
      svg {
        width: 180px;
        height: 180px;
      }
      h1 {
        font-size: 52px;
      }
    }
  }
  @media all and (max-width: 768px) {
    .mo_blk {
      display: block;
    }
    div {
      margin-bottom: 28px;
      svg {
        width: 160px;
        height: 160px;
      }
    }
  }
  @media all and (max-width: 480px) {
    padding: 40px 16px;
    div {
      margin-bottom: 20px;
      svg {
        width: 140px;
        height: 140px;
      }
      h1 {
        font-size: 40px;
      }
    }
  }
}
</style>
