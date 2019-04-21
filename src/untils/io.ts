import axios from 'axios';

// 创建 axios 实例
const io = axios.create({
    baseURL: '/api', // api base_url
    timeout: 6000 // 请求超时时间
})

export default io;
