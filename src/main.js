// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App';
import router from './router';
import '@/assets/css/index.css';
import moment from 'moment';
import axios from 'axios';
Vue.use(ElementUI);
Vue.config.productionTip = false;
// 设置全局请求基地址
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1';
// 配置全局axios
Vue.prototype.$http = axios;
/* eslint-disable no-new */
// 格式化日期
Vue.filter('formDate', (value, fmtString) => {
  return moment(value).format(fmtString);
});
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});
