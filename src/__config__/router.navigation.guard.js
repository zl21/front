import store from './store.config';
import {
  enableActivateSameCustomizePage,
  CUSTOMIZED_MODULE_PREFIX,
  STANDARD_TABLE_LIST_PREFIX,
  STANDARD_COMMONTABLE_LIST_PREFIX,
  VERTICAL_TABLE_DETAIL_PREFIX,
  HORIZONTAL_TABLE_DETAIL_PREFIX,
  STANDARD_TABLE_COMPONENT_PREFIX,
  STANDARD_COMMONTABLE_COMPONENT_PREFIX,
  CUSTOMIZED_MODULE_COMPONENT_PREFIX,
  VERTICAL_TABLE_DETAIL_COMPONENT_PREFIX,
  HORIZONTAL_TABLE_DETAIL_COMPONENT_PREFIX,
  KEEP_MODULE_STATE_WHEN_CLICK_MENU,
  PLUGIN_MODULE_PREFIX,
  PLUGIN_MODULE_COMPONENT_PREFIX,
  LINK_MODULE_PREFIX,
  LINK_MODULE_COMPONENT_PREFIX,
  enableOpenNewTab
} from '../constants/global';
import standardTableListModule from './store/standardTableList.store';
import verticalTableDetailModule from './store/verticalTableDetail';
import horizontalTableDetailModule from './store/horizontalTableDetail';
import PluginModule from './plugin.config';
import { updateSessionObject, getSessionObject, deleteFromSessionObject } from '../__utils__/sessionStorage';
import {
  getLocalObject,
} from '../__utils__/localStorage';
import setCustomeLabel from '../__utils__/setCustomeLabel';
import getModuleName from '../__utils__/getModuleName';
import i18n from '../assets/js/i18n';

let pluginModules = {};

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
      // Condition One: 路由到标准列表界面名称(普通表格)
    case STANDARD_COMMONTABLE_LIST_PREFIX:
      keepAliveModuleName = `${STANDARD_COMMONTABLE_COMPONENT_PREFIX}.${tableName}.${tableId}`;
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
    // Condition One: 路由到标准列表界面名称（普通表格）
    case STANDARD_COMMONTABLE_LIST_PREFIX:
      dynamicModuleTag = STANDARD_COMMONTABLE_COMPONENT_PREFIX;
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
    tableName, tableId, customizedModuleName, customizedModuleId, linkModuleName, linkModuleId,pluginModuleName
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

    case STANDARD_COMMONTABLE_LIST_PREFIX:
      originModuleName = `${STANDARD_COMMONTABLE_COMPONENT_PREFIX}.${tableName}.${tableId}`;
      break;
      // Condition Five: 路由到插件界面
    case PLUGIN_MODULE_PREFIX:
      originModuleName = `${PLUGIN_MODULE_COMPONENT_PREFIX}.${pluginModuleName}`;
        break; 
    default:
      originModuleName = `${STANDARD_TABLE_COMPONENT_PREFIX}.${tableName}.${tableId}`;
  }
  return originModuleName;
};

Object.keys(PluginModule).forEach((key) => {
  pluginModules[key.toUpperCase()] = PluginModule[key];
});
if (window.ProjectConfig && window.ProjectConfig.externalPluginModules) { // 整合外部插件配置与框架插件配置
  pluginModules = Object.assign({}, pluginModules, window.ProjectConfig.externalPluginModules);
}

