import Vue from 'vue';
import VueRouter from 'vue-router';
import Login from '../__component__/Login';
import Content from '../__component__/Content';
import Dashboard from '../__component__/Dashboard';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    component: Content,
    children: [
      {
        path: '/',
        component: Dashboard
      }]
  },
  {
    path: '/login',
    component: Login
  }
];

export default new VueRouter({
  routes,
  mode: 'history'
});
