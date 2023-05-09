import axios from 'axios';
import { message } from "antd";

// 请求拦截器
axios.interceptors.request.use(
    (config) => {
        // 在请求发送之前设置请求头部信息
        const token = localStorage.getItem('token');
        if (token) {
            // console.log("请求头：" + token)
            config.headers.authorization = token;
        }
        return config;
    },
    (error) => {
        // 返回错误信息
        return Promise.reject(error);
    }
);

// 响应拦截器
axios.interceptors.response.use(
    (response) => {
        if (response.data.code === 0) {
            // 设置登录权限为true
            localStorage.setItem('isAuthenticated', 'true');
            return response;
        } else {
            // 弹出错误信息
            message.error(response.data.data);
            // 统一处理失败响应
            return Promise.reject(response.data);
        }
    },
    // 如果响应码不是2xx，就会直接进入这里
    (error) => {
        if(error.response.data.data){
            message.error(error.response.data.data);
            localStorage.setItem('isAuthenticated', 'false');
            localStorage.removeItem('token');
        }
        // 抛出错误，以便后续的错误处理机制继续处理
        throw error;
    }
);

export default axios;