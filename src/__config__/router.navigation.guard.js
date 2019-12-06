import store from './store.config';
import {
  CUSTOMIZED_MODULE_PREFIX,
  STANDARD_TABLE_LIST_PREFIX,
  VERTICAL_TABLE_DETAIL_PREFIX,
  HORIZONTAL_TABLE_DETAIL_PREFIX,
  STANDARD_TABLE_COMPONENT_PREFIX,
  CUSTOMIZED_MODULE_COMPONENT_PREFIX,
  VERTICAL_TABLE_DETAIL_COMPONENT_PREFIX,
  HORIZONTAL_TABLE_DETAIL_COMPONENT_PREFIX,
  KEEP_MODULE_STATE_WHEN_CLICK_MENU,
  PLUGIN_MODULE_PREFIX,
  PLUGIN_MODULE_COMPONENT_PREFIX,
  LINK_MODULE_PREFIX,
  LINK_MODULE_COMPONENT_PREFIX
} from '../constants/global';
import standardTableListModule from './store/standardTableList.store';
import verticalTableDetailModule from './store/verticalTableDetail';
import horizontalTableDetailModule from './store/horizontalTableDetail';
import PluginModule from './plugin.config';
import { updateSessionObject } from '../__utils__/sessionStorage';


const pluginModules = {};

const getKeepAliveModuleName = (routeInfo) => {
  const {
    tableName, tableId, itemId, customizedModuleName, customizedModuleId, pluginModuleName, linkModuleName
  } = routeInfo.params;
  const paramItemId = String(itemId) === '-1' ? 'New' : `${itemId}`;
  let keepAliveModuleName = '';
  const { routePrefix } = routeInfo.meta;
  switch (routePrefix) {
    // Condition One: 路由到标准列表界面名称
    case STANDARD_TABLE_LIST_PREFIX:
      keepAliveModuleName = `${STANDARD_TABLE_COMPONENT_PREFIX}.${tableName}.${tableId}`;
      break;

    // Condition Two: 路由到左右Tab页签切换（纵向布局）的列表明细界面
    case VERTICAL_TABLE_DETAIL_PREFIX:
      keepAliveModuleName = `${VERTICAL_TABLE_DETAIL_COMPONENT_PREFIX}.${tableName}.${tableId}.${paramItemId}`;
      break;

    // Condition Three: 路由到左右Tab页签切换（横向布局）的列表明细界面
    case HORIZONTAL_TABLE_DETAIL_PREFIX:
      keepAliveModuleName = `${HORIZONTAL_TABLE_DETAIL_COMPONENT_PREFIX}.${tableName}.${tableId}.${paramItemId}`;
      break;

    // Condition Four: 路由到用户自定义界面
    case CUSTOMIZED_MODULE_PREFIX:
      keepAliveModuleName = `${CUSTOMIZED_MODULE_COMPONENT_PREFIX}.${customizedModuleName}.${customizedModuleId}`;
      break;

    // Condition Five: 路由到插件界面
    case PLUGIN_MODULE_PREFIX:
      keepAliveModuleName = `${PLUGIN_MODULE_COMPONENT_PREFIX}.${pluginModuleName}`;
      break;

    // Condition Five: 路由到外链界面
    case LINK_MODULE_PREFIX:
      keepAliveModuleName = `${LINK_MODULE_COMPONENT_PREFIX}.${linkModuleName}`;
      break;

    default:
      break;
  }
  return keepAliveModuleName;
};

const getDynamicModuleTag = (to) => {
  const { routePrefix } = to.meta;
  let dynamicModuleTag = '';
  switch (routePrefix) {
    // Condition One: 路由到标准列表界面名称
    case STANDARD_TABLE_LIST_PREFIX:
      dynamicModuleTag = STANDARD_TABLE_COMPONENT_PREFIX;
      break;

    // Condition Two: 路由到左右Tab页签切换（纵向布局）的列表明细界面
    case VERTICAL_TABLE_DETAIL_PREFIX:
      dynamicModuleTag = VERTICAL_TABLE_DETAIL_COMPONENT_PREFIX;
      break;

    // Condition Three: 路由到左右Tab页签切换（横向布局）的列表明细界面
    case HORIZONTAL_TABLE_DETAIL_PREFIX:
      dynamicModuleTag = HORIZONTAL_TABLE_DETAIL_COMPONENT_PREFIX;
      break;

    // Condition Four: 路由到用户自定义界面
    case CUSTOMIZED_MODULE_PREFIX:
      dynamicModuleTag = CUSTOMIZED_MODULE_COMPONENT_PREFIX;
      break;

    // Condition Five: 路由到插件界面
    case PLUGIN_MODULE_PREFIX:
      dynamicModuleTag = PLUGIN_MODULE_COMPONENT_PREFIX;
      break;

    // Condition Five: 路由到外链界面
    case LINK_MODULE_PREFIX:
      dynamicModuleTag = LINK_MODULE_COMPONENT_PREFIX;
      break;

    default:
      break;
  }
  return dynamicModuleTag;
};

