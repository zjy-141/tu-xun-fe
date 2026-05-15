import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: () => import('../pages/Home.vue') },
    { path: '/login', component: () => import('../pages/Login.vue') },
    { path: '/register', component: () => import('../pages/Register.vue') },
    { path: '/photos', component: () => import('../pages/PhotoList.vue') },
    { path: '/photos/:id', component: () => import('../pages/PhotoDetail.vue'), props: true },
    { path: '/upload', component: () => import('../pages/UploadPhoto.vue'), meta: { auth: true } },
    { path: '/photos/:id/submit', component: () => import('../pages/SubmitAttempt.vue'), meta: { auth: true }, props: true },
    { path: '/photos/:id/my-attempts', component: () => import('../pages/MyAttempts.vue'), meta: { auth: true }, props: true },
    { path: '/prizes', component: () => import('../pages/MyPrizes.vue'), meta: { auth: true } },
    { path: '/profile', component: () => import('../pages/Profile.vue'), meta: { auth: true } },
    { path: '/admin/photos', component: () => import('../pages/admin/PhotoReview.vue'), meta: { auth: true, admin: true } },
    { path: '/admin/attempts', component: () => import('../pages/admin/AttemptReview.vue'), meta: { auth: true, admin: true } },
    { path: '/admin/prizes', component: () => import('../pages/admin/PrizeClaim.vue'), meta: { auth: true, admin: true } },
  ],
})

router.beforeEach((to, _from) => {
  const { user, loading, isAdmin } = useAuth()

  // 等 loading 完成
  if (loading.value) return true

  if (to.meta.auth && !user.value) {
    return '/login'
  }
  if (to.meta.admin && !isAdmin.value) {
    return '/'
  }
  return true
})

export default router
