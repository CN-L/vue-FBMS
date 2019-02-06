// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App';
import router from './router';
import '@/assets/css/index.css';
import moment from 'moment';
import myrequire from '@/assets/js/require';
import myBreadcrumb from '@/components/my-breadcrumb';
Vue.use(ElementUI);
Vue.use(myrequire);
Vue.config.productionTip = false;
/* eslint-disable no-new */
// 注册全局组件
Vue.component(myBreadcrumb.name, myBreadcrumb);
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
