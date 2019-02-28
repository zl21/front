import store from './store.config';
import router from './router.config';
import {
  STANDARD_TABLE_LIST_PREFIX,
  STANDARD_SINGLE_OBJECT_PREFIX
} from '../constants/global';

export const hideMenu = () => {
  document.body.addEventListener('click', () => {
    store.commit('global/hideMenu');
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
    case 'table':
      router.push({
        path: `${STANDARD_TABLE_LIST_PREFIX}/${info.tableName}/${info.tableId}`,
      });
      break;
    default:
      router.push({
        path: `${STANDARD_SINGLE_OBJECT_PREFIX}`,
      });
      break;
  }
};

export default { hideMenu, routeTo };
