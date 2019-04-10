import store from './store.config';
import {
  STANDARD_TABLE_COMPONENT_PREFIX,
  VERTICAL_TABLE_DETAIL_COMPONENT_PREFIX,
  HORIZONTAL_TABLE_DETAIL_COMPONENT_PREFIX
} from '../constants/global';
import standardTableListModule from './store/standardTableList.store';
import verticalTableDetailModule from './store/verticalTableDetail';
import horizontalTableDetailModule from './store/horizontalTableDetail';

export default (router) => {
  router.beforeEach((to, from, next) => {
    const { commit } = store;
    const { keepAliveLists, openedMenuLists } = store.state.global;
    const { tableName, tableId, itemId } = to.params;
    // Condition One: 路由到标准列表界面
    if (/\/SYSTEM\/TABLE\//.test(to.path)) {
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

    // Condition Two: 路由到上下结构（纵向布局）的列表明细界面
    if (/\/SYSTEM\/TABLE_DETAIL\/V\//.test(to.path)) {
      const keepAliveModuleName = `${VERTICAL_TABLE_DETAIL_COMPONENT_PREFIX}.${tableName}.${tableId}.${itemId}`;

      // 处理 keepAliveModuleName
      if (!keepAliveLists.includes(keepAliveModuleName)) {
        commit('global/increaseKeepAliveLists', keepAliveModuleName);
      }
      
      // 处理 openedMenuLists
      if (openedMenuLists.length === 0) {
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
      }
      

      // 判断是否状态中已经存在某个模块，不存在则创建
      if (store.state[keepAliveModuleName] === undefined) {
        store.registerModule(keepAliveModuleName, verticalTableDetailModule());
      }
    }

    // Condition Three: 路由到左右Tab页签切换（横向布局）的列表明细界面
    if (/\/SYSTEM\/TABLE_DETAIL\/H\//.test(to.path)) {
      const keepAliveModuleName = `${HORIZONTAL_TABLE_DETAIL_COMPONENT_PREFIX}.${tableName}.${tableId}.${itemId}`;

      // 处理 keepAliveModuleName
      if (!keepAliveLists.includes(keepAliveModuleName)) {
        commit('global/increaseKeepAliveLists', keepAliveModuleName);
      }
     
      // 处理 openedMenuLists
      if (openedMenuLists.length === 0) {
        let tempInterval = -1;
        tempInterval = setInterval(() => {
          const ready = JSON.stringify(store.state.global.keepAliveLabelMaps) !== '{}';
          if (ready) {
            let label = '';
            Object.keys(store.state.global.keepAliveLabelMaps).forEach((item) => {
              if (item.indexOf(`${tableName}.${tableId}`) !== -1) { 
                label = store.state.global.keepAliveLabelMaps[item];
              }
            });   
            clearInterval(tempInterval);
            commit('global/increaseOpenedMenuLists', {
              label,
              keepAliveModuleName,
              type: to.path.split('/')[2],
              id: tableId,
              tableName,
              routeFullPath: to.path
            });
          }
        }, 0);
      }
      
      // 判断是否状态中已经存在某个模块，不存在则创建
      if (store.state[keepAliveModuleName] === undefined) {
        store.registerModule(keepAliveModuleName, horizontalTableDetailModule());
      }
    }
    next();
  });
};
