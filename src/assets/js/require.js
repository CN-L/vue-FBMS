import axios from 'axios';
import { Message } from 'element-ui';
import  {Loading} from 'element-ui';
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
  //添加vue实例方法，供所有组件使用
  Vue.prototype.startLoading = function(){
    const loading = this.$loading({
      lock: true,
      text: '数据加载中',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    });
    return loading;
  }
  Vue.prototype.closeLoading = function(loading){
   setTimeout(()=>{
     loading.close()
   },200)
  }
};
// 导出成员
export default myRequire;
