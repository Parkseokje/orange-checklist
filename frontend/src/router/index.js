import Vue from 'vue'
import Router from 'vue-router'

// Containers
import Full from '@/containers/Full'

// Views
import Dashboard from '@/views/Dashboard'
import Shop from '@/views/Shop'
import User from '@/views/User'
import Checklist from '@/views/Checklist'
import ChecklistCreateOrModify from '@/views/ChecklistCreateOrModify'
import UserChecklistStart from '@/views/UserChecklistStart'
import UserChecklist from '@/views/UserChecklist'
import ChecklistResult from '@/views/ChecklistResult'
import Board from '@/views/Board'
import UserBoard from '@/views/UserBoard'
import UserBoardDetails from '@/views/UserBoardDetails'
import UserAlarm from '@/views/UserAlarm'

// Views - Pages
import Login from '@/views/pages/Login'
import ForgotPassword from '@/views/pages/ForgotPassword'
import ResetPassword from '@/views/pages/ResetPassword'
import Page404 from '@/views/pages/Page404'
import Page500 from '@/views/pages/Page500'

Vue.use(Router)

export default new Router({
  mode: 'history',
  linkActiveClass: 'open active',
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    {
      path: '/login',
      name: 'Login',
      meta: { needsAuth: false },
      component: Login
    },
    {
      path: '/forgot-password',
      name: 'Forgot-Password',
      meta: { needsAuth: false },
      component: ForgotPassword
    },
    {
      path: '/reset-password',
      name: 'Reset-Password',
      meta: { needsAuth: false },
      component: ResetPassword,
      props: true
      // props: route => ({ query: route.query.token })
    },
    {
      path: '/',
      redirect: '/dashboard',
      name: 'Home',
      component: Full,
      children: [
        {
          path: 'dashboard',
          meta: { needsAuth: true },
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
        },
        {
          path: 'checklist/create',
          name: '체크리스트 추가',
          component: ChecklistCreateOrModify
        },
        {
          path: 'checklist/:id',
          name: '체크리스트 수정',
          component: ChecklistCreateOrModify
        },
        {
          path: 'checklist-result/:id',
          name: '체크리스트 결과',
          component: ChecklistResult,
          props: true
        },
        {
          path: 'checklist-shop-result/:id',
          name: '점포별 체크리스트 결과',
          component: ChecklistResult,
          props: true
        },
        {
          path: 'user-checklist',
          name: '나의 체크리스트',
          component: UserChecklist
        },
        {
          path: 'user-checklist-result/:id',
          name: '나의 체크리스트 결과',
          component: ChecklistResult,
          props: true
        },
        {
          path: 'user-checklist/:id',
          name: '체크리스트 시작',
          component: UserChecklistStart
        },
        {
          path: 'board',
          name: '게시판 관리',
          component: Board
        },
        {
          path: 'user-board',
          name: '나의 게시판',
          component: UserBoard
        },
        {
          path: 'user-board-details/:board_id/:content_id',
          name: '게시글 보기',
          component: UserBoardDetails,
          props: true
        },
        {
          path: 'user-alarm',
          name: '나의 알림',
          component: UserAlarm,
          props: true
        }
      ]
    },
    {
      name: 'error',
      path: '/error',
      component: Page500,
      props: true
    },
    {
      name: '404',
      path: '*',
      component: Page404
      // redirect: '/'
    }
  ]
})
