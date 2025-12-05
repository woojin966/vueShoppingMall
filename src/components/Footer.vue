<template>
  <article class="footer_wrap">
    <ul class="footer_menu_list">
      <li>
        <a href="javascript:void(0)" class="footer_link small bb">
          {{ $t('footer.terms') }}
        </a>
        <a href="javascript:void(0)" class="footer_link small bb">
          {{ $t('footer.privacy') }}
        </a>
      </li>
      <li>
        <a href="javascript:void(0)" class="footer_link medium bb">
          <font-awesome-icon icon="fa-brands fa-instagram" />
        </a>
        <a href="javascript:void(0)" class="footer_link medium bb">
          <font-awesome-icon icon="fa-brands fa-kakao-talk" />
        </a>
      </li>
    </ul>

    <div class="footer_box1">
      <p class="small bb">REIAS KOREA</p>
      <p class="small n">{{ $t('footer.companyInfo1') }}</p>
      <p class="small n">{{ $t('footer.companyInfo2') }}</p>
      <p class="small n">{{ $t('footer.companyInfo3') }}</p>
    </div>

    <div class="footer_box2">
      <p class="small n" v-html="$t('footer.csInfo')"></p>
    </div>

    <div class="footer_box2">
      <p class="small n">{{ $t('footer.copyright') }}</p>
    </div>
  </article>
</template>
<script setup></script>
<style scoped lang="scss">
@import '../assets/style/Footer.scss';
</style>
