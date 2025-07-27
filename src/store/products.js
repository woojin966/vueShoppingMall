// store/products.js
import { getAllProducts, categoryApis } from '@/api/productmenu2'

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
        let products = []

        if (category === 'all') {
          products = await getAllProducts()
        } else {
          const fetchCategory = categoryApis[category]
          if (fetchCategory) {
            products = await fetchCategory()
          } else {
            console.warn(`알 수 없는 카테고리: ${category}`)
          }
        }

        commit('setProducts', products)
      } catch (error) {
        console.error('상품 불러오기 실패:', error)
      }
    },
  },
}
