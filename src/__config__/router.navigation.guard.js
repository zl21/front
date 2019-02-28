import store from './store.config';
import { STANDARD_TABLE_COMPONENT_PREFIX } from '../constants/global';

export default (router) => {
  router.beforeEach((to, from, next) => {
    // Condition One: 路由到标准列表界面
    if (to.path.match(/\/SYSTEM\/TABLE\//)) {
      const { tableName, tableId } = to.params;
      const { commit } = store;
      const { keepAliveLists, openedMenuLists } = store.state.global;

      const keepAliveModuleName = `${STANDARD_TABLE_COMPONENT_PREFIX}.${tableName}.${tableId}`;
      if (!keepAliveLists.includes(keepAliveModuleName)) {
        commit('global/increaseKeepAliveLists', keepAliveModuleName);
      }
      if (openedMenuLists.filter(d => d.keepAliveModuleName === keepAliveModuleName).length === 0) {
        let tempInterval = -1;
        tempInterval = setInterval(() => {
          const ready = JSON.stringify(store.state.global.keepAliveLabelMaps) !== '{}';
          if (ready) {
            clearInterval(tempInterval);
            clearInterval(tempInterval);
            commit('global/increaseOpenedMenuLists', {
              label: store.state.global.keepAliveLabelMaps[keepAliveModuleName],
              keepAliveModuleName
            });
          }
        }, 100);
      }
    }

    next();
  });
};
