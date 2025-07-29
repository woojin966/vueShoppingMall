// store/products.js
import { getAllProducts } from '@/api/productmenu2'

export default {
  namespaced: true,
  state: () => ({
    items: [],
  }),
  mutations: {
    setProducts(state, products) {
      state.items = products
    },
  },
  actions: {
    async fetchProducts({ commit }, payload) {
      try {
        const { category = 'all' } = payload || {}
        let products = await getAllProducts()

        // 'all'이 아니면 category 필터링
        if (category !== 'all') {
          products = products.filter((p) => p.category === category)
        }

        commit('setProducts', products)
      } catch (error) {
        console.error('상품 불러오기 실패:', error)
      }
    },
  },
}
