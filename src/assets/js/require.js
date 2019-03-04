import axios from 'axios';
import {Message} from 'vue';
const myRequire = {};
// 插件必须提供一个install方法
myRequire.install = function(Vue) {
// 给vue实例添加一个成员$http
// 设置全局请求基地址
  axios.defaults.baseURL = 'http://localhost:8888/api/private/v1';
  // 设置axios拦截器
  // 添加请求拦截器.发送请求之前判断当前是否是登陆，是就不设置token
  axios.interceptors.request.use(function (config) {
  // 在发送请求之前设置请求头
    if (config.url.toLocaleLowerCase() !== '/login') {
      let token = sessionStorage.getItem('token');
      config.headers.Authorization = token;
    }
    return config;
  }, function (error) {
  // 对请求错误做些什么
    return Promise.reject(error);
  });
  // 添加响应拦截器
  axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  // 判断获取数据是否成功
  let { meta: { status, msg }} = response.data;
  if(status == 200||status == 201){
  }else{
    Message.error(msg);
  }
    return response;
  }, function (error) {
  // 对响应错误做点什么
    return Promise.reject(error);
  });
  // 配置全局axios
  Vue.prototype.$http = axios;
};
// 导出成员
export default myRequire;
