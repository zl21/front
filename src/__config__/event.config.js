import store from './store.config';
import router from './router.config';
import {
  HORIZONTAL_TABLE_DETAIL_PREFIX,
  STANDARD_TABLE_LIST_PREFIX, VERTICAL_TABLE_DETAIL_PREFIX,
} from '../constants/global';

export const hideMenu = () => {
  document.body.addEventListener('click', () => {
    if (store.state.global.primaryMenuIndex !== -1) {
      store.commit('global/hideMenu');
    }
  });
};

/**
 *
 * @param type 路由目标类型
 * @param info 路由目标信息
 * @param cb   回调函数
 */
export const routeTo = ({ type, info }, cb) => {
  if (typeof cb === 'function') { cb(); }
  switch (type) {
    case 'tableDetailAction':
      router.push({
        path: `${info.moduleName}/${info.tableName}/${info.tableId}`,
      });
      break;
    case 'table':
      router.push({
        path: `${STANDARD_TABLE_LIST_PREFIX}/${info.tableName}/${info.tableId}`,
      });
      break;
    case 'tableDetailVertical':
      router.push({
        path: `${VERTICAL_TABLE_DETAIL_PREFIX}/${info.tableName}/${info.tableId}/${info.itemId}`,
      });
      break;
    case 'tableDetailHorizontal':
      router.push({
        path: `${HORIZONTAL_TABLE_DETAIL_PREFIX}/${info.tableName}/${info.tableId}/${info.itemId}`,
      });
      break;
  
    default:
      router.push({
        path: '/',
      });
      break;
  }
};

export default { hideMenu, routeTo };
