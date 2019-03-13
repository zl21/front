import Vue from 'vue';
import VueRouter from 'vue-router';
import Login from '../__component__/Login';
import Content from '../__component__/Content';
import Dashboard from '../__component__/Dashboard';
import { STANDARD_TABLE_LIST_PREFIX, STANDARD_SINGLE_OBJECT_PREFIX } from '../constants/global';
import navigationGuard from './router.navigation.guard';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    component: Content,
    children: [
      {
        path: '/',
        component: Dashboard
      }, {
        path: `${STANDARD_TABLE_LIST_PREFIX}/:tableName/:tableId`,
        component: () => import('../__component__/StandardTableKeepAlive')
      }, {
        path: `${STANDARD_SINGLE_OBJECT_PREFIX}`,
        component: () => import('../__component__/StandardSingleObject')
      }]
  },
  {
    path: '/login',
    component: Login
  }
];

const router = new VueRouter({
  routes,
  mode: 'history'
});

navigationGuard(router);

export default router;
