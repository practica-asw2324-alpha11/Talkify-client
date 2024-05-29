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
      path: '/search',
      name: 'search',
      component: () => import('../views/search.vue'),
      props: route => ({ query: route.query.query }), 
    },
    {
      path: '/newpost/:type?',
      name: 'newpost',
      component:() => import('../views/newpost.vue'),
    },
    {
      path: '/profile',
      name: 'profile',
      component:() => import('../views/profile.vue'),
    },
    {
      path: '/profile/edit',
      name: 'editprofile',
      component:() => import('../views/profile.vue'),
      props: { isEditing: true }
    },
    {
      path: '/users/:id',
      name: 'user',
      component: () => import('../views/users.vue'),
      props: { isEditing: false }
    },
  ]
})

export default router


