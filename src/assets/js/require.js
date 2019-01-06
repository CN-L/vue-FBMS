import axios from 'axios';
const myRequire = {};
// 插件必须提供一个install方法
myRequire.install = function(Vue) {
// 给vue实例添加一个成员$http
// 设置全局请求基地址
  axios.defaults.baseURL = 'http://localhost:8888/api/private/v1';
  // 配置全局axios
  Vue.prototype.$http = axios;
};
// 导出成员
export default myRequire;
