import { createRouter, createWebHistory } from 'vue-router'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login'  // 将根路径重定向到登录页
    },
    {
      path: '/login',
      component: () => import('../views/login.vue'),meta: { showHeader: false }},
    {
      path: '/register',
      component: () => import('../views/register.vue'),meta: { showHeader: false }},
    {
      path: '/Home',
      component: () => import('../views/Home.vue'),meta: { showHeader: true ,requiresAuth: true},},
    {
      path: '/source',
      component: () => import('../views/source.vue'),meta: { showHeader: true ,requiresAuth: true}},
    {
      path: '/profile',
      component: () => import('../views/profile.vue'),meta: { showHeader: true ,requiresAuth: true}},
    {
      path: '/ForgotPassword',
      component: () => import('../views/ForgotPassword.vue'),meta: { showHeader: false }},

  ],
})


router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !localStorage.getItem('token')) {
    next('/login');
  } else {
    next();
  }
});
export default router
