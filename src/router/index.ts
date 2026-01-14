import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Home/HomeView.vue'
import SignUpView from '../views/Auth/SignUpView.vue'
import LoginView from '../views/Auth/LoginView.vue'
import DashboardView from '../views/Dashboard/DashboardView.vue'
import ProfileView from '../views/Profile/ProfileView.vue'
import RequestView from '../views/RequestView.vue'
import OfficeView from '../views/Offices/OfficeView.vue'
import VerifyView from '@/views/Verify.vue'
import TermsView from '@/views/TermsView.vue'
import ResetPasswordView from '@/views/ResetPassword.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/terms',
      name: 'terms',
      component: TermsView,
    },
    {
      path: '/verify/:token',
      name: 'verify',
      component: VerifyView,
    },
    {
      path: '/resetPassword/:token/:user',
      name: 'resetPassword',
      component: ResetPasswordView,
    },
    {
      path: '/office/:id',
      name: 'office',
      component: OfficeView,
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      beforeEnter: (to, from, next) => {
        const token = localStorage.getItem('token')
        if (!token) {
          next('/')
        } else {
          next()
        }
      },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      beforeEnter: (to, from, next) => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.data?.role === '0') {
          next();
        } else {
          next('/');
        }
      },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      beforeEnter: (to, from, next) => {
        const token = localStorage.getItem('token')
        if (token) {
          next('/')
        } else {
          next()
        }
      },
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignUpView,
      beforeEnter: (to, from, next) => {
        const token = localStorage.getItem('token')
        if (token) {
          next('/')
        } else {
          next()
        }
      },
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
      }
    }
    return savedPosition || { top: 0 }
  },
})

export default router
