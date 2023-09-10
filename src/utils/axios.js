// axios.js
import axios from 'axios';

const BASE_URL = 'https://netease-music-api.fe-mm.com/'

// 创建一个Axios实例
const axiosInstance = axios.create({
  baseURL: BASE_URL, // 您的API基础URL
  timeout: 10000, // 请求超时时间
});

// 全局的请求拦截器
axiosInstance.interceptors.request.use(
    (config) => {
      // 在请求发送之前可以进行一些全局配置，例如添加token、headers等
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
);

// 全局的响应拦截器
axiosInstance.interceptors.response.use(
    (response) => {
      // 对响应数据进行处理
      return response.data;
    },
    (error) => {
      // 处理请求错误
      return Promise.reject(error);
    }
);

export default axiosInstance;
