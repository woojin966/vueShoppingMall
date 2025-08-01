import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProductView1 from '../views/ProductView1.vue'
import ProductView2 from '../views/ProductView2.vue'
import ProductView3 from '../views/ProductView3.vue'
import ProductView4 from '../views/ProductView4.vue'
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
  { path: '/uncommon', name: 'ProductAll', component: ProductView2 },
  { path: '/uncommon/life', name: 'ProductLifeItem', component: ProductView2 },
  { path: '/uncommon/bag', name: 'ProductBag', component: ProductView2 },
  { path: '/uncommon/apparel', name: 'ProductApparel', component: ProductView2 },
  { path: '/uncommon/socks', name: 'ProductSocks', component: ProductView2 },
  { path: '/uncommon/fashion', name: 'ProductFashion', component: ProductView2 },
  { path: '/uncommon/thai-it', name: 'ProductThaiItem', component: ProductView2 },
  { path: '/selection/new', name: 'selectionNew', component: ProductView3 },
  { path: '/selection/best', name: 'selectionBest', component: ProductView3 },
  { path: '/selection/sale', name: 'selectionSale', component: ProductView3 },
  { path: '/brand/hamblepie', name: 'brand1', component: ProductView4 },
  { path: '/brand/puco', name: 'brand2', component: ProductView4 },
  { path: '/brand/phutawan', name: 'brand3', component: ProductView4 },
  { path: '/brand/smell', name: 'brand4', component: ProductView4 },
  { path: '/brand/orumm', name: 'brand5', component: ProductView4 },
  { path: '/brand/backstage', name: 'brand6', component: ProductView4 },
  // {
  //   path: '/brand/:brandName',
  //   name: 'brand',
  //   component: ProductView4,
  // },
  { path: '/cart', name: 'Cart', component: CartView },
  { path: '/order', name: 'Order', component: OrderView },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
