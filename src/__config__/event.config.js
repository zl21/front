import store from './store.config';
import router from './router.config';

import {
  STANDARD_TABLE_LIST_PREFIX,
  CUSTOMIZED_MODULE_PREFIX,
  PLUGIN_MODULE_PREFIX,
  LINK_MODULE_PREFIX,

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
  switch (type) {
    case 'action':
      router.push({
        path: `${CUSTOMIZED_MODULE_PREFIX}/${info.tableName.toUpperCase()}/${info.tableId}`,
      });
      break;
    case 'table':
      router.push({
        path: `${STANDARD_TABLE_LIST_PREFIX}/${info.tableName}/${info.tableId}`,
      });
      break;
    case 'external':
      router.push({
        path: `${LINK_MODULE_PREFIX}/${info.tableName.toUpperCase()}/${info.tableId}`,
      });
      break;
    default:
      router.push({
        path: '/',
      });
      break;
  }
};

export const menuClick = (data, cb) => {
  if (typeof cb === 'function') { cb(); }
  const {
    type, value, id, vuedisplay 
  } = data;
  routeTo({ type: vuedisplay && vuedisplay === 'external' ? vuedisplay : type, info: { tableName: value, tableId: id } }, cb);
};

export default { hideMenu, routeTo, menuClick };
