import axios from 'axios';

// 创建 axios 实例
const service = axios.create({
  baseURL: 'your_api_base_url', // 替换为实际的 API 基础 URL
  timeout: 5000
});

// 请求拦截器
service.interceptors.request.use(
    config => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    error => {
      console.log(error);
      return Promise.reject(error);
    }
);

export default service;