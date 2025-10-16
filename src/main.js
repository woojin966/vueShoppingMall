import './assets/common.scss'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
library.add(fas, far, fab)

import unsplash from '@/api/unsplash'
unsplash.get('/photos/random')

const app = createApp(App)
// unsplash 전역 등록
app.config.globalProperties.$unsplash = unsplash

app.use(router)
app.use(store)
app.component('font-awesome-icon', FontAwesomeIcon)
app.mount('#app')
