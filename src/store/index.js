// vuex 모듈들
import { createStore } from 'vuex'
import products from './products'

const store = createStore({
  state: {
    // 초기 전역 상태
    testMessage: 'hi',
  },
  mutations: {
    // 상태 변경 로직
  },
  actions: {
    // 비동기 작업
  },
  modules: {
    // 이후 여기에 모듈 추가
    // 추후 products.js, cart.js, order.js 로 분리해서 inex.js에 등록
    product: products,
  },
})

export default store
