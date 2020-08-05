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
          name: 'lock',
          path: 'lock',
          component: () => import('@/views/pages/Lock'),
          meta: {
            middleware: [auth],
            title: 'Блок',
          },
        },
        {
          name: 'login',
          path: 'login',
          component: () => import('@/views/pages/Login'),
          meta: {
            title: 'Авторизация',
          },
        },
        {
          name: 'register',
          path: 'register',
          component: () => import('@/views/pages/Register'),
          meta: {
            title: 'Регистрация',
          },
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
          name: 'posts-list',
          path: 'posts',
          component: () => import('@/views/dashboard/Posts'),
          meta: {
            middleware: [auth],
            title: 'Добавление записи',
          },
        },
        {
          name: 'post_add',
          path: 'posts/create',
          component: () => import('@/views/dashboard/PostCreate'),
          meta: {
            middleware: [admin],
            title: 'Добавление записи',
          },
        },
        {
          name: 'category-list',
          path: 'category',
          component: () => import('@/views/dashboard/Category'),
          meta: {
            middleware: [auth],
            title: 'Список Категорий',
          },
        },
        {
          name: 'users',
          path: 'users',
          component: () => import('@/views/dashboard/Users'),
          meta: {
            middleware: [admin],
            title: 'Пользователи',
          },
        },
      ],
    },
    {
      path: '*',
      component: () => import('@/views/pages/Index'),
      children: [
        {
          name: '404',
          path: '',
          component: () => import('@/views/pages/Error'),
          meta: {
            title: 'Страница не найдена',
          },
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
