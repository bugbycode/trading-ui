import axios from 'axios';

// 创建 Axios 实例，设置基础 URL 和超时
const instance = axios.create({
  //baseURL: '/api', // 这里的 /api 是代理前缀
  timeout: 5000,    // 请求超时时间
  withCredentials: true,
});

// 配置请求拦截器（可选）
instance.interceptors.request.use(
  config => {
    // 可以在这里处理，比如添加 token 到请求头
    return config;
  },
  error => Promise.reject(error)
);

// 配置响应拦截器（可选）
instance.interceptors.response.use(
  response => {
    // 在这里处理响应数据
    return response.data;
  },
  error => {
    //console.log(error);
    // 处理错误响应
    if(error.status){
      return {status: 500,message:'server error.'}
    } else {
      return Promise.reject(error);
    }
  }
);

export default instance;
