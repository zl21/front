import Login from '../__component__/Login';
import Content from '../__component__/ContentTemplate.vue';
import WelcomePage from '../__component__/WelcomePage';
import ComponentProtoType from '../__component__/ComponentPrototype';
import AutomaticPathGeneration from '../__component__/AutomaticPathGeneration';
import KeepAliveContainer from '../__component__/KeepAliveContainer';
import {
  CUSTOMIZED_MODULE_PREFIX,
  HORIZONTAL_TABLE_DETAIL_PREFIX,
  STANDARD_TABLE_LIST_PREFIX,
  STANDARD_COMMONTABLE_LIST_PREFIX,
  VERTICAL_TABLE_DETAIL_PREFIX,
  PLUGIN_MODULE_PREFIX,
  LINK_MODULE_PREFIX,
} from '../constants/global';

const routes = [
  {
    path: '/',
    component: Content,
    children: [
      {
        path: '/',
        component: WelcomePage
      }, {
        path: `${STANDARD_TABLE_LIST_PREFIX}/:tableName/:tableId`, //
        component: KeepAliveContainer,
        // component: () => import(
        //   /* webpackChunkName: 'StandardTableKeepAlive' */
        //   /* webpackMode: 'eager' */
        //   '../__component__/StandardTableKeepAlive'
        // ), // 标准界面
        meta: { routePrefix: STANDARD_TABLE_LIST_PREFIX }
      }, {
        path: `${STANDARD_COMMONTABLE_LIST_PREFIX}/:tableName/:tableId`, //
        component: KeepAliveContainer,
        // component: () => import(
        //   /* webpackChunkName: 'StandardTableKeepAlive' */
        //   /* webpackMode: 'eager' */
        //   '../__component__/StandardTableKeepAlive'
        // ), // 标准界面(普通表格)
        meta: { routePrefix: STANDARD_COMMONTABLE_LIST_PREFIX }
      }, {
        path: `${HORIZONTAL_TABLE_DETAIL_PREFIX}/:tableName/:tableId/:itemId`,
        component: KeepAliveContainer,
        // component: () => import(
        //   /* webpackChunkName: 'H.TableDetailKeepAlive' */
        //   /* webpackMode: 'eager' */
        //   '../__component__/H.TableDetailKeepAlive'
        // ), // 左右结构的单对象界面
        meta: { routePrefix: HORIZONTAL_TABLE_DETAIL_PREFIX }
      }, {
        path: `${VERTICAL_TABLE_DETAIL_PREFIX}/:tableName/:tableId/:itemId`,
        component: KeepAliveContainer,
        // component: () => import(
        //   /* webpackChunkName: 'V.TableDetailKeepAlive' */
        //   /* webpackMode: 'eager' */
        //   '../__component__/V.TableDetailKeepAlive'
        // ), // 上下结构的单对象界面
        meta: { routePrefix: VERTICAL_TABLE_DETAIL_PREFIX } 
      }, {
        path: `${CUSTOMIZED_MODULE_PREFIX}/:customizedModuleName/:customizedModuleId`,
        component: KeepAliveContainer,
        // component: () => import(
        //   /* webpackChunkName: 'C.TableKeepAlive' */
        //   /* webpackMode: 'eager' */
        //   '../__component__/C.TableKeepAlive'
        // ), // 定制界面
        meta: { routePrefix: CUSTOMIZED_MODULE_PREFIX }
      }, {
        path: `${PLUGIN_MODULE_PREFIX}/:pluginModuleName`,
        component: KeepAliveContainer,
        // component: () => import(
        //   /* webpackChunkName: 'P.KeepAlive' */
        //   /* webpackMode: 'eager' */
        //   '../__component__/P.KeepAlive'
        // ), // 定制界面
        meta: { routePrefix: PLUGIN_MODULE_PREFIX }
      }, {
        path: `${LINK_MODULE_PREFIX}/:linkModuleName/:linkModuleId`,
        component: KeepAliveContainer,
        // component: () => import(
        //   /* webpackChunkName: 'P.KeepAlive' */
        //   /* webpackMode: 'eager' */
        //   '../__component__/L.KeepAlive'
        // ), // 外链界面
        meta: { routePrefix: LINK_MODULE_PREFIX },
      }]
  },
  {
    path: '/Login',
    component: Login
  },
  {
    path: '/ComponentPrototype',
    component: ComponentProtoType
  },
  {
    path: '/AutomaticPathGeneration',
    component: AutomaticPathGeneration
  }
  
];
export default routes;
