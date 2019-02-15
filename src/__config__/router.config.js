import Vue from 'vue';
import VueRouter from 'vue-router';
import Login from '../__component__/Login';
import Content from '../__component__/Content';
import Dashboard from '../__component__/Dashboard';
import StandardModuleContainer from '../__component__/StandardTableKeepAlive';
import StandardSingleObject from '../__component__/StandardSingleObject';
import { STANDARD_TABLE_LIST_PREFIX, STANDARD_SINGLE_OBJECT_PREFIX } from '../constants/global';

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
        component: StandardModuleContainer
      }, {
        path: `${STANDARD_SINGLE_OBJECT_PREFIX}`,
        component: StandardSingleObject
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
