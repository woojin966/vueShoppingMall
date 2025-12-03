<template>
  <Header />
  <div class="login_wrap">
    <h1>LOGIN</h1>
    <form @submit.prevent="handleLogin">
      <input v-model="email" class="text n" placeholder="Email" />
      <input v-model="password" class="text n" placeholder="Password" type="password" />
      <label class="remember_label">
        <input type="checkbox" v-model="rememberMe" :class="{ checked: rememberMe }" />
        로그인 유지
      </label>
      <button type="submit" class="medium sb">Login</button>
    </form>
    <div>
      <a href="javascript:void(0)" class="mini n">회원가입</a>
      <a href="javascript:void(0)" class="mini n">아이디/비밀번호 찾기</a>
    </div>
  </div>
  <Footer />

  <Modal
    :visible="loginerr"
    message="아이디와 비밀번호 정보가 다릅니다."
    @confirm="loginerr = false"
    :confirmText="'확인'"
    :cancelText="''"
  />
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import Modal from '@/components/Modal.vue'

const { login } = useAuth()
const router = useRouter()

// 기본값을 여기에서 지정해야 함
const email = ref('test@reias.com')
const password = ref('1234')

const loginerr = ref(false)
const rememberMe = ref(false)

const handleLogin = () => {
  const success = login(email.value, password.value)

  if (success) {
    if (!rememberMe.value) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
    router.push('/mypage')
  } else {
    loginerr.value = true
  }
}
</script>

<style scoped lang="scss">
@import '../assets/style/LoginView.scss';
</style>
