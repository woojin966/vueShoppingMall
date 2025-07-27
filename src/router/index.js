import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProductView from '../views/ProductView.vue'
import CartView from '../views/CartView.vue'
import OrderView from '../views/OrderView.vue'

const routes = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/product', name: 'ProductAll', component: ProductView },
  { path: '/product/life', name: 'ProductLifeItem', component: ProductView },
  { path: '/product/bag', name: 'ProductBag', component: ProductView },
  { path: '/product/apparel', name: 'ProductApparel', component: ProductView },
  { path: '/product/socks', name: 'ProductSocks', component: ProductView },
  { path: '/product/fashion', name: 'ProductFashion', component: ProductView },
  { path: '/product/thai-it', name: 'ProductThaiItem', component: ProductView },
  { path: '/cart', name: 'Cart', component: CartView },
  { path: '/order', name: 'Order', component: OrderView },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
