import { ref } from 'vue'

const user = ref(null)
const token = ref(null)

export function useAuth() {
  const login = (email, password) => {
    if (email === 'test@reias.com' && password === '1234') {
      token.value = 'fake-token-123'
      user.value = { email }

      localStorage.setItem('token', token.value)
      localStorage.setItem('user', JSON.stringify(user.value))
      return true
    }
    return false
  }

  const logout = () => {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  const loadAuth = () => {
    const savedToken = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')

    if (savedToken) token.value = savedToken
    if (savedUser) user.value = JSON.parse(savedUser)
  }

  const isLoggedIn = () => !!localStorage.getItem('token')

  return { user, token, login, logout, loadAuth, isLoggedIn }
}
