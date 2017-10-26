import Vue from 'vue'
import Router from 'vue-router'

// Containers
import Full from '@/containers/Full'

// Views
import Dashboard from '@/views/Dashboard'
import Shop from '@/views/Shop'
import User from '@/views/User'
import Checklist from '@/views/Checklist'

// Views - Pages
import Page404 from '@/views/pages/Page404'
import Page500 from '@/views/pages/Page500'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  linkActiveClass: 'open active',
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
      name: 'Home',
      component: Full,
      children: [
        {
          path: 'dashboard',
          name: '대시보드',
          component: Dashboard
        },
        {
          path: 'shop',
          name: '점포관리',
          component: Shop
        },
        {
          path: 'user',
          name: '사용자관리',
          component: User
        },
        {
          path: 'checklist',
          name: '체크리스트 관리',
          component: Checklist
        }
      ]
    },
    {
      path: '/error',
      component: Page500
    },
    {
      path: '*',
      component: Page404
      // redirect: '/'
    }
  ]
})
