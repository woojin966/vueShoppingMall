<template>
  <Header />
  <div class="login_wrap">
    <h1>LOGIN</h1>
    <form @submit.prevent="handleLogin">
      <input v-model="email" class="text n" placeholder="ID(email)" />
      <input v-model="password" class="text n" placeholder="Password" type="password" />
      <label class="remember_label">
        <input type="checkbox" v-model="rememberMe" :class="{ checked: rememberMe }" />
        {{ t('login.remember') }}
      </label>
      <button type="submit" class="medium sb">{{ t('login.login') }}</button>
    </form>
    <div>
      <a href="javascript:void(0)" class="mini n">{{ t('login.join') }}</a>
      <a href="javascript:void(0)" class="mini n">{{ t('login.find_id_pw') }}</a>
    </div>
  </div>
  <Footer />

  <Modal
    :visible="loginerr"
    :message="t('login.error')"
    @confirm="loginerr = false"
    :confirmText="t('common.confirm')"
    :cancelText="''"
  />
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useI18n } from 'vue-i18n'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import Modal from '@/components/Modal.vue'

const { login } = useAuth()
const router = useRouter()
const { t } = useI18n()

// 기본값을 여기에서 지정해야 함
const email = ref('test@reias.com')
const password = ref('1234')

const loginerr = ref(false)
const rememberMe = ref(false)

const handleLogin = () => {
  const success = login(email.value, password.value)

  if (success) {
    // 리다이렉트 경로가 있으면 그쪽으로, 없으면 기본 마이페이지로
    const redirect = router.currentRoute.value.query.redirect || '/mypage'
    router.push(redirect)
  } else {
    loginerr.value = true
  }
}
</script>

<style scoped lang="scss">
@import '../assets/style/LoginView.scss';
</style>
