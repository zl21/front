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
      [VERTICAL_TABLE_DETAIL_COMPONENT_PREFIX]: Number(itemId) === -1 ? '新增' : '编辑',
      [HORIZONTAL_TABLE_DETAIL_COMPONENT_PREFIX]: Number(itemId) === -1 ? '新增' : '编辑',
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
    if (!keepAliveLists.includes(keepAliveModuleName) && keepAliveModuleName !== '') {
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
        // 已存在打开的模块界面，但是并不是同一个界面
        existModuleIndex = i;
        return true;
      }
      return false;
    })[0];


    // 跳转到菜单默认配置的路由信息时的判断逻辑
    // 1、保留模块状态,模式为[启用],   且
    // 2、目标路由为[列表]界面,   且
    // 3、当前已经打开的菜单模块中含有同tableName的界面
    // 则 此时应该唤起已有的功能界面。
    if (KEEP_MODULE_STATE_WHEN_CLICK_MENU && routePrefix === STANDARD_TABLE_LIST_PREFIX && existModule) {
      const isBackToTableList = existModule !== STANDARD_TABLE_LIST_PREFIX && from.fullPath === existModule.routeFullPath; // 表示从明细界面跳转到列表界面。
      const isArouseTableList = to.fullPath === existModule.routeFullPath; // 当前打开的模块中，已经存在相同的路由模块。
      console.log({ isBackToTableList, isArouseTableList });
      if (!isArouseTableList && !isBackToTableList) {
        // 判断：当前路由是通过按钮菜单触发，并且页面中已经存在改菜单按钮对应的模块。
        commit('global/toggleActiveMenu', existModuleIndex);
        next({ path: existModule.routeFullPath });
        return;
      }
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