export default (router) => {
  router.beforeEach((to, from, next) => {
    // if (Object.keys(getSessionObject('loginStatus')) && Object.keys(getSessionObject('loginStatus')).length === 0) {
    //   debugger;
    // }

    // 注入模块名
    to.meta.moduleName = getModuleName({ route: to });


    const loginText = '/login'.toUpperCase();
    if (to.path && getLocalObject('loginStatus') !== true && (to.path.indexOf(loginText) !== -1) && to.path !== '/') {
      const data = {
        k: 'path',
        v: to.path
      };
      updateSessionObject('savePath', data);
    }
    if (to.path.toUpperCase().indexOf(loginText) !== -1 && getLocalObject('loginStatus') === true) { // 当页面处于登录状态时，则无法回到登录界面，可退出登录进行操作
      window.location.href = window.location.origin;
      return;
    }
  

    if (router.getMatchedComponents(to.path).length === 0) {
      next('/');
    }
     //  过滤跳转路由
     if (window.ProjectConfig.routerFilter) {
      let keepAliveLabelMaps =  JSON.parse(window.localStorage.getItem('keepAliveLabelMapsAll'))
      let filterName = to.meta.moduleName || to.meta.customizedModuleName || to.meta.pluginModuleName || to.meta.linkModuleName || '';
      // filterName 不存在或则是不是xx.xx.xx 则不过滤
      if (keepAliveLabelMaps&& filterName && filterName.split('.').length>2) {
        if(!to.params.customizedModuleName){
          let stringLeng = filterName.split('.').length>3 ? filterName.lastIndexOf('.') :filterName.length;
          let menuName = filterName.substring(filterName.indexOf('.'),stringLeng);
          // 根据路由规则匹配
          let existIndex = ['S', 'SC', 'H', 'V', 'C', 'P', 'L'].findIndex((key) => {
            let name = key + menuName;
            return keepAliveLabelMaps[name];
          });
          if(existIndex === -1){
            next('/')
            return false
          }
        }
        
      }
    }

    const { commit } = store;
    const { keepAliveLists, openedMenuLists } = store.state.global;
    const {
      tableName, tableId, itemId, customizedModuleName, pluginModuleName, linkModuleName, customizedModuleId, pluginModuleId, linkModuleId
    } = to.params;

    const preventRegisterModule = [CUSTOMIZED_MODULE_PREFIX, PLUGIN_MODULE_PREFIX, LINK_MODULE_PREFIX];
    const { routePrefix } = to.meta;
    const { isBack } = to.query;
    const moduleGenerator = {
      [STANDARD_TABLE_COMPONENT_PREFIX]: standardTableListModule,
      [STANDARD_COMMONTABLE_COMPONENT_PREFIX]: standardTableListModule,
      [VERTICAL_TABLE_DETAIL_COMPONENT_PREFIX]: verticalTableDetailModule,
      [HORIZONTAL_TABLE_DETAIL_COMPONENT_PREFIX]: horizontalTableDetailModule,
    };
    const labelSuffix = {
      [CUSTOMIZED_MODULE_COMPONENT_PREFIX]: '',
      [LINK_MODULE_COMPONENT_PREFIX]: '',
      [STANDARD_TABLE_COMPONENT_PREFIX]: '',
      [STANDARD_COMMONTABLE_COMPONENT_PREFIX]: '',
      [VERTICAL_TABLE_DETAIL_COMPONENT_PREFIX]: itemId === 'New' ? i18n.t('buttons.add') : i18n.t('buttons.edit'),
      [HORIZONTAL_TABLE_DETAIL_COMPONENT_PREFIX]: itemId === 'New' ? i18n.t('buttons.add') : i18n.t('buttons.edit'),
    };
    const paramItemId = String(itemId) === '-1' ? 'New' : `${itemId}`;
    const paramTableId = tableId;
    const fromParamItemId = String(from.params.itemId) === '-1' ? 'New' : `${from.params.itemId}`;
    const fromParamTableId = from.params.tableId;


    const fromKeepAliveModuleName = getKeepAliveModuleName(from); // 来源字段的keepAliveModuleName，即模块的moduleComponentName
    const originModuleName = getOriginModuleName(to); // 单对象界面对应的原标准列表界面的moduleComponentName
    const keepAliveModuleName = getKeepAliveModuleName(to); // 当前界面对应的keepAliveModuleName，即模块的moduleComponentName
    const dynamicModuleTag = getDynamicModuleTag(to); // 当前界面对应的路由标识。
  
    let sameNewPage = false;
    if (enableOpenNewTab() && !store.state.global.switchTag) {
      if (itemId === 'New') { // 当前打开的新增界面，需要判断是否已经存在该表的新增界面,存在即开启新tab,并关闭原有存在的该表新增界面tab
        openedMenuLists.map((d) => {
          if (d.keepAliveModuleName === keepAliveModuleName// 模块名相同
             && ((`${d.routeFullPath}?isBack=true` === to.fullPath || `${to.fullPath}?isBack=true` === d.routeFullPath) 
             || (`${router.currentRoute.fullPath}?isBack=true` === to.fullPath || `${to.fullPath}?isBack=true` === router.currentRoute.fullPath) 
             || (`${router.currentRoute.fullPath}?isBack=true` === to.fullPath)
             || (to.fullPath.includes('?isBack=true') && d.routeFullPath === to.fullPath)

             )// 当前处于激活状态的不是即将要打开的新增tab或者复制tab
          // 当前激活的tab不是即将打开的tab，用于区分新增和复制
          ) {
            // const a = `${d.tableName}${d.itemId}`;
            // const doms = document.querySelector(`.${a}`);
            // doms.click();
            sameNewPage = true;
            // commit('global/updataNewTagForNewTab', sameNewPage);
            
            commit('global/decreasekeepAliveLists', d.keepAliveModuleName);
            // commit('global/switchTabForActiveTab', d);// 更新当前ActiveTab

            
            // if (!preventRegisterModule.includes(d.routePrefix)) {
            delete store.state[keepAliveModuleName];
            //   store.unregisterModule(keepAliveModuleName);
            // }
            // const a = window.vm.$children[0].$children[0].$children[2].$children[1].$children;
            // a.map((item, i) => {
            //   if (item.moduleComponentName === d.keepAliveModuleName) {
            //     a.splice(i, 1);
            //   }
            // });
            // commit('global/tabCloseAppoint', {
            //   routeFullPath: d.routeFullPath, stopRouterPush: true, keepAliveModuleName: d.keepAliveModuleName, tableName, routePrefix: d.routePrefix, itemId
            // });
          }
        });
      }
    }
    // if (sameNewPage) {
    //   return;
    // }
    // 处理 keepAliveModuleName：目标路由的模块默认都要加入keepAlive列表
    if ((!keepAliveLists.includes(keepAliveModuleName) && keepAliveModuleName !== '')) {
      const data = {
        name: keepAliveModuleName,
        to,
        dynamicModuleTag,
        // sameNewPage
      };
      commit('global/increaseKeepAliveLists', data);
    }

    // 判断是否状态中已经存在某个模块，不存在则创建。用户自定义界面不创建

    if (preventRegisterModule.indexOf(routePrefix) === -1 && dynamicModuleTag !== '' && store.state[keepAliveModuleName] === undefined) {
      store.registerModule(keepAliveModuleName, moduleGenerator[dynamicModuleTag]());
    }
     
    // 处理 openedMenuLists
    let existModuleIndex = -1;

      const existModule = openedMenuLists.filter((d, i) => {
        let currentName = tableName || customizedModuleName || pluginModuleName || linkModuleName;
        if (d.tableName === currentName) {
         
          if(customizedModuleName){
             // 定制界面，在enableActivateSameCustomizePage 为false 的时候新开多个页面
              // 已存在打开的模块界面，但是并不是同一个界面
            let filterTablesOpenTabexist =  window.ProjectConfig &&  window.ProjectConfig.filterTablesOpenTab.includes(customizedModuleName);
            if(enableActivateSameCustomizePage() && !filterTablesOpenTabexist){
              existModuleIndex = i;
            }
          }else{
            
            
            existModuleIndex = i;
          }
        
          
          return true;
        }
        return false;
      })[0];


    
    if (existModuleIndex !== -1 && KEEP_MODULE_STATE_WHEN_CLICK_MENU && !enableOpenNewTab()) {
      // Condition One:
      // 如果目标路由界面所对应的[表]已经存在于已经打开的菜单列表中(不论其当前是列表状态还是编辑状态)
      // 则都应该显示其当前对应的状态页。
      if (routePrefix === (STANDARD_TABLE_LIST_PREFIX || STANDARD_COMMONTABLE_LIST_PREFIX) && existModule.routePrefix !== (STANDARD_TABLE_LIST_PREFIX || STANDARD_COMMONTABLE_LIST_PREFIX) && !isBack) {
        // 非返回逻辑
        // Step One: 处理菜单Tab页签的显示逻辑。
        commit('global/forceUpdateOpenedMenuLists', {
          openedMenuInfo: Object.assign({}, existModule, { isActive: true }),
          index: existModuleIndex
        });
        // Step Two: 按照用户所点击的路由原意进行跳转。
        next({ path: existModule.routeFullPath });
      } else {
        // [返回][新增]动作需要清除当前明细界面模块的keepAlive（且to与form不相同）
        const includesKeepAliveLists = keepAliveLists.includes(fromKeepAliveModuleName);
        // customizedModuleName, pluginModuleName, linkModuleName
        let fromTableName = from.params.tableName ||from.params.customizedModuleName;
        let toTableName =  to.params.tableName || to.params.customizedModuleName;
        if ((isBack && toTableName === fromTableName && includesKeepAliveLists) || (paramItemId === 'New' && fromParamItemId !== 'undefined' && paramTableId === fromParamTableId && includesKeepAliveLists)) {
          commit('global/decreasekeepAliveLists', fromKeepAliveModuleName);
        }
        // Step One: 处理菜单Tab页签的显示逻辑。
        commit('global/forceUpdateOpenedMenuLists', {
          openedMenuInfo: {
            isActive: true,
            label: `${store.state.global.keepAliveLabelMaps[originModuleName]}${labelSuffix[dynamicModuleTag]}`,
            keepAliveModuleName,
            tableName: tableName || customizedModuleName || pluginModuleName || linkModuleName,
            routeFullPath: to.fullPath, // 由to.path改为to.fullPath为取带query的路径
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
    // 跳转至定制界面的逻辑改为：只要单对象标记相同，不进行ID判断，只激活同一个单对象标记相同的界面
    let keepAliveModuleNameRes = '';
    if (dynamicModuleTag === 'C') {
      keepAliveModuleNameRes = keepAliveModuleName.split('.')[1];
      const data = {
        customizedModuleName,
        customizedModuleId,
      };
      // setCustomeLabel(data);
    }

    // 通过activateSameCustomizePage配置路由到自定义界面，如果自定义界面标识相同，是否只激活同一个tab,默认为true,只激活同一个tab
    let activateSameCustomizePageFlag = false;
    if (enableActivateSameCustomizePage()) {
      // 当前打开的tab的keepAliveModuleName===要跳转页面的keepAliveModuleName，
      // 或是当前是自定义界面的keepAliveModuleName包含当前要跳转的自定义界面的标识，
      // 不必keepAliveModuleName相等，包含自定义界面的标识即可
      // filterTablesOpenTabexist 判断是否在过滤新开里，在则是新开界面
      let filterTablesOpenTabexist =  window.ProjectConfig &&  window.ProjectConfig.filterTablesOpenTab.includes(customizedModuleName);

      if (!filterTablesOpenTabexist && dynamicModuleTag !== '' && openedMenuLists.length > 0 && openedMenuLists.filter(d => d.keepAliveModuleName === keepAliveModuleName || (keepAliveModuleNameRes !== ''&& d.tableName===keepAliveModuleNameRes  && d.keepAliveModuleName.includes(keepAliveModuleNameRes))).length > 0) {
        activateSameCustomizePageFlag = true;
      }
    }
   
    if (dynamicModuleTag !== '' && openedMenuLists.filter(d => d.keepAliveModuleName === keepAliveModuleName).length === 0 && !activateSameCustomizePageFlag) {
      // 新开tab
      // 目标路由所对应的[功能模块]没有存在于openedMenuLists中，则将目标路由应该对应的模块信息写入openedMenuLists

      let tempInterval = -1;
      tempInterval = setInterval(() => {
        let ready = null;
        const saveNetwork = getSessionObject('saveNetwork').name;
        if (saveNetwork) {
          ready = true;
        } else {
          ready = JSON.stringify(store.state.global.keepAliveLabelMaps) !== '{}';
        }
        if (ready) {
          clearInterval(tempInterval);
          if (routePrefix === PLUGIN_MODULE_PREFIX) {
            if (window.ProjectConfig && window.ProjectConfig.externalPluginModules) { // 整合外部插件配置与框架插件配置
              pluginModules = Object.assign({}, pluginModules, window.ProjectConfig.externalPluginModules);
            }
          }
          commit('global/increaseOpenedMenuLists', {
            label: routePrefix === PLUGIN_MODULE_PREFIX ? pluginModules[pluginModuleName].name : `${store.state.global.keepAliveLabelMaps[originModuleName]}${labelSuffix[dynamicModuleTag]}`,
            keepAliveModuleName,
            tableName: tableName || customizedModuleName || pluginModuleName || linkModuleName,
            routeFullPath: to.fullPath,
            routePrefix,
            itemId: itemId || customizedModuleId || pluginModuleId || linkModuleId,
            sameNewPage
          });
        }
      }, 125);
    } else if (to.path !== '/') { // 处理激活同一个tab对应表逻辑
      // 目标路由所对应的[功能模块]已经存在与openedMenuList中，则将需要处理openedMenuList中相匹配的索引值的激活状态。
      // 不新开tab
      if (window.ProjectConfig && window.ProjectConfig.externalPluginModules) { // 整合外部插件配置与框架插件配置
        pluginModules = Object.assign({}, pluginModules, window.ProjectConfig.externalPluginModules);
      }
      commit('global/againClickOpenedMenuLists', {
        label: routePrefix === PLUGIN_MODULE_PREFIX ? pluginModules[pluginModuleName].name : `${store.state.global.keepAliveLabelMaps[originModuleName]}${labelSuffix[dynamicModuleTag]}`,
        keepAliveModuleName,
        type: dynamicModuleTag,
        fullPath: to.fullPath,
        itemId: itemId || customizedModuleId || pluginModuleId || linkModuleId,
        routeFullPath: to.fullPath,
        routePrefix,
        tableName: tableName || customizedModuleName || pluginModuleName || linkModuleName,
      });
      if (enableOpenNewTab()) {
        // 处理同表新开tab要跳转的表已打开时，需更新activeTab
        const existModuleForOpenNewTab = openedMenuLists.filter((d, i) => {
          if (d.keepAliveModuleName === keepAliveModuleName) { 
            d.isActive = true;
            // 已存在打开的模块界面，但是并不是同一个界面
            return true;
          }
        })[0];
        if (existModuleForOpenNewTab) {
          commit('global/switchTabForActiveTab', existModuleForOpenNewTab);// 更新当前ActiveTab
        }
      }
    }

    next();
  });

  // 增加后置路由守卫
  router.afterEach((to, from) => {
    // 记录规则一：由列表界面跳转到单对象界面，如果目标单对象界面和列表界面属于不同的表（Table不同），则将此种关系维护到路由记录“栈”。
    const isFromStandardTable = from.meta.routePrefix === (STANDARD_TABLE_LIST_PREFIX || STANDARD_COMMONTABLE_LIST_PREFIX);


    const isFromPlugin = from.meta.routePrefix === PLUGIN_MODULE_PREFIX;// 目标单对象界面和列表界面属于不同的表（路由类型不同（插件类型路由））
    const isFromCustomize = from.meta.routePrefix === CUSTOMIZED_MODULE_PREFIX;// 目标单对象界面和列表界面属于不同的表（路由类型不同（自定义界面类型路由））

    const isTableDetail = [HORIZONTAL_TABLE_DETAIL_PREFIX, VERTICAL_TABLE_DETAIL_PREFIX, CUSTOMIZED_MODULE_PREFIX].indexOf(to.meta.routePrefix) > -1;
    const isNotFromSameTable = to.params.tableName !== from.params.tableName;// 目标单对象界面和列表界面属于不同的表（Table不同）
    const isNotFromSameTableForHideBackButton = (to.params.itemId !== from.params.itemId) && (from.params.itemId === 'New');
    if (!isNotFromSameTable) {
      window.sessionStorage.removeItem('dynamicRouting');
      window.sessionStorage.removeItem('isDynamicRoutingForHideBackButton');
      window.sessionStorage.removeItem('dynamicRoutingForSinglePage');
    }
    const isDynamicRouting = Boolean(window.sessionStorage.getItem('dynamicRouting'));
    // const ignore = Boolean(window.sessionStorage.getItem('ignore'));
    if (isDynamicRouting && (isFromStandardTable || isFromPlugin) && isTableDetail && isNotFromSameTable) {
      window.sessionStorage.removeItem('dynamicRouting');
      const routeMapRecordForSingleObject = getSessionObject('routeMapRecordForSingleObject');
      if (Object.keys(routeMapRecordForSingleObject).indexOf(to.fullPath) > -1) { // 如果在单对象配置的动态路由维护关系里存在，当前要跳转的单对象界面，则不记录当前的
        deleteFromSessionObject('routeMapRecordForSingleObject', to.fullPath);
      }

      const routeMapRecord = getSessionObject('routeMapRecord');
      // JSON.stringify(routeMapRecord) !== '{}'
      if (routeMapRecord[getKeepAliveModuleName(to)] !== from.fullPath) {
        updateSessionObject('routeMapRecord', { k: getKeepAliveModuleName(to), v: from.fullPath });
      }
    }

    // 记录规则二：不是从同表的列表跳转到单对象界面，如果目标界面与来源界面属于不同的表（Table不同），则将此种关系维护到路由记录“栈”。
    const isDynamicRoutingForHideBackButton = Boolean(window.sessionStorage.getItem('dynamicRoutingForHideBackButton'));
    if (isDynamicRoutingForHideBackButton && isNotFromSameTable && (to.path !== '/' && from.path !== '/')) {
      window.sessionStorage.removeItem('dynamicRoutingForHideBackButton');
      // 外键跳转类型，to-from与from-to一致时，不维护到路由记录
      updateSessionObject('routeMapRecordForHideBackButton', { k: to.fullPath, v: from.fullPath });
      // window.sessionStorage.removeItem('ignore');
    }

    // 记录规则三：不是由列表跳转到单对象界面，由新增界面跳转到编辑界面（itemID不同），则将此种关系维护到路由记录“栈”。
    if (!isFromStandardTable && !isFromCustomize && !isFromPlugin && isNotFromSameTableForHideBackButton && (to.path !== '/' && from.path !== '/')) { // 非列表
      const toPath = to.path.substring(to.path.indexOf('/') + 1, to.path.lastIndexOf('/') + 1);
      updateSessionObject('addRouteToEditor', { k: from.path, v: toPath });
    }

    // 记录规则四：由单对象界面跳转到单对象界面，则将此种关系维护到路由记录“栈”。
    const isSingleObjectTableDetail = [HORIZONTAL_TABLE_DETAIL_PREFIX, VERTICAL_TABLE_DETAIL_PREFIX].indexOf(from.meta.routePrefix) > -1;
    const dynamicRoutingForSinglePage = Boolean(window.sessionStorage.getItem('dynamicRoutingForSinglePage'));
    if (dynamicRoutingForSinglePage && isSingleObjectTableDetail && isTableDetail) {
      window.sessionStorage.removeItem('dynamicRoutingForSinglePage');
      const routeMapRecord = getSessionObject('routeMapRecord');
      const toPath = getKeepAliveModuleName(to);

      if (Object.keys(routeMapRecord).indexOf(toPath) > -1) { // 如果在列表配置的动态路由维护关系里存在，当前要跳转的单对象界面，则不记录当前的
        deleteFromSessionObject('routeMapRecord', toPath);
      }
      const routeMapRecordForSingleObject = getSessionObject('routeMapRecordForSingleObject');
      updateSessionObject('routeMapRecordForSingleObject', { k: to.fullPath, v: from.fullPath });
      if (JSON.stringify(routeMapRecordForSingleObject) !== '{}' && to.fullPath !== from.fullPath) {
        updateSessionObject('routeMapRecordForSingleObject', { k: to.fullPath, v: from.fullPath });
      }
    }

    // 记录规则五：由自定义界面跳转到单对象界面，则将此种关系维护到路由记录“栈”。
    const isCustomizedTableDetail = [CUSTOMIZED_MODULE_PREFIX].indexOf(from.meta.routePrefix) > -1;
    const dynamicRoutingForCustomizePage = Boolean(window.sessionStorage.getItem('dynamicRoutingForCustomizePage'));
    if (isCustomizedTableDetail && dynamicRoutingForCustomizePage && isTableDetail) {
      window.sessionStorage.removeItem('dynamicRoutingForCustomizePage');
      const routeMapRecordForCustomizePage = getSessionObject('routeMapRecordForCustomizePage');
      updateSessionObject('routeMapRecordForCustomizePage', { k: to.fullPath, v: from.fullPath });
      if (JSON.stringify(routeMapRecordForCustomizePage) !== '{}' && to.fullPath !== from.fullPath) {
        updateSessionObject('routeMapRecordForSingleObject', { k: to.fullPath, v: from.fullPath });
      }
    }
  });
};
export { getKeepAliveModuleName };
