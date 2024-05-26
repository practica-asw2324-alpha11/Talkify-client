import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'posts',
      component: () => import('../views/posts.vue')
    },
    {
      path: '/post/:id',
      name: 'post',
      component: () => import('../views/post.vue')
    },
    {
      path: '/magazines',
      name: 'magazines',
      component: () => import('../views/magazines.vue')
    }
  ]
})

export default router


