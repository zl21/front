import store from './store.config';
import { STANDARD_TABLE_COMPONENT_PREFIX } from '../constants/global';
import standardTableListModule from './store/standardTableList.store';

export default (router) => {
  router.beforeEach((to, from, next) => {
    // Condition One: 路由到标准列表界面
    if (/\/SYSTEM\/TABLE\//.test(to.path)) {
      const { tableName, tableId } = to.params;
      const { commit } = store;
      const { keepAliveLists, openedMenuLists } = store.state.global;

      const keepAliveModuleName = `${STANDARD_TABLE_COMPONENT_PREFIX}.${tableName}.${tableId}`;

      // 处理 keepAliveModuleName
      if (!keepAliveLists.includes(keepAliveModuleName)) {
        commit('global/increaseKeepAliveLists', keepAliveModuleName);
      }

      // 处理 openedMenuLists
      if (openedMenuLists.filter(d => d.keepAliveModuleName === keepAliveModuleName).length === 0) {
        let tempInterval = -1;
        tempInterval = setInterval(() => {
          const ready = JSON.stringify(store.state.global.keepAliveLabelMaps) !== '{}';
          if (ready) {
            clearInterval(tempInterval);
            commit('global/increaseOpenedMenuLists', {
              label: store.state.global.keepAliveLabelMaps[keepAliveModuleName],
              keepAliveModuleName,
              type: to.path.split('/')[2],
              id: tableId,
              tableName,
              routeFullPath: to.path
            });
          }
        }, 50);
      } else {
        commit('global/againClickOpenedMenuLists', {
          label: store.state.global.keepAliveLabelMaps[keepAliveModuleName],
          keepAliveModuleName
        });
        commit('global/updateActiveMenu', keepAliveModuleName);
      }

      // 判断是否状态中已经存在某个模块，不存在则创建
      if (store.state[keepAliveModuleName] === undefined) {
        store.registerModule(keepAliveModuleName, standardTableListModule());
      }
    }
    next();
  });
};
