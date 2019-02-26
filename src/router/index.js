import Vue from 'vue';
import Router from 'vue-router';
import Login from '@/views/Login';
import Home from '@/views/Home';
import Users from '@/views/users/Users';
import { Message } from 'element-ui';
import Authority from '@/views/authority/authority';
import Roles from '@/views/authority/roles';
import Categories from '@/views/goods/Categories';
import Goods from '@/views/goods/Goods';
import addList from '@/views/goods/addList';
import params from '@/views/goods/Params';
Vue.use(Router);

let router = new Router({
  routes: [
    { name: 'login', path: '/login', component: Login },
    //  嵌套路由
    {
      name: 'home',
      path: '/',
      component: Home,
      children: [
        { name: 'users', path: '/users', component: Users },
        { name: 'rights', path: '/rights', component: Authority },
        { name: 'roles', path: '/roles', component: Roles },
        { name: 'categories', path: '/categories', component: Categories },
        { name: 'goods', path: '/goods', component: Goods },
        { name: 'goodsadd', path: '/goods/add', component: addList },
        { name: 'params', path: '/params',component: params}
      ]
    }
  ]
});
// 路由的全局前置守卫（拦截器）--路由跳转之前执行 验证是否有携带token权限
router.beforeEach((to, from, next) => {
  // 如果是登陆时候不用判断token 根据路由name值
  if (to.name !== 'login') {
    let token = sessionStorage.getItem('token');
    // 如果没有token，跳转登陆页面
    if (!token) {
      Message.success('请先登陆');
      router.push('login');
      return;
    }
  }
  next();
});
export default router;
