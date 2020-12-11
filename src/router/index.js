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
      ],
    },
    {
      group: 'menu',
      path: '/',
      component: () => import('@/views/dashboard/Index'),
      meta: {
        middleware: [auth],
        title: 'Главная',
      },
    },
    {
      path: '/users',
      name: 'users',
      component: () => import('@/views/dashboard/Index'),
      children: [
        {
          name: 'users_list',
          path: 'list',
          component: () => import('@/views/dashboard/users/Index'),
        },
        {
          name: 'user_create',
          path: 'create',
          component: () => import('@/views/dashboard/users/CreateUpdate'),
          meta: {
            middleware: [admin],
            title: '',
          },
        },
        {
          name: 'user_edit',
          path: 'edit/:id',
          component: () => import('@/views/dashboard/users/CreateUpdate'),
          meta: {
            middleware: [admin],
            title: '',
          },
        },
      ],
    },
    {
      path: '/posts',
      component: () => import('@/views/dashboard/Index'),
      meta: {
        middleware: [admin],
        title: '',
      },
      children: [
        {
          name: 'home',
          path: '/',
          component: () => import('@/views/dashboard/posts/Index'),
          meta: {
            middleware: [auth],
            title: 'Главная',
          },
        },
        {
          name: 'posts_list',
          path: 'list',
          component: () => import('@/views/dashboard/posts/Index'),
        },
        {
          name: 'post_create',
          path: 'create',
          component: () => import('@/views/dashboard/posts/CreateUpdate'),
          meta: {
            middleware: [admin],
            title: '',
          },
        },
        {
          name: 'post_edit',
          path: 'edit/:id',
          component: () => import('@/views/dashboard/posts/CreateUpdate'),
          meta: {
            middleware: [admin],
            title: '',
          },
        },
      ],
    },
    {
      path: '/categories',
      name: 'categories',
      component: () => import('@/views/dashboard/Index'),
      meta: {
        middleware: [admin],
        title: '',
      },
      children: [
        {
          name: 'categories_list',
          path: 'list',
          component: () => import('@/views/dashboard/categories/Index'),
        },
        {
          name: 'category_create',
          path: 'create',
          component: () => import('@/views/dashboard/categories/CreateUpdate'),
        },
        {
          name: 'category_edit',
          path: 'edit/:id',
          component: () => import('@/views/dashboard/categories/CreateUpdate'),
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
