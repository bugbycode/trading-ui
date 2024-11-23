import axios from 'axios';
import { ElMessage,ElLoading } from 'element-plus'

var loading = null;

// 创建 Axios 实例，设置基础 URL 和超时
const instance = axios.create({
  //baseURL: '/api', // 这里的 /api 是代理前缀
  //timeout: 5000,    // 请求超时时间
  withCredentials: true,
  //maxRedirects: 0, // 禁用自动重定向
});

// 配置请求拦截器（可选）
instance.interceptors.request.use(
  config => {
    const timestamp = new Date().getTime();

    const url = config.url;
    if(!(url == '/user/userInfo' || url == '/bot/getOrderCount')){
      loading = ElLoading.service({
        lock: true,
        text: 'Loading',
        background: 'rgba(0, 0, 0, 0.7)',
      })
    }
    // 如果请求已经带有params，直接追加时间戳
    if (config.params) {
      config.params.t = timestamp;
    } else {
      config.params = { t: timestamp };
    }
    // 可以在这里处理，比如添加 token 到请求头
    return config;
  },
  error => {
    console.log(error);
    return Promise.reject(error)
  }
);

// 配置响应拦截器（可选）
instance.interceptors.response.use(
  response => {
    if(loading) {
      loading.close();
    }
    //console.log(JSON.stringify(response));
    // 在这里处理响应数据
    return response.data;
  },
  error => {
    const { response } = error;
    if(loading) {
      loading.close();
    }
    //console.log(error);
    if(response){
      ElMessage.error({message: response.statusText, offset: (window.innerHeight / 2)});
      return {status: 500,message:response.statusText};
    } else {
      return Promise.reject(error);
    }
    /*
    // 处理错误响应
    if(error.status){

      return {status: 500,message:'server error.'}
    } else {
      return Promise.reject(error);
    }*/
  }
);

export default instance;
