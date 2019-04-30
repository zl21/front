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
    const { isBack } = to.query;
    const moduleGenerator = {
      [STANDARD_TABLE_COMPONENT_PREFIX]: standardTableListModule,
      [VERTICAL_TABLE_DETAIL_COMPONENT_PREFIX]: verticalTableDetailModule,
      [HORIZONTAL_TABLE_DETAIL_COMPONENT_PREFIX]: horizontalTableDetailModule,
    };
    const labelSuffix = {
      [STANDARD_TABLE_COMPONENT_PREFIX]: '',
      [VERTICAL_TABLE_DETAIL_COMPONENT_PREFIX]: itemId === 'New' ? '新增' : '编辑',
      [HORIZONTAL_TABLE_DETAIL_COMPONENT_PREFIX]: itemId === 'New' ? '新增' : '编辑',
    };
    const paramItemId = String(itemId) === '-1' ? 'New' : `${itemId}`;
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
        keepAliveModuleName = `${VERTICAL_TABLE_DETAIL_COMPONENT_PREFIX}.${tableName}.${tableId}.${paramItemId}`;
        dynamicModuleTag = VERTICAL_TABLE_DETAIL_COMPONENT_PREFIX;
        break;

      // Condition Three: 路由到table类型的列表明细界面名称
      case HORIZONTAL_TABLE_DETAIL_PREFIX:
        keepAliveModuleName = `${HORIZONTAL_TABLE_DETAIL_COMPONENT_PREFIX}.${tableName}.${tableId}.${paramItemId}`;
        dynamicModuleTag = HORIZONTAL_TABLE_DETAIL_COMPONENT_PREFIX;
        break;

      default:
        break;
    }

    // 处理 keepAliveModuleName：目标路由的模块默认都要加入keepAlive列表
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

    // 处理openedMenuList的存储逻辑
    // console.log(`
    //     routerPrefix = \t\t\t${routePrefix}
    //     existModuleFullPath =\t${existModule ? existModule.routeFullPath : ''}
    //     from.fullPath =\t\t\t${from.fullPath}
    //     to.fullPath =\t\t\t${to.fullPath}
    //     to.path = \t\t\t${to.path}
    // `);
    if (existModuleIndex !== -1 && KEEP_MODULE_STATE_WHEN_CLICK_MENU) {
      // Condition One:
      // 如果目标路由界面所对应的[表]已经存在与已经打开的菜单列表中(不论其当前是列表状态还是编辑状态)
      // 则都应该显示其当前对应的状态页。
      if (routePrefix === STANDARD_TABLE_LIST_PREFIX && existModule.routePrefix !== STANDARD_TABLE_LIST_PREFIX && !isBack) {
        // Step One: 处理菜单Tab页签的显示逻辑。
        commit('global/forceUpdateOpenedMenuLists', {
          openedMenuInfo: Object.assign({}, existModule, { isActive: true }),
          index: existModuleIndex
        });
        // Step Two: 按照用户所点击的路由原意进行跳转。
        next({ path: existModule.routeFullPath });
      } else {
        // Step One: 处理菜单Tab页签的显示逻辑。
        commit('global/forceUpdateOpenedMenuLists', {
          openedMenuInfo: {
            isActive: true,
            label: `${store.state.global.keepAliveLabelMaps[originModuleName]}${labelSuffix[dynamicModuleTag]}`,
            keepAliveModuleName,
            tableName,
            routeFullPath: to.path,
            routePrefix
          },
          index: existModuleIndex
        });
        // Step Two: 按照用户所点击的路由原意进行跳转。
        next();
      }
      // Step Three: 结束本次路由守卫。
      return;
    }

    if (dynamicModuleTag !== '' && openedMenuLists.filter(d => d.keepAliveModuleName === keepAliveModuleName).length === 0) {
      // 目标路由所对应的[功能模块]没有存在与openedMenuLists中，则将目标路由应该对应的模块信息写入openedMenuLists
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
      // 目标路由所对应的[功能模块]已经存在与openedMenuList中，则将需要处理openedMenuList中相匹配的索引值的激活状态。
      // eslint-disable-next-line no-lonely-if
      if (to.path !== '/') {
        commit('global/againClickOpenedMenuLists', {
          label: `${store.state.global.keepAliveLabelMaps[originModuleName]}${labelSuffix[dynamicModuleTag]}`,
          keepAliveModuleName
        });
      }
    }

    next();
  });
};
