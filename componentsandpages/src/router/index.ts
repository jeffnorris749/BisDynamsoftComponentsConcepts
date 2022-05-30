import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import ScanningComponents from '../views/ScanningComponents.vue'
import PersonalizedPlates from '../views/PersonalizedPlates.vue'
import ImageScanner from '../views/ImageScanner.vue'
import { BTable } from 'bootstrap-vue'


Vue.component('b-table', BTable)
Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'scanningcomponents',
    component: ScanningComponents
  },
  {
    path: '/personalizedplates',
    name: 'personalizedplates',
    component: PersonalizedPlates
  },
  {
    path: '/imagescanner',
    name: 'imagescanner',
    component: ImageScanner
  },
]


const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
