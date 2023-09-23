import axios from "axios";
import { ElMessage } from 'element-plus';
import router from '@/router/index';
import useUserStore from "@/store/user";

// 创建 Axios 实例
const instance = axios.create({
    baseURL: 'https://pan.reaicc.com', // 替换成你的后端 API 地址
    // baseURL: 'http://127.0.0.1:8081', // 替换成你的后端 API 地址
});

// 发起 HTTP 请求的函数
function http(url, data) {
    return new Promise((resolve, reject) => {
        instance({
            url,
            method: 'post',
            data,
            headers: {
                // 设置跨域请求头
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*", // 替换成允许的跨域域名，或使用 "*" 允许所有
            },
        })
            .then((res) => {
                resolve(res.data);
            })
            .catch((error) => {
                console.log('请求出错: ', error);
                if (['/login', '/register', '/forget', '/tool/smsSend'].includes(url) || [201].includes(error.code)) {
                    reject({ message: error.data || error.message, type: 'error' });
                } else {
                    ElMessage({ message: error.data || error.message, type: 'error' });
                    if ([401].includes(error.code) || (error.code === 500 && error.message === 'invalid token')) {
                        // 为了避免由于登录失效后到登录页还需重新输入数据
                        localStorage.removeItem('token');
                        useUserStore().updateUserInfo(null);
                        router.push({
                            path: '/'
                        });
                    }
                }
            });
    });
}

export default http;
