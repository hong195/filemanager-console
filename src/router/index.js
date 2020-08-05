import Vue from 'vue'
import Router from 'vue-router'
import auth from './middleware/auth'
import admin from './middleware/admin'
import middlewarePipeline from './middleware/pipeline'
import store from '../store'

Vue.use(Router)

const router = new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/page',
      component: () => import('@/views/pages/Index'),
      children: [
        {
          name: 'Lock',
          path: 'lock',
          component: () => import('@/views/pages/Lock'),
          meta: {
            middleware: [auth],
          },
        },
        {
          name: 'Login',
          path: 'login',
          component: () => import('@/views/pages/Login'),
        },
        {
          name: 'Register',
          path: 'register',
          component: () => import('@/views/pages/Register'),
        },
      ],
    },
    {
      path: '/',
      component: () => import('@/views/dashboard/Index'),
      children: [
        // Dashboard
        {
          name: 'Главная',
          path: '',
          component: () => import('@/views/dashboard/Posts'),
          meta: {
            middleware: [auth],
          },
        },
        {
          name: 'Список Записей',
          path: 'posts',
          component: () => import('@/views/dashboard/Posts'),
          meta: {
            middleware: [auth],
          },
        },
        {
          name: 'Добавление записи',
          path: 'posts/create',
          component: () => import('@/views/dashboard/PostCreate'),
          meta: {
            middleware: [admin],
          },
        },
        {
          name: 'Список Категорий',
          path: 'category',
          component: () => import('@/views/dashboard/Category'),
          meta: {
            middleware: [auth],
          },
        },
        {
          name: 'Пользователи',
          path: 'users',
          component: () => import('@/views/dashboard/Users'),
          meta: {
            middleware: [admin],
          },
        },
      ],
    },
    {
      path: '*',
      component: () => import('@/views/pages/Index'),
      children: [
        {
          name: '404 Error',
          path: '',
          component: () => import('@/views/pages/Error'),
        },
      ],
    },
  ],
})

router.beforeEach((to, from, next) => {
  if (!to.meta.middleware) {
    return next()
  }
  const middleware = to.meta.middleware

  const context = {
    to,
    from,
    next,
    store,
  }

  return middleware[0]({
    ...context,
    next: middlewarePipeline(context, middleware, 1),
  })
})

export default router
