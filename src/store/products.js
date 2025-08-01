// store/products.js
import { getAllProducts as getMenu1Products } from '@/api/productmenu1'
import { getAllProducts as getMenu2Products } from '@/api/productmenu2'

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
        const pathname = window.location.pathname

        let rawProducts = []

        // 1. /kitchen/summerdish → menu1 only, isSummerdish:true
        if (pathname === '/kitchen/summerdish') {
          const menu1 = await getMenu1Products()
          rawProducts = menu1.filter((p) => p.isSummerdish)
        }

        // 2. /kitchen → menu1만
        else if (pathname.startsWith('/kitchen')) {
          rawProducts = await getMenu1Products()
        }

        // 3. /uncommon → menu2만
        else if (pathname === '/uncommon' || pathname === '/uncommon/') {
          rawProducts = await getMenu2Products()
        }

        // 4. /uncommon/thai-it → menu1 + menu2 중 isThai:true
        else if (pathname === '/uncommon/thai-it') {
          const menu1 = await getMenu1Products()
          const menu2 = await getMenu2Products()
          rawProducts = [...menu1, ...menu2].filter((p) => p.isThai)
        }

        // 5. 기타 → menu1 + menu2 전체
        else {
          const menu1 = await getMenu1Products()
          const menu2 = await getMenu2Products()
          rawProducts = [...menu1, ...menu2]
        }

        // 6. 카테고리 필터 적용 (특수한 조건들은 이미 필터됨)
        const filteredProducts =
          pathname === '/kitchen/summerdish' || pathname === '/uncommon/thai-it'
            ? rawProducts
            : category === 'all'
              ? rawProducts
              : rawProducts.filter((p) => p.category === category)

        commit('setProducts', filteredProducts)
      } catch (error) {
        console.error('상품 불러오기 실패:', error)
      }
    },
  },
}
