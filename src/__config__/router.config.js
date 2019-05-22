import Vue from 'vue';
import VueRouter from 'vue-router';
import Login from '../__component__/Login';
import Content from '../__component__/Content';
import Dashboard from '../__component__/Dashboard';
import {
  STANDARD_TABLE_LIST_PREFIX,
  HORIZONTAL_TABLE_DETAIL_PREFIX,
  VERTICAL_TABLE_DETAIL_PREFIX,
  CUSTOMIZED_MODULE_PREFIX
} from '../constants/global';
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
        component: () => import('../__component__/StandardTableKeepAlive'),
        meta: { routePrefix: STANDARD_TABLE_LIST_PREFIX }
      }, {
        path: `${HORIZONTAL_TABLE_DETAIL_PREFIX}/:tableName/:tableId/:itemId`,
        component: () => import('../__component__/H.TableDetailKeepAlive'),
        meta: { routePrefix: HORIZONTAL_TABLE_DETAIL_PREFIX }
      }, {
        path: `${VERTICAL_TABLE_DETAIL_PREFIX}/:tableName/:tableId/:itemId`,
        component: () => import('../__component__/V.TableDetailKeepAlive'),
        meta: { routePrefix: VERTICAL_TABLE_DETAIL_PREFIX }
      }, {
        path: `${CUSTOMIZED_MODULE_PREFIX}/:customizedModuleName/:customizedModuleId`,
        component: () => import('../__component__/C.TableKeepAlive'),
        meta: { routePrefix: CUSTOMIZED_MODULE_PREFIX }
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
