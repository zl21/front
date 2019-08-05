import Login from '../__component__/Login';
import Content from '../__component__/Content';
import WelcomePage from '../__component__/WelcomePage';
import NetworkMonitor from '../__component__/NetworkMonitor';
import ComponentProtoType from '../__component__/ComponentPrototype';
import {
  CUSTOMIZED_MODULE_PREFIX,
  HORIZONTAL_TABLE_DETAIL_PREFIX,
  STANDARD_TABLE_LIST_PREFIX,
  VERTICAL_TABLE_DETAIL_PREFIX
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
        component: () => import(
          /* webpackChunkName: 'StandardTableKeepAlive' */
          /* webpackMode: 'eager' */
          '../__component__/StandardTableKeepAlive'
        ), // 标准界面
        meta: { routePrefix: STANDARD_TABLE_LIST_PREFIX }
      }, {
        path: `${HORIZONTAL_TABLE_DETAIL_PREFIX}/:tableName/:tableId/:itemId`,
        component: () => import(
          /* webpackChunkName: 'H.TableDetailKeepAlive' */
          /* webpackMode: 'eager' */
          '../__component__/H.TableDetailKeepAlive'
        ), // 左右结构的单对象界面
        meta: { routePrefix: HORIZONTAL_TABLE_DETAIL_PREFIX }
      }, {
        path: `${VERTICAL_TABLE_DETAIL_PREFIX}/:tableName/:tableId/:itemId`,
        component: () => import(
          /* webpackChunkName: 'V.TableDetailKeepAlive' */
          /* webpackMode: 'eager' */
          '../__component__/V.TableDetailKeepAlive'
        ), // 上下结构的单对象界面
        meta: { routePrefix: VERTICAL_TABLE_DETAIL_PREFIX }
      }, {
        path: `${CUSTOMIZED_MODULE_PREFIX}/:customizedModuleName/:customizedModuleId`,
        component: () => import(
          /* webpackChunkName: 'C.TableKeepAlive' */
          /* webpackMode: 'eager' */
          '../__component__/C.TableKeepAlive'
        ), // 定制界面
        meta: { routePrefix: CUSTOMIZED_MODULE_PREFIX }
      }, {
        path: '/NetworkMonitor',
        component: NetworkMonitor
      }]
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/ComponentPrototype',
    component: ComponentProtoType
  },
];

export default routes;
