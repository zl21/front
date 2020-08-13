import store from './store.config';
import router from './router.config';
import { getUrl } from '../__utils__/url';


import {
  STANDARD_TABLE_LIST_PREFIX,
  PLUGIN_MODULE_PREFIX,
  LINK_MODULE_PREFIX,
  STANDARD_COMMONTABLE_LIST_PREFIX
} from '../constants/global';

export const hideMenu = () => {
  document.body.addEventListener('click', () => {
    if (store.state.global.primaryMenuIndex !== -1) {
      store.commit('global/hideMenu');
    }
  });
};

export const launchNetworkMonitor = () => {
  window.addEventListener('keydown', (e) => {
    if (e.altKey && e.key.toLowerCase() === 'n') {
      router.push({
        path: `${PLUGIN_MODULE_PREFIX}/NETWORKMONITOR`
      });
    }
  });
};

/**
 *  主要用于点击菜单的路由跳转
 * @param type 路由目标类型
 * @param info 路由目标信息 { tableName: "表名|自定义界面组件名", tableId: "表ID|自定义界面动作定义ID" }
 * @param cb   回调函数
 */
export const routeTo = ({ type, info }, cb) => {
  if (typeof cb === 'function') { cb(); }
  let path = '/';
  let query = {};
  // type = 'commonTable';
  // type = 'tree';
  switch (type) {
    case 'action':
      if (info.url) {
        const actionType = info.url.substring(0, info.url.indexOf('/'));
        if (actionType === 'SYSTEM') {
          path = `/${info.url}`;
        } else if (actionType === 'https:' || actionType === 'http:') {
          path = `${LINK_MODULE_PREFIX}/${info.tableName.toUpperCase()}/${info.tableId}`;
        } else if (actionType.toUpperCase() === 'CUSTOMIZED') {
          path = getUrl({ url: info.url, id: info.tableId, type: 'customized' });
        } else {
          class Person {
            constructor(wrong, eg, url) {
              this.wrong = wrong;
              this.correctURL = eg;
              this.url = url;
            }
          }
          const me = new Person('url配置错误', 'SYSTEM/TABLE_DETAIL/V/DL_B_PUR/23792/New', info.url);
          console.table(me);
        }
      }
      break;
    case 'table':
      path = `${STANDARD_TABLE_LIST_PREFIX}/${info.tableName}/${info.tableId}`;
      break;
    case 'tree':
      path = `${STANDARD_TABLE_LIST_PREFIX}/${info.tableName}/${info.tableId}`;
      query = {
        isTreeTable: true
      };
      break; 
    case 'commonTable':
      path = `${STANDARD_COMMONTABLE_LIST_PREFIX}/${info.tableName}/${info.tableId}`;
      break; 

    // case 'external':
    //   path = `${LINK_MODULE_PREFIX}/${info.tableName.toUpperCase()}/${info.tableId}`;
    //   break;
    default:
      break;
  }
  if (router.currentRoute.fullPath !== path) {
    router.push({ path, query }).catch((e) => { console.error('当前单据已打开'); });
  }
};

export const menuClick = (data, cb) => {
  if (typeof cb === 'function') { cb(); }
  const {
    type, value, id, url 
  } = data;
  routeTo({ type, info: { tableName: value, tableId: id, url } }, cb);
};

export default { hideMenu, routeTo, menuClick };