const getOriginModuleName = (to) => {
  const {
    tableName, tableId, customizedModuleName, customizedModuleId, linkModuleName, linkModuleId
  } = to.params;
  const { routePrefix } = to.meta;
  let originModuleName = '';
  switch (routePrefix) {
    case CUSTOMIZED_MODULE_PREFIX:
      originModuleName = `${CUSTOMIZED_MODULE_COMPONENT_PREFIX}.${customizedModuleName}.${customizedModuleId}`;
      break;

    case LINK_MODULE_PREFIX:
      originModuleName = `${LINK_MODULE_COMPONENT_PREFIX}.${linkModuleName}.${linkModuleId}`;
      break;

    default:
      originModuleName = `${STANDARD_TABLE_COMPONENT_PREFIX}.${tableName}.${tableId}`;
  }
  return originModuleName;
};

Object.keys(PluginModule).forEach((key) => {
  pluginModules[key.toUpperCase()] = PluginModule[key];
});

export default (router) => {
  router.beforeEach((to, from, next) => {
    if (router.getMatchedComponents(to.path).length === 0) {
      next('/');
    }
    const { commit } = store;
    const { keepAliveLists, openedMenuLists } = store.state.global;
    const {
      tableName, tableId, itemId, customizedModuleName, pluginModuleName, linkModuleName,
    } = to.params;
    const preventRegisterModule = [CUSTOMIZED_MODULE_PREFIX, PLUGIN_MODULE_PREFIX, LINK_MODULE_PREFIX];
    const { routePrefix } = to.meta;
    const { isBack } = to.query;
    const moduleGenerator = {
      [STANDARD_TABLE_COMPONENT_PREFIX]: standardTableListModule,
      [VERTICAL_TABLE_DETAIL_COMPONENT_PREFIX]: verticalTableDetailModule,
      [HORIZONTAL_TABLE_DETAIL_COMPONENT_PREFIX]: horizontalTableDetailModule,
    };
    const labelSuffix = {
      [CUSTOMIZED_MODULE_COMPONENT_PREFIX]: '',
      [LINK_MODULE_COMPONENT_PREFIX]: '',
      [STANDARD_TABLE_COMPONENT_PREFIX]: '',
      [VERTICAL_TABLE_DETAIL_COMPONENT_PREFIX]: itemId === 'New' ? '新增' : '编辑',
      [HORIZONTAL_TABLE_DETAIL_COMPONENT_PREFIX]: itemId === 'New' ? '新增' : '编辑',
    };
    const paramItemId = String(itemId) === '-1' ? 'New' : `${itemId}`;
    const paramTableId = tableId;
    const fromParamItemId = String(from.params.itemId) === '-1' ? 'New' : `${from.params.itemId}`;
    const fromParamTableId = from.params.tableId;

   
    const fromKeepAliveModuleName = getKeepAliveModuleName(from); // 来源字段的keepAliveModuleName，即模块的moduleComponentName
    const originModuleName = getOriginModuleName(to); // 单对象界面对应的原标准列表界面的moduleComponentName
    const keepAliveModuleName = getKeepAliveModuleName(to); // 当前界面对应的keepAliveModuleName，即模块的moduleComponentName
    const dynamicModuleTag = getDynamicModuleTag(to); // 当前界面对应的路由标识。

    // 处理 keepAliveModuleName：目标路由的模块默认都要加入keepAlive列表
    if (!keepAliveLists.includes(keepAliveModuleName) && keepAliveModuleName !== '') {
      commit('global/increaseKeepAliveLists', keepAliveModuleName);
    }

    // 判断是否状态中已经存在某个模块，不存在则创建。用户自定义界面不创建
    if (preventRegisterModule.indexOf(routePrefix) === -1 && dynamicModuleTag !== '' && store.state[keepAliveModuleName] === undefined) {
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
    if (existModuleIndex !== -1 && KEEP_MODULE_STATE_WHEN_CLICK_MENU) {
      // Condition One:
      // 如果目标路由界面所对应的[表]已经存在于已经打开的菜单列表中(不论其当前是列表状态还是编辑状态)
      // 则都应该显示其当前对应的状态页。
      if (routePrefix === STANDARD_TABLE_LIST_PREFIX && existModule.routePrefix !== STANDARD_TABLE_LIST_PREFIX && !isBack) {
        // 非返回逻辑
        // Step One: 处理菜单Tab页签的显示逻辑。
        commit('global/forceUpdateOpenedMenuLists', {
          openedMenuInfo: Object.assign({}, existModule, { isActive: true }),
          index: existModuleIndex
        });
        // Step Two: 按照用户所点击的路由原意进行跳转。
        next({ path: existModule.routeFullPath });
      } else {
        // [返回][新增]动作需要清除当前明细界面模块的keepAlive
        if (isBack || (paramItemId === 'New' && fromParamItemId !== 'undefined' && paramTableId === fromParamTableId)) {
          commit('global/decreasekeepAliveLists', fromKeepAliveModuleName);
        }
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

    // 处理label逻辑。因为引入了框架插件界面，故而label显示逻辑会有些需要注意的地方。
    if (dynamicModuleTag !== '' && openedMenuLists.filter(d => d.keepAliveModuleName === keepAliveModuleName).length === 0) {
      // 目标路由所对应的[功能模块]没有存在于openedMenuLists中，则将目标路由应该对应的模块信息写入openedMenuLists
      let tempInterval = -1;
      tempInterval = setInterval(() => {
        const ready = JSON.stringify(store.state.global.keepAliveLabelMaps) !== '{}';
        if (ready) {
          clearInterval(tempInterval);
          commit('global/increaseOpenedMenuLists', {
            label: routePrefix === PLUGIN_MODULE_PREFIX ? pluginModules[pluginModuleName].name : `${store.state.global.keepAliveLabelMaps[originModuleName]}${labelSuffix[dynamicModuleTag]}`,
            keepAliveModuleName,
            tableName: tableName || customizedModuleName || pluginModuleName || linkModuleName,
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
          label: routePrefix === PLUGIN_MODULE_PREFIX ? pluginModules[pluginModuleName].name : `${store.state.global.keepAliveLabelMaps[originModuleName]}${labelSuffix[dynamicModuleTag]}`,
          keepAliveModuleName
        });
      }
    }

    next();
  });

  // 增加后置路由守卫
  router.afterEach((to, from) => {
    // 记录规则一：由列表界面跳转到单对象界面，如果目标单对象界面和列表界面属于不同的表（Table不同），则将此种关系维护到路由记录“栈”。
    const isFromStandardTable = from.meta.routePrefix === STANDARD_TABLE_LIST_PREFIX;

    const isTableDetail = [HORIZONTAL_TABLE_DETAIL_PREFIX, VERTICAL_TABLE_DETAIL_PREFIX].indexOf(to.meta.routePrefix) > -1;
    const isNotFromSameTable = to.params.tableName !== from.params.tableName;
    if (!isNotFromSameTable) {
      window.sessionStorage.removeItem('dynamicRouting');
    }
    const isDynamicRouting = Boolean(window.sessionStorage.getItem('dynamicRouting'));
    // console.log({
    //   isFromStandardTable, isTableDetail, isNotFromSameTable, isDynamicRouting
    // });
    if (isDynamicRouting && isFromStandardTable && isTableDetail && isNotFromSameTable) {
      window.sessionStorage.removeItem('dynamicRouting');
      updateSessionObject('routeMapRecord', { k: getKeepAliveModuleName(to), v: from.fullPath }); 
    }
    // 记录规则二：不是从同表的列表跳转到单对象界面，如果目标界面与来源界面属于不同的表（Table不同），则将此种关系维护到路由记录“栈”。
    if (isDynamicRouting && isNotFromSameTable) {
      window.sessionStorage.removeItem('dynamicRouting');
      updateSessionObject('routeMapRecordForHideBackButton', { k: getKeepAliveModuleName(to), v: from.fullPath }); 
    }
    // 记录规则三：
    // window.sessionStorage.removeItem('dynamicRoutingForHideBackButton');
    // const isDynamicRoutingForHideBackButton = Boolean(window.sessionStorage.getItem('dynamicRoutingForHideBackButton'));


    const toPath = to.path.substring(to.path.indexOf('/') + 1, to.path.lastIndexOf('/') + 1);
    updateSessionObject('addRouteToEditor', { k: from.path, v: toPath }); 
  });
};
