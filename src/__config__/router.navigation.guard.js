import store from './store.config';
import {
  STANDARD_TABLE_LIST_PREFIX,
  VERTICAL_TABLE_DETAIL_PREFIX,
  HORIZONTAL_TABLE_DETAIL_PREFIX,
  STANDARD_TABLE_COMPONENT_PREFIX,
  VERTICAL_TABLE_DETAIL_COMPONENT_PREFIX,
  HORIZONTAL_TABLE_DETAIL_COMPONENT_PREFIX,
  KEEP_MODULE_STATE_WHEN_CLICK_MENU,
} from '../constants/global';
import standardTableListModule from './store/standardTableList.store';
import verticalTableDetailModule from './store/verticalTableDetail';
import horizontalTableDetailModule from './store/horizontalTableDetail';

export default (router) => {
  router.beforeEach((to, from, next) => {
    const { commit } = store;
    const { keepAliveLists, openedMenuLists } = store.state.global;
    const { tableName, tableId, itemId } = to.params;
    const { routePrefix } = to.meta;
    const moduleGenerator = {
      [STANDARD_TABLE_COMPONENT_PREFIX]: standardTableListModule,
      [VERTICAL_TABLE_DETAIL_COMPONENT_PREFIX]: verticalTableDetailModule,
      [HORIZONTAL_TABLE_DETAIL_COMPONENT_PREFIX]: horizontalTableDetailModule,
    };
    const labelSuffix = {
      [STANDARD_TABLE_COMPONENT_PREFIX]: '',
      [VERTICAL_TABLE_DETAIL_COMPONENT_PREFIX]: '编辑',
      [HORIZONTAL_TABLE_DETAIL_COMPONENT_PREFIX]: '编辑',
    };
    let dynamicModuleTag = '';
    let keepAliveModuleName = '';
    const originModuleName = `${STANDARD_TABLE_COMPONENT_PREFIX}.${tableName}.${tableId}`;

    switch (routePrefix) {
      // Condition One: 路由到标准列表界面名称
      case STANDARD_TABLE_LIST_PREFIX:
        keepAliveModuleName = `${STANDARD_TABLE_COMPONENT_PREFIX}.${tableName}.${tableId}`;
        dynamicModuleTag = STANDARD_TABLE_COMPONENT_PREFIX;
        break;

      // Condition Three: 路由到左右Tab页签切换（横向布局）的列表明细界面名称
      case VERTICAL_TABLE_DETAIL_PREFIX:
        keepAliveModuleName = `${VERTICAL_TABLE_DETAIL_COMPONENT_PREFIX}.${tableName}.${tableId}.${itemId}`;
        dynamicModuleTag = VERTICAL_TABLE_DETAIL_COMPONENT_PREFIX;
        break;

      // Condition Three: 路由到table类型的列表明细界面名称
      case HORIZONTAL_TABLE_DETAIL_PREFIX:
        keepAliveModuleName = `${HORIZONTAL_TABLE_DETAIL_COMPONENT_PREFIX}.${tableName}.${tableId}.${itemId}`;
        dynamicModuleTag = HORIZONTAL_TABLE_DETAIL_COMPONENT_PREFIX;
        break;

      default:
        break;
    }

    // 处理 keepAliveModuleName
    if (!keepAliveLists.includes(keepAliveModuleName)) {
      commit('global/increaseKeepAliveLists', keepAliveModuleName);
    }

    // 判断是否状态中已经存在某个模块，不存在则创建
    if (dynamicModuleTag !== '' && store.state[keepAliveModuleName] === undefined) {
      store.registerModule(keepAliveModuleName, moduleGenerator[dynamicModuleTag]());
    }

    // 处理 openedMenuLists
    let existModuleIndex = -1;
    const existModule = openedMenuLists.filter((d, i) => {
      if (d.tableName === tableName) {
        existModuleIndex = i;
        return true;
      }
      return false;
    })[0];

    if (KEEP_MODULE_STATE_WHEN_CLICK_MENU && routePrefix === STANDARD_TABLE_LIST_PREFIX && existModule) {
      // 判断：当前路由是通过按钮菜单触发，并且页面中已经存在改菜单按钮对应的模块。
      openedMenuLists[existModuleIndex].isActive = true;
      return;
    }

    if (dynamicModuleTag !== '' && openedMenuLists.filter(d => d.keepAliveModuleName === keepAliveModuleName).length === 0) {
      let tempInterval = -1;
      tempInterval = setInterval(() => {
        const ready = JSON.stringify(store.state.global.keepAliveLabelMaps) !== '{}';
        if (ready) {
          clearInterval(tempInterval);
          commit('global/increaseOpenedMenuLists', {
            label: `${store.state.global.keepAliveLabelMaps[originModuleName]}${labelSuffix[dynamicModuleTag]}`,
            keepAliveModuleName,
            tableName,
            routeFullPath: to.path,
            routePrefix
          });
        }
      }, 25);
    } else {
      commit('global/againClickOpenedMenuLists', {
        label: `${store.state.global.keepAliveLabelMaps[originModuleName]}${labelSuffix[dynamicModuleTag]}`,
        keepAliveModuleName
      });
      commit('global/updateActiveMenu', keepAliveModuleName);
    }

    next();
  });
};
