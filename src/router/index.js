import Vue from 'vue';
import Router from 'vue-router';
import Login from '@/views/Login';
import Home from '@/views/Home';
Vue.use(Router);

export default new Router({
  routes: [

    { name: 'home', path: '/', component: Home },
    { name: 'login', path: '/login', component: Login }

  ]
});
