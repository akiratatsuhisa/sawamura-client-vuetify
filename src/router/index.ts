// Composables
import { createRouter, createWebHistory } from 'vue-router';

import { useAuth } from '@/composables/useAuth';

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/default/Index.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
          import(/* webpackChunkName: "home" */ '@/views/Home.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'messages',
        template: '<route-view></route-view>',
        children: [
          {
            path: '',
            name: 'Messages',
            // route level code-splitting
            // this generates a separate chunk (about.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () =>
              import(
                /* webpackChunkName: "messages" */ '@/views/Messages/Index.vue'
              ),
            meta: { requiresAuth: true },
          },
          {
            path: ':roomId',
            name: 'Messages:Room',
            // route level code-splitting
            // this generates a separate chunk (about.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () =>
              import(
                /* webpackChunkName: "messages" */ '@/views/Messages/Room.vue'
              ),
            meta: { requiresAuth: true },
          },
        ],
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
          import(
            /* webpackChunkName: "dashboard" */ '@/views/Dashboard/Index.vue'
          ),
        children: [
          {
            path: 'users',
            name: 'Dashboard:Users',
            // route level code-splitting
            // this generates a separate chunk (about.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () =>
              import(
                /* webpackChunkName: "dashboard" */ '@/views/Dashboard/Users.vue'
              ),
            meta: { requiresAuth: true },
          },
          {
            path: 'messages',
            name: 'Dashboard:Messages',
            // route level code-splitting
            // this generates a separate chunk (about.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () =>
              import(
                /* webpackChunkName: "dashboard" */ '@/views/Dashboard/Messages.vue'
              ),
            meta: { requiresAuth: true },
          },
        ],
      },
      {
        path: 'profile',
        name: 'Profile',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
          import(/* webpackChunkName: "auth" */ '@/views/Auth/Profile.vue'),
      },
      {
        path: 'users/:id',
        name: 'Users:Detail',
        component: () =>
          import(/* webpackChunkName: "users" */ '@/views/Users/Detail.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/',
    component: () => import('@/layouts/auth/Index.vue'),
    children: [
      {
        path: 'login',
        name: 'Login',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
          import(/* webpackChunkName: "auth" */ '@/views/Auth/Login.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

const { isAuthenticated } = useAuth();

router.beforeEach((to) => {
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    return {
      name: 'Login',
      query: { redirect: to.fullPath },
    };
  }
});

export default router;
