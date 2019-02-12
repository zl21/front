import VueRouter from 'vue-router';
import Login from '../../__component__/Login'
import Content from '../../__component__/Content';

const routes = [
  {
    path: '/',
    component: Content
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
