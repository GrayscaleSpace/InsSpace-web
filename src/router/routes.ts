import { RouteRecordRaw } from 'vue-router'

export const constRoutes: RouteRecordRaw[] = [
  // {
  //   path: '/login',
  //   name: 'Login',
  //   component: () => import('@/views/login-register/login.vue'),
  //   meta: { title: '登录' }
  // },

  {
    path: '/',
    name: 'Gallery',
    component: () => import('@/views/gallery/index.vue'),
    meta: { title: '壁纸', icon: 'PictureFilled', role: [1, 2, 10], keepAlive: true }
  },
  {
    path: '/albums/images',
    name: 'AlbumsImages',
    component: () => import('@/views/album/Images.vue'),
    meta: { title: '我的壁纸', icon: 'Reading', role: [1, 2, 10], hidden: true, active: '/', keepAlive: true }
  },

]

const routes: RouteRecordRaw[] = [

]

export default routes