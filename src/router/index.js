import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProductView1 from '../views/ProductView1.vue'
import ProductView2 from '../views/ProductView2.vue'
import ProductView3 from '../views/ProductView3.vue'
import CartView from '../views/CartView.vue'
import OrderView from '../views/OrderView.vue'

const routes = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/kitchen', name: 'kitchenAll', component: ProductView1 },
  { path: '/kitchen/summerdish', name: 'kitchenSummerdish', component: ProductView1 },
  { path: '/kitchen/maindish', name: 'kitchenMaindish', component: ProductView1 },
  { path: '/kitchen/sidedish', name: 'kitchenSidedish', component: ProductView1 },
  { path: '/kitchen/desert', name: 'kitchenDesert', component: ProductView1 },
  { path: '/kitchen/foodit', name: 'kitchenFoodit', component: ProductView1 },
  { path: '/selection/new', name: 'SeletionNew', component: ProductView3 },
  { path: '/selection/best', name: 'SeletionBest', component: ProductView3 },
  { path: '/selection/sale', name: 'SeletionSale', component: ProductView3 },
  { path: '/cart', name: 'Cart', component: CartView },
  { path: '/order', name: 'Order', component: OrderView },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
