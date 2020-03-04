import {
  VERTICAL_TABLE_DETAIL_PREFIX,
  HORIZONTAL_TABLE_DETAIL_PREFIX,
  STANDARD_TABLE_LIST_PREFIX,
  STANDARD_TABLE_COMPONENT_PREFIX,
  STANDARD_COMMONTABLE_COMPONENT_PREFIX,
  CUSTOMIZED_MODULE_PREFIX,
  LINK_MODULE_COMPONENT_PREFIX,
  LINK_MODULE_PREFIX,
  enableKeepAlive
} from '../../../constants/global';
import router from '../../router.config';
import customize from '../../customize.config';
import { getSeesionObject, updateSessionObject, deleteFromSessionObject } from '../../../__utils__/sessionStorage';
import { getLabel } from '../../../__utils__/url';
import { DispatchEvent } from '../../../__utils__/dispatchEvent';


export default {
  updataLoading(state, tableName) {
    if (!state.currentLoading.includes(tableName)) { // 没有则添加
      state.currentLoading.push(tableName); 
    }
  },
  deleteLoading(state, tableName) {
    const index = state.currentLoading.indexOf(tableName);
    if (index > -1) {
      state.currentLoading.splice(index, 1);
    }

    // state.currentLoading.splice(tableName, 1);
  },
  directionalRouter(state, param) {
    // id:勾选ID，
    // url:配置url,
    // isMenu,
    // lablel:名称
    const actionType = param.url.substring(0, param.url.indexOf('/'));
    const singleEditType = param.url.substring(param.url.lastIndexOf('/') + 1, param.url.length);
    if (actionType === 'SYSTEM') {
      if (singleEditType === ':itemId') {
        const path = `/${param.url.replace(/:itemId/, param.id)}`;
        router.push(
          path
        );
      } else {
        const path = `/${param.url}`;
        router.push(
          path
        );
      }
    } else if (actionType.toUpperCase() === 'CUSTOMIZED') {
      const customizedModuleName = param.url.substring(param.url.indexOf('/') + 1, param.url.lastIndexOf('/'));
      const path = `${CUSTOMIZED_MODULE_PREFIX}/${customizedModuleName.toUpperCase()}/${param.id}`;
      router.push({
        path
      });
      if (param.isMenu) {
        Object.keys(customize).forEach((customizeName) => {
          const nameToUpperCase = customizeName.toUpperCase();
          if (nameToUpperCase === customizedModuleName) {
            const labelName = customize[customizeName].labelName;
            const name = `C.${customizedModuleName}.${param.id}`;
            state.keepAliveLabelMaps[name] = `${labelName}`;
            const keepAliveLabelMapsObj = {
              k: name,
              v: labelName
            };
            updateSessionObject('keepAliveLabelMaps', keepAliveLabelMapsObj);// keepAliveLabel因刷新后来源信息消失，存入session
          }
        });
      }
    }
  },
  changeNavigatorSetting(state, data) {
    state.navigatorSetting = data;
  },
  changeSelectedPrimaryMenu(state, index) {
    state.primaryMenuIndex = index;
  },
  hideMenu(state) {
    state.primaryMenuIndex = -1;
  },
  saveLastIndexForMenu(state, lastIndex) {
    if (state.lastIndex === lastIndex) {
      state.lastIndex = -1;
    } else {
      state.lastIndex = lastIndex;
    }
  },
  doCollapseHistoryAndFavorite(state, { showFavorites }) {
    state.showFavoritesList = showFavorites;
    if (showFavorites) {
      state.collapseHistoryAndFavorite = showFavorites;
    }
    state.collapseHistoryAndFavorite = !state.collapseHistoryAndFavorite;
    DispatchEvent('doCollapseHistoryAndFavorite');
  },
  updateHistoryAndFavorite(state, {
    history,
    favorite
  }) {
    if (history) {
      state.history = history;
    }
    if (favorite) {
      state.favorite = favorite;
    }
  },

  updateMenuLists(state, menuLists) {
    state.menuLists = menuLists;
    if (menuLists.length > 0) {
      state.keepAliveLabelMaps = menuLists
        .map(d => d.children)
        .reduce((a, c) => a.concat(c))
        .map(d => d.children)
        .reduce((a, c) => a.concat(c))
        .reduce((a, c) => {
          if (c.type === 'action') {
          // 外部跳转链接URL的处理
            if (c.url) {
              const actionType = c.url.substring(0, c.url.indexOf('/'));
              if (actionType === 'https:' || actionType === 'http:') {
                const linkUrl = {};
                linkUrl[c.id] = c.url;
                state.LinkUrl.push(linkUrl); // 方便记录外部链接的跳转URL
                a[`${LINK_MODULE_COMPONENT_PREFIX}.${c.value.toUpperCase()}.${c.id}`] = c.label;
              } else if (actionType.toUpperCase() === 'CUSTOMIZED') {
                // 自定义界面的处理
                a[`${getLabel({ url: c.url, id: c.id, type: 'customized' })}`] = c.label;
              } else if (actionType === 'SYSTEM') {
                const i = c.url.substring(c.url.indexOf('/') + 1, c.url.lastIndexOf('/'));
                const id = i.substring(i.lastIndexOf('/') + 1, i.length);
                const n = i.substring(i.indexOf('/') + 1, i.lastIndexOf('/'));
                const name = n.substring(n.lastIndexOf('/') + 1, n.length);
                a[`${STANDARD_TABLE_COMPONENT_PREFIX}.${name}.${id}`] = c.label;
              }
            }
          } else if (c.type === 'table') {
            // 标准列表的处理
            a[`${STANDARD_TABLE_COMPONENT_PREFIX}.${c.value}.${c.id}`] = c.label;
          } else if (c.type === 'tree') {
            // 树形结构列表的处理
            a[`${STANDARD_TABLE_COMPONENT_PREFIX}.${c.value}.${c.id}`] = c.label;
          } else if (c.type === 'commonTable') {
            // 标准列表的处理(普通表格)
            a[`${STANDARD_COMMONTABLE_COMPONENT_PREFIX}.${c.value}.${c.id}`] = c.label;
          }
          return a;
        }, {});

      state.serviceIdMap = menuLists.map(d => d.children)
        .reduce((a, c) => a.concat(c))
        .map(d => d.children)
        .reduce((a, c) => a.concat(c))
        .filter(d => d.type === 'table' || d.type === 'action' || d.type === 'tree')
        .reduce((a, c) => {
          let menuType = '';
          if (c.url) {
            menuType = c.url.substring(c.url.lastIndexOf('/') + 1, c.url.length);
          }
          if (menuType === 'New') {
            const i = c.url.substring(c.url.indexOf('/') + 1, c.url.lastIndexOf('/'));
            const n = i.substring(i.indexOf('/') + 1, i.lastIndexOf('/'));
            const name = n.substring(n.lastIndexOf('/') + 1, n.length);
            a[name.toUpperCase()] = c.serviceId;
          } else {
            a[c.value.toUpperCase()] = c.serviceId;
          }
          return a;
        }, {});
    }
    // 以下逻辑是为了解决菜单外路由跳转提供信息
    const tableDetailUrlMessage = getSeesionObject('tableDetailUrlMessage');
    if (JSON.stringify(tableDetailUrlMessage) !== '{}') { // 取按钮跳转外链label
      const labelName = tableDetailUrlMessage.linkName;
      const name = `L.${tableDetailUrlMessage.linkName.toUpperCase()}.${tableDetailUrlMessage.linkId}`;
      state.keepAliveLabelMaps[name] = `${labelName}`;
      const linkUrl = {};
      linkUrl[tableDetailUrlMessage.linkId] = tableDetailUrlMessage.linkUrl;
      state.LinkUrl.push(linkUrl); // 方便记录外部链接的跳转URL
      state.keepAliveLabelMaps[name] = `${tableDetailUrlMessage.linkLabel}`;
    }
    state.keepAliveLabelMaps = Object.assign({}, state.keepAliveLabelMaps, getSeesionObject('keepAliveLabelMaps'));
    state.serviceIdMap = Object.assign({}, state.serviceIdMap, getSeesionObject('serviceIdMap'));
  },
  increaseLinkUrl(state, { linkId, linkUrl }) {
    const linkType = {};
    linkType[linkId] = linkUrl;
    state.LinkUrl.push(linkType);
  },
  increaseKeepAliveLists(state, name) {
    if (enableKeepAlive() && !state.keepAliveLists.includes(name)) {
      state.keepAliveLists = state.keepAliveLists.concat([name]);
    }
  },
  decreasekeepAliveLists(state, name) {
    state.keepAliveLists.splice(state.keepAliveLists.indexOf(name), 1);
  },
  toggleActiveMenu(state, index) {
    state.openedMenuLists.forEach((d) => { d.isActive = false; });
    state.openedMenuLists[index].isActive = true;
  },
  forceUpdateOpenedMenuLists(state, { openedMenuInfo, index }) {
    console.log(777, openedMenuInfo);
    state.openedMenuLists.forEach((d) => { d.isActive = false; });
    state.openedMenuLists[index] = openedMenuInfo;
    state.openedMenuLists = state.openedMenuLists.concat([]);
    state.activeTab = {
      isActive: openedMenuInfo.isActive,
      keepAliveModuleName: openedMenuInfo.keepAliveModuleName,
      label: openedMenuInfo.label,
      routeFullPath: openedMenuInfo.routeFullPath,
      routePrefix: openedMenuInfo.routePrefix,
      tableName: openedMenuInfo.tableName,
    };
  },
  increaseOpenedMenuLists(state, {
    label, keepAliveModuleName, tableName, routeFullPath, routePrefix
  }) {
    const notExist = state.openedMenuLists.filter(d => d.label === label && d.keepAliveModuleName === keepAliveModuleName).length === 0;
    const currentTabInfo = {
      label,
      keepAliveModuleName,
      tableName,
      routeFullPath,
      routePrefix
    };
    if (notExist) {
      state.openedMenuLists = state.openedMenuLists
        .map(d => Object.assign({}, d, { isActive: false }))
        .concat([Object.assign({}, currentTabInfo, { isActive: true })]);
      state.activeTab = currentTabInfo;
    }
  },
  updateActiveMenu({
    openedMenuLists
  }, keepAliveModuleName) {
    let activeMenuIndex = -1;
    openedMenuLists.some((d, i) => {
      if (d.keepAliveModuleName === keepAliveModuleName) {
        activeMenuIndex = i;
        return true;
      }
      return false;
    });
    openedMenuLists.forEach((d, i) => {
      if (i === activeMenuIndex) {
        d.isActive = true;
      } else {
        d.isActive = false;
      }
    });
  },
  emptyTabs(state) {
    state.openedMenuLists = [];
    state.keepAliveLists = [];
    state.activeTab = {};
    router.push('/');
    window.sessionStorage.removeItem('routeMapRecordForHideBackButton');
    window.sessionStorage.removeItem('addRouteToEditor');
    window.sessionStorage.removeItem('routeMapRecord');
    window.sessionStorage.removeItem('routeMapRecordForSingleObject');
  },
  againClickOpenedMenuLists(state, {
    label,
    keepAliveModuleName
  }) {
    state.openedMenuLists.forEach((d) => {
      d.isActive = false;
      if (d.label === label && d.keepAliveModuleName === keepAliveModuleName) {
        d.isActive = true;
      }
    });
  },
  tabCloseAppoint(state, tab) {
    const tabRouteFullPath = tab.routeFullPath;

    // 删除规则一：关闭页签时，菜单跳转到单对象后新增保存跳转到编辑界面，清除session中存储的对应关系。
    const clickMenuAddSingleObjectData = getSeesionObject('clickMenuAddSingleObject');
    Object.values(clickMenuAddSingleObjectData).map((item) => {
      const routeFullPath = state.activeTab.routeFullPath;
      const resRouteFullPath = ` ${routeFullPath.substring(routeFullPath.indexOf('/') + 1, routeFullPath.lastIndexOf('/'))}/New`;
      if (routeFullPath.indexOf(item) !== -1) {
        const path = `/${resRouteFullPath}`.replace(/\s/g, '');
        deleteFromSessionObject('clickMenuAddSingleObject', path);
      }
    });
    // 删除规则二：关闭页签时，清除外键类型跳转的session中存储的对应关系。
    const routeMapRecordForHideBackButtonData = getSeesionObject('routeMapRecordForHideBackButton');
    Object.keys(routeMapRecordForHideBackButtonData).map((item) => {
      const routeFullPath = state.activeTab.routeFullPath;
      if (routeFullPath === item) {
        deleteFromSessionObject('routeMapRecordForHideBackButton', routeFullPath);
        // window.sessionStorage.setItem('ignore', true);
      }
    });
    // 删除规则三：关闭页签时，清除动态路由跳转类型跳转的session中存储的对应关系。
    const isDynamicRouting = Boolean(window.sessionStorage.getItem('dynamicRoutingIsBack'));// 动态路由跳转的单对象界面返回列表界面标记

    if (!isDynamicRouting) { // 非动态路由返回之前的关闭tab需清除routeMapRecord对应关系，动态路由返回的routeMapRecord对应关系在返回监听时刷新接口之后清除
      const routeMapRecord = getSeesionObject('routeMapRecord');
      Object.keys(routeMapRecord).map((item) => {
        const dynamicRoutingIsBackForDeleteValue = getSeesionObject('dynamicRoutingIsBackForDelete');
        if (dynamicRoutingIsBackForDeleteValue.keepAliveModuleName === item) {
          deleteFromSessionObject('routeMapRecord', dynamicRoutingIsBackForDeleteValue.keepAliveModuleName);
        }
      });
    }

    // 删除规则四：关闭页签时，清除单对象动态路由跳转类型跳转的session中存储的对应关系。
    const routeMapRecordForSingleObject = getSeesionObject('routeMapRecordForSingleObject');
    Object.keys(routeMapRecordForSingleObject).map((item) => {
      if (tabRouteFullPath === item) {
        deleteFromSessionObject('routeMapRecordForSingleObject', tabRouteFullPath);
      }
    });
    
    state.isRequest = [];// 清空修改数据验证

    const { openedMenuLists } = state;
    // 如果关闭某个Tab，则清空所有该模块可能的对应的keepAlive信息。
    state.keepAliveLists = state.keepAliveLists.filter(d => d.indexOf(tab.tableName) === -1);
    openedMenuLists.forEach((item, index) => {
      if (tab.stopRouterPush) {
        const { tableName } = router.currentRoute.params;
        if (item.tableName === tableName) {
          state.activeTab = openedMenuLists[index];
        }
        if (item.routeFullPath === tabRouteFullPath) {
          openedMenuLists.splice(index, 1);
        }
      } else if (item.routeFullPath === tabRouteFullPath) {
        openedMenuLists.splice(index, 1);
        if (tabRouteFullPath) {
          if (openedMenuLists.length > 0) {
            if (index === 0) {
              state.activeTab = openedMenuLists[index]; // 关闭当前tab时始终打开的是最后一个tab
            } else {
              state.activeTab = openedMenuLists[index - 1]; // 关闭当前tab时始终打开的是最后一个tab
            }
            router.push({
              path: state.activeTab.routeFullPath,
            });
          } else {
            router.push('/');
          }
        }
      }
    });
  }, // 关闭当前tab
  tabHref(state, {// 当前tab更换路由
    back, type, tableName, tableId, id, label, serviceId
  }) {
    // back:返回标志, 
    // type:跳转类型,
    // tableName:主表表名,
    // tableId:主表ID,
    // id:明细ID,
    // label:显示名称, 
    // serviceId:网关

    const keepAliveModuleName = `S.${tableName}.${tableId}`;
    if (state.keepAliveLabelMaps[keepAliveModuleName] === undefined) {
      state.keepAliveLabelMaps[keepAliveModuleName] = `${label}`;
      state.serviceIdMap[tableName] = `${serviceId}`;
      const keepAliveLabelMapsObj = {
        k: keepAliveModuleName,
        v: label
      };
      updateSessionObject('keepAliveLabelMaps', keepAliveLabelMapsObj);// keepAliveLabel因刷新后来源信息消失，存入session
    }
    const serviceIdMap = getSeesionObject('serviceIdMap');
    if (serviceId && JSON.stringify(serviceIdMap) !== '{}' && serviceIdMap !== null) {
      const serviceIdMapObj = {
        k: tableName,
        v: serviceId
      };
      updateSessionObject('serviceIdMap', serviceIdMapObj);// serviceId因刷新后来源信息消失，存入session
      state.serviceIdMap = Object.assign({}, state.serviceIdMap, serviceIdMap);
    }
    let path = '';
    if (type === 'tableDetailHorizontal') {
      path = `${HORIZONTAL_TABLE_DETAIL_PREFIX}/${tableName}/${tableId}/${id}`;
     
      router.push({ path });
    }
    if (type === 'tableDetailVertical') {
      path = `${VERTICAL_TABLE_DETAIL_PREFIX}/${tableName}/${tableId}/${id}`;
      router.push({ path });
    }
    if (back) {
      console.log('🍓', router);
      path = `${STANDARD_TABLE_LIST_PREFIX}/${tableName}/${tableId}`;
      const routeInfo = {
        path,
        query: { isBack: true }
      };

      router.push(routeInfo);
    }
  },
  tabOpen(state, {// 打开一个新tab添加路由
    type, tableName, tableId, id, customizedModuleName, customizedModuleId, linkName,
    linkId, url, label, serviceId
  }) {
    // back:返回标志, 
    // type:跳转类型,
    // tableName:主表表名,
    // tableId:主表ID,
    // id:明细ID,
    // label:显示名称, 
    // serviceId:网关
    const keepAliveModuleName = `S.${tableName}.${tableId}`;
    if (state.keepAliveLabelMaps[keepAliveModuleName] === undefined) {
      state.keepAliveLabelMaps[keepAliveModuleName] = `${label}`;
      state.serviceIdMap[tableName] = `${serviceId}`;
      const keepAliveLabelMapsObj = {
        k: keepAliveModuleName,
        v: label
      };
     
      updateSessionObject('keepAliveLabelMaps', keepAliveLabelMapsObj);// keepAliveLabel因刷新后来源信息消失，存入session
    }
    const serviceIdMap = getSeesionObject('serviceIdMap');
    if (serviceId && JSON.stringify(serviceIdMap) !== '{}' && serviceIdMap !== null) {
      const serviceIdMapObj = {
        k: tableName,
        v: serviceId
      };
      updateSessionObject('serviceIdMap', serviceIdMapObj);// serviceId因刷新后来源信息消失，存入session
      state.serviceIdMap = Object.assign({}, state.serviceIdMap, getSeesionObject('serviceIdMap'));
    }
    let path = '';
    if (type === STANDARD_TABLE_LIST_PREFIX || type === 'S') {
      if (url) {
        path = `${url.toUpperCase()}`;
      } else {
        path = `${STANDARD_TABLE_LIST_PREFIX}/${tableName}/${tableId}`;
      }
    } else if (type === 'tableDetailHorizontal' || type === 'H') {
      if (url) {
        path = `${url.toUpperCase()}`;
      } else {
        path = `${HORIZONTAL_TABLE_DETAIL_PREFIX}/${tableName}/${tableId}/${id}`;
      }
    } else if (type === 'tableDetailVertical' || type === 'V') {
      if (url) {
        path = `${url.toUpperCase()}`;
      } else {
        path = `${VERTICAL_TABLE_DETAIL_PREFIX}/${tableName}/${tableId}/${id}`;
      }
    } else if (type === 'tableDetailAction') {
      if (url) {
        path = `${url.toUpperCase()}`;
      } else {
        path = `${CUSTOMIZED_MODULE_PREFIX}/${customizedModuleName.toUpperCase()}/${customizedModuleId}`;
      }
    } else if (type === 'tableDetailUrl') {
      path = `${LINK_MODULE_PREFIX}/${linkName.toUpperCase()}/${linkId}`;
    }
    
    router.push({
      path
    });
  },
  updataUserInfoMessage(state, { userInfo }) {
    state.userInfo = userInfo;
  },
  switchTabForActiveTab(state, tab) {
    state.activeTab = {
      isActive: tab.isActive,
      keepAliveModuleName: tab.keepAliveModuleName,
      label: tab.label,
      routeFullPath: tab.routeFullPath,
      routePrefix: tab.routePrefix,
      tableName: tab.tableName,
    };
  },
  copyDataForSingleObject(state, { copyData }) {
    state.copyDatas = copyData;
  },
  copyModifyDataForSingleObject(state, modifyData) {
    state.modifyData = modifyData;
  },
  setLayout(state, data) {
    state.showModule = {
      HistoryAndFavorite: data, // 隐藏收藏夹
      TabLists: data, // 隐藏tab栏
      Navigator: data, // 隐藏菜单栏
    };
    if (data === false) {
      // const dom = document.getElementById('content');
      // const doc = dom.style.padding = '0px';
      // const domForMargin = dom.parentNode.parentNode.style.margin = '0px';
    }
  },
  addKeepAliveLabelMaps(state, { name, label }) {
    state.keepAliveLabelMaps[name] = `${label}`;
  },
  addServiceIdMap(state, { tableName, gateWay }) {
    // state.serviceIdMap[tableName] = `${gateWay}`;
  },

  isRequestUpdata(state, { tabPanel, index }) {
    let arr = [];
    arr = tabPanel.map(item => item.isRequest);
    if (index === 0) {
      arr[0] = true;
    }
    arr[index] = true;
    const oldRequestData = state.isRequest;
    if (oldRequestData.length > 0) {
      arr.forEach((a, i) => {
        if (arr[i] !== true) {
          arr[i] = oldRequestData[i];
        }
      }); 
    }
    state.isRequest = arr;
  },
  emptyTestData(state) { // 清空TestData
    state.isRequest = [];
  },
  updateModifySearchFoldnum(state, data) {
    state.changeSearchFoldnum = data;
  },
  updateJflowControlField(state, data) {
    state.JflowControlField = data;
  }

  
};
