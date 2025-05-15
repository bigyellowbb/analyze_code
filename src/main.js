import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import ElementPlus from 'element-plus';

import 'element-plus/dist/index.css';
import axios from 'axios';

const app = createApp(App);
const axiosInstance = axios.create({  // [!code ++]
    baseURL: 'http://localhost:8080',  // [!code ++]
    timeout: 14400000,  // [!code ++]
    withCredentials: true,
  })

export const analyzeCode = async (fileId, analysisType) => {
    try {
        const response = await axiosInstance.post('/analyze', {
            file_id: fileId,
            analysis_type: analysisType
        })
        return response.data
    } catch (error) {
        if (error.code === 'ECONNABORTED') {
            console.error('分析请求超时（240分钟已到）')
            throw new Error('分析时间过长，请稍后查看结果')
        }
        throw error
    }
}
// 添加请求拦截器
axiosInstance.interceptors.request.use(config => {  // [!code ++]
  const token = localStorage.getItem('token');  // [!code ++]
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;  // [!code ++]
  }  // [!code ++]
    return config;
});  // [!code ++]

app.config.globalProperties.$axios = axiosInstance;  // [!code ++]

app.use(router)
app.use(ElementPlus);
app.mount('#app')

