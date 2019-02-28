import store from './store.config';
import { STANDARD_TABLE_COMPONENT_PREFIX } from '../constants/global';

export default (router) => {
  router.beforeEach((to, from, next) => {
    // Condition One: 路由到标准列表界面
    if (to.path.match(/\/SYSTEM\/TABLE\//)) {
      const { tableName, tableId } = to.params;
      store.commit('global/increaseKeepAliveLists', `${STANDARD_TABLE_COMPONENT_PREFIX}.${tableName}.${tableId}`);
    }
    next();
  });
};
