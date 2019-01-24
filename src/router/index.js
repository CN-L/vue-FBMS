import Vue from 'vue';
import Router from 'vue-router';
import Login from '@/views/Login';
import Home from '@/views/Home';
import Users from '@/views/users/Users';
import Authority from '@/views/authority/authority';
import Roles from '@/views/authority/roles';

Vue.use(Router);

export default new Router({
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
        { name: 'roles', path: '/roles', component: Roles }
      ]
    }
  ]
});
