// import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import axios from './utils/axios.js';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
// 定义全局的辅助函数
const genImgUrl = (url, w, h) => {
  if (!h) {
    h = w
  }
  url += `?param=${w}y${h}`
  return url
};
const getPageOffset = (page, limit) =>{
  return (page - 1) * limit
}
const app = createApp(App)
// 注入Axios实例
app.use(ElementPlus); // 使用Element Plus插件
app.provide('axios', axios);

// 在Vue应用程序配置中添加全局辅助函数
app.config.globalProperties.$utils = {
  genImgUrl,getPageOffset,
};
app.mount('#app')
