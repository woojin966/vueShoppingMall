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

        // ✅ 1. /selection/new → new: true
        if (pathname === '/selection/new') {
          const menu1 = await getMenu1Products()
          const menu2 = await getMenu2Products()
          rawProducts = [...menu1, ...menu2].filter((p) => p.new)
        }

        // ✅ 2. /selection/best → best: true, 최대 30개
        else if (pathname === '/selection/best') {
          const menu1 = await getMenu1Products()
          const menu2 = await getMenu2Products()
          rawProducts = [...menu1, ...menu2].filter((p) => p.best).slice(0, 30) // 최대 30개로 제한
        }

        // ✅ 3. /selection/sale → clearance: true
        else if (pathname === '/selection/sale') {
          const menu1 = await getMenu1Products()
          const menu2 = await getMenu2Products()
          rawProducts = [...menu1, ...menu2].filter((p) => p.clearance)
        }

        // ✅ 기존 조건들...
        else if (pathname === '/kitchen/summerdish') {
          const menu1 = await getMenu1Products()
          rawProducts = menu1.filter((p) => p.isSummerdish)
        } else if (pathname.startsWith('/kitchen')) {
          rawProducts = await getMenu1Products()
        } else if (pathname === '/uncommon' || pathname === '/uncommon/') {
          rawProducts = await getMenu2Products()
        } else if (pathname === '/uncommon/thai-it') {
          const menu1 = await getMenu1Products()
          const menu2 = await getMenu2Products()
          rawProducts = [...menu1, ...menu2].filter((p) => p.isThai)
        } else if (/^\/brand\/([^/]+)\/?$/.test(pathname)) {
          const match = pathname.match(/^\/brand\/([^/]+)\/?$/)
          const brandName = match ? match[1] : ''
          if (!brandName) return

          const menu1 = await getMenu1Products()
          const menu2 = await getMenu2Products()

          const all = [...menu1, ...menu2]
          const filtered = all.filter((p) => p.brand?.toLowerCase() === brandName.toLowerCase())
          rawProducts = filtered
        } else {
          const menu1 = await getMenu1Products()
          const menu2 = await getMenu2Products()
          rawProducts = [...menu1, ...menu2]
        }

        // ✅ category 필터링 (탭용)
        const filteredProducts =
          pathname.startsWith('/selection/') ||
          pathname === '/kitchen/summerdish' ||
          pathname === '/uncommon/thai-it'
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
