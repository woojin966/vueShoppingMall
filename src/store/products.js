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
        const pathname = path || window.location.pathname
        let rawProducts = []

        // ✅ Home 메뉴 미리보기에서만 사용하는 필터
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
        } else if (menuType === 'community') {
          //
        } else {
          // ✅ 이 아래는 실제 페이지에서 사용하는 pathname 분기
          //const pathname = window.location.pathname

          if (pathname === '/selection/new') {
            const menu1 = (await getMenu1Products()).map((p) => ({ ...p }))
            const menu2 = (await getMenu2Products()).map((p) => ({ ...p }))
            rawProducts = [...menu1, ...menu2].filter((p) => p.new)
          } else if (pathname === '/selection/best') {
            const menu1 = (await getMenu1Products()).map((p) => ({ ...p }))
            const menu2 = (await getMenu2Products()).map((p) => ({ ...p }))
            rawProducts = [...menu1, ...menu2].filter((p) => p.best).slice(0, 30)
          } else if (pathname === '/selection/sale') {
            const menu1 = (await getMenu1Products()).map((p) => ({ ...p }))
            const menu2 = (await getMenu2Products()).map((p) => ({ ...p }))
            rawProducts = [...menu1, ...menu2].filter((p) => p.clearance)
          } else if (pathname === '/kitchen/summerdish') {
            const menu1 = (await getMenu1Products()).map((p) => ({ ...p }))
            rawProducts = menu1.filter((p) => p.isSummerdish)
          } else if (pathname.startsWith('/kitchen')) {
            rawProducts = await getMenu1Products()
          } else if (pathname === '/uncommon' || pathname === '/uncommon/') {
            rawProducts = await getMenu2Products()
          } else if (pathname === '/uncommon/thai-it') {
            const menu1 = (await getMenu1Products()).map((p) => ({ ...p }))
            const menu2 = (await getMenu2Products()).map((p) => ({ ...p }))
            rawProducts = [...menu1, ...menu2].filter((p) => p.isThai)
          } else if (/^\/brand\/([^/]+)\/?$/.test(pathname)) {
            const match = pathname.match(/^\/brand\/([^/]+)\/?$/)
            const brandName = match ? match[1] : ''
            if (brandName) {
              const menu1 = (await getMenu1Products()).map((p) => ({ ...p }))
              const menu2 = (await getMenu2Products()).map((p) => ({ ...p }))
              const all = [...menu1, ...menu2]
              rawProducts = all.filter((p) => p.brand?.toLowerCase() === brandName.toLowerCase())
            }
          } else {
            const menu1 = (await getMenu1Products()).map((p) => ({ ...p }))
            const menu2 = (await getMenu2Products()).map((p) => ({ ...p }))
            rawProducts = [...menu1, ...menu2]
          }
        }

        // ✅ 마지막 category 필터링
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
      } catch (error) {
        console.error('상품 불러오기 실패:', error)
      }
    },
  },
}
