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
    component: () => import('@/views/template/albumView2.vue' ),
    meta: { title: '壁纸' }
  },
  {
    path: '/template/img-show',
    name: 'ImgShow',
    component: () => import('@/views/template/img-show.vue'),
    meta: { title: '我的壁纸', icon: 'Reading', role: [1, 2, 10], hidden: true, active: '/', keepAlive: true }
  },
  {
    path: '/about/img-about',
    name: 'ImgAbout',
    component: () => import('@/views/about/img-about.vue'),
    meta: { title: 'about', icon: 'Reading', role: [1, 2, 10], hidden: true, active: '/', keepAlive: true }
  },
  // {
  //   path: '/albums/images',
  //   name: 'AlbumsImages',
  //   component: () => import('@/views/album/Images.vue'),
  //   meta: { title: '我的壁纸', icon: 'Reading', role: [1, 2, 10], hidden: true, active: '/', keepAlive: true }
  // },

]

const routes: RouteRecordRaw[] = [

]

export default routes