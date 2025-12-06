// store/products.js
import { getAllProducts as getMenu1Products } from '@/api/productmenu1'
import { getAllProducts as getMenu2Products } from '@/api/productmenu2'

const uniqueById = (arr) => {
  const seen = new Set()
  return arr.filter((item) => {
    if (seen.has(item.id)) return false
    seen.add(item.id)
    return true
  })
}

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
        const { category = 'all', path = '', menuType = '' } = payload || {}

        // -----------------------------
        // ① pathname 완전 안전 처리
        // -----------------------------
        const base = import.meta.env.BASE_URL || '/'

        let rawPath = path || window.location.pathname

        // '/myshop/' → '' 로 정확히 제거
        const pathname = rawPath.replace(new RegExp(`^${base}`), '/')

        let rawProducts = []

        // -----------------------------
        // ② HOME 미리보기 데이터(menuType)
        // -----------------------------
        if (menuType === 'kitchen') {
          const menu1 = (await getMenu1Products()).map((p) => ({ ...p }))
          rawProducts = menu1.filter((p) => p.new)
        } else if (menuType === 'uncommon') {
          const menu2 = (await getMenu2Products()).map((p) => ({ ...p }))
          rawProducts = menu2.filter((p) => p.new)
        } else if (menuType === 'selection') {
          const menu1 = (await getMenu1Products()).map((p) => ({ ...p }))
          const menu2 = (await getMenu2Products()).map((p) => ({ ...p }))
          rawProducts = [...menu1, ...menu2].filter((p) => p.clearance)
        } else if (menuType === 'brand') {
          const menu1 = (await getMenu1Products()).map((p) => ({ ...p }))
          const menu2 = (await getMenu2Products()).map((p) => ({ ...p }))
          rawProducts = [...menu1, ...menu2].filter((p) => p.best)
        } else {
          // -----------------------------
          // ③ 실제 페이지별 pathname 라우팅
          // -----------------------------

          // --- SELECTION ---
          if (pathname === '/selection/new') {
            const m1 = (await getMenu1Products()).map((p) => ({ ...p }))
            const m2 = (await getMenu2Products()).map((p) => ({ ...p }))
            rawProducts = [...m1, ...m2].filter((p) => p.new)
          } else if (pathname === '/selection/best') {
            const m1 = (await getMenu1Products()).map((p) => ({ ...p }))
            const m2 = (await getMenu2Products()).map((p) => ({ ...p }))
            rawProducts = [...m1, ...m2].filter((p) => p.best)
          } else if (pathname === '/selection/sale') {
            const m1 = (await getMenu1Products()).map((p) => ({ ...p }))
            const m2 = (await getMenu2Products()).map((p) => ({ ...p }))
            rawProducts = [...m1, ...m2].filter((p) => p.clearance)

            // --- KITCHEN ---
          } else if (pathname === '/kitchen/summerdish') {
            const m1 = (await getMenu1Products()).map((p) => ({ ...p }))
            rawProducts = m1.filter((p) => p.isSummerdish)
          } else if (pathname.startsWith('/kitchen')) {
            rawProducts = await getMenu1Products()

            // --- UNCOMMON ---
          } else if (pathname === '/uncommon/thai-it') {
            const m1 = (await getMenu1Products()).map((p) => ({ ...p }))
            const m2 = (await getMenu2Products()).map((p) => ({ ...p }))
            rawProducts = [...m1, ...m2].filter((p) => p.isThai)
          } else if (pathname.startsWith('/uncommon')) {
            rawProducts = await getMenu2Products()

            // --- BRAND ---
          } else if (/^\/brand\/([^/]+)\/?$/.test(pathname)) {
            const brandName = pathname.split('/')[2]?.toLowerCase()
            if (brandName) {
              const m1 = (await getMenu1Products()).map((p) => ({ ...p }))
              const m2 = (await getMenu2Products()).map((p) => ({ ...p }))
              rawProducts = [...m1, ...m2].filter((p) => p.brand?.toLowerCase() === brandName)
            }

            // ⭐ SEARCH ROUTE — 검색 페이지는 항상 전체 상품을 불러와야 한다
          } else if (pathname.startsWith('/search')) {
            const m1 = (await getMenu1Products()).map((p) => ({ ...p }))
            const m2 = (await getMenu2Products()).map((p) => ({ ...p }))
            rawProducts = [...m1, ...m2]

            // --- ALL PRODUCTS (fallback) ---
          } else {
            const m1 = (await getMenu1Products()).map((p) => ({ ...p }))
            const m2 = (await getMenu2Products()).map((p) => ({ ...p }))
            rawProducts = [...m1, ...m2]
          }
        }

        // -----------------------------
        // ④ category 필터링 (일반 카테고리)
        // -----------------------------
        const filteredProducts =
          pathname.startsWith('/selection/') ||
          pathname === '/kitchen/summerdish' ||
          pathname === '/uncommon/thai-it' ||
          pathname.startsWith('/brand/')
            ? rawProducts
            : category === 'all'
              ? rawProducts
              : rawProducts.filter((p) => p.category === category)

        commit('setProducts', uniqueById(filteredProducts))
      } catch (err) {
        console.error('상품 불러오기 실패:', err)
      }
    },
  },
}
