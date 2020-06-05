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
import setCustomeLabel from '../../../__utils__/setCustomeLabel';
import {
  getSeesionObject, updateSessionObject, deleteFromSessionObject, removeSessionObject 
} from '../../../__utils__/sessionStorage';
import { getLabel } from '../../../__utils__/url';
import { DispatchEvent } from '../../../__utils__/dispatchEvent';


export default {
  // updataTreeId(state, data) {
  //   console.log(555);
  //   // data.tableId:主表ID
  //   // data.treeId:勾选的树结构列表ID
  //   state.treeIds.push(data);
  // },
 
  updataOpenedMenuLists(state, data) {
    state.openedMenuLists = data;
  },
  updateTreeTableListData(state) {
    state.treeTableListData = [];
  },
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
      const treeQuery = router.currentRoute.query;
      let path = '';
      if (treeQuery.isTreeTable) {
        // 如果当前列表为树形结构列表界面，则配置的动态路由以及tableurl（配置为跳转定制界面，则路由上定制界面ID为treeTableListSelectId）
        path = `${CUSTOMIZED_MODULE_PREFIX}/${customizedModuleName.toUpperCase()}/${param.treeTableListSelectId ? param.treeTableListSelectId : param.id}`;
      } else {
        path = `${CUSTOMIZED_MODULE_PREFIX}/${customizedModuleName.toUpperCase()}/${param.id}`;
      }
      router.push({
        path
      });
      if (param.isMenu) {
        const data = {
          customizedModuleName,
          customizedModuleId: param.id
        };
        setCustomeLabel(data);
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
            state.treeTableListData.push(c);
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
    state.openedMenuLists.forEach((d) => { d.isActive = false; });
    state.openedMenuLists[index] = openedMenuInfo;
    state.openedMenuLists = state.openedMenuLists.concat([]);
    state.activeTab = openedMenuInfo;
    // state.activeTab = {
    //   isActive: openedMenuInfo.isActive,
    //   keepAliveModuleName: openedMenuInfo.keepAliveModuleName,
    //   label: openedMenuInfo.label,
    //   routeFullPath: openedMenuInfo.routeFullPath,
    //   routePrefix: openedMenuInfo.routePrefix,
    //   tableName: openedMenuInfo.tableName,
    // };
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
    state.JflowControlField.map((item, index) => {
      state.openedMenuLists.map((openedMenuList) => {
        const openedMenuListId = openedMenuList.keepAliveModuleName.split('.')[2];
        if (item.tableId === openedMenuListId) {
          state.JflowControlField.splice(index, 1);
        }
      });
    });

    state.openedMenuLists = [];
    state.keepAliveLists = [];
    state.activeTab = {};
    router.push('/');
    window.sessionStorage.removeItem('routeMapRecordForHideBackButton');
    window.sessionStorage.removeItem('addRouteToEditor');
    window.sessionStorage.removeItem('routeMapRecord');
    window.sessionStorage.removeItem('routeMapRecordForSingleObject');
    window.sessionStorage.removeItem('routeMapRecordForCustomizePage');
    // 清空updataTreeId
    removeSessionObject('TreeId');
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
    // 关闭tab时需清楚jflow配置的对应表
    // tableName:'主表表明',
    // routeFullPath:'/SYSTEM/TABLE_DETAIL/V/BCP_CUSTOMER_JFLOW/23968/5555832',

    // 关闭当前tab时,如果当前列表界面时树形结构列表界面，需清楚对应的treeID
    // const index = state.treeIds.indexOf(tab.tableName);
    // if (index > -1) {
    //   state.treeIds.splice(index, 1);
    // }
    // const data = {
    //   k: tab.tableName,
    //   v: item.ID
    // };
    deleteFromSessionObject('TreeId', tab.tableName);
    let openedMenuListId = null;
    if (tab.keepAliveModuleName) {
      openedMenuListId = tab.keepAliveModuleName.split('.')[2];
    }
    if (state.JflowControlField && state.JflowControlField.length && state.JflowControlField.length > 0) {
      state.JflowControlField = state.JflowControlField.filter((item) => {
        if (Number(item.tableId) !== Number(openedMenuListId)) {
          return item;
        }
      }); 
    }
    
    // window.sessionStorage.removeItem('dynamicRoutingIsBack');// 清除动态路由返回标记

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
      const index = routeFullPath.lastIndexOf('/');
      const routeFullPathRes = routeFullPath.substring(0, index + 1);
      if (item.includes(routeFullPathRes)) { //
        // 外键跳转与单对象跳转同一个单对象界面时，外键逻辑为不显示返回按钮，自定义跳转为返回到来源自定义界面，点击返回时，应清除对应的外键关系
        deleteFromSessionObject('routeMapRecordForHideBackButton', item);
        // window.sessionStorage.setItem('ignore', true);
      }
    });
    // 删除规则三：关闭页签时，清除动态路由跳转类型跳转的session中存储的对应关系。
    const isDynamicRouting = Boolean(window.sessionStorage.getItem('dynamicRoutingIsBack'));// 动态路由跳转的单对象界面返回列表界面标记
    const routeMapRecord = getSeesionObject('routeMapRecord');
    if (!isDynamicRouting) { // 非动态路由返回之前的关闭tab需清除routeMapRecord对应关系，动态路由返回的routeMapRecord对应关系在返回监听时刷新接口之后清除
      Object.keys(routeMapRecord).map((item) => {
        const dynamicRoutingIsBackForDeleteValue = getSeesionObject('dynamicRoutingIsBackForDelete');
        if (dynamicRoutingIsBackForDeleteValue.keepAliveModuleName === item) {
          deleteFromSessionObject('routeMapRecord', dynamicRoutingIsBackForDeleteValue.keepAliveModuleName);
        }
      });
    }

    // 删除规则五： 如果来源为插件界面，关闭当前tab时，应清除dynamicRoutingIsBack标记，以及dynamicRoutingIsBackForDelete内存储的当前表的关系
    Object.keys(routeMapRecord).map((item) => {
      const fromPath = routeMapRecord[item].substring(1, 7) === 'PLUGIN';
      if (fromPath) {
        deleteFromSessionObject('routeMapRecord', item);
      }
    });

    // 删除规则四：关闭页签时，清除单对象动态路由跳转类型跳转的session中存储的对应关系。
    const routeMapRecordForSingleObject = getSeesionObject('routeMapRecordForSingleObject');
    Object.keys(routeMapRecordForSingleObject).map((item) => {
      if (tabRouteFullPath === item) {
        deleteFromSessionObject('routeMapRecordForSingleObject', tabRouteFullPath);
      }
    });

    // 删除规则六： 关闭页签时，清除定制界面跳转单对象界面session中存储的对应关系
    const routeMapRecordForCustomizePage = getSeesionObject('routeMapRecordForCustomizePage');
    Object.keys(routeMapRecordForCustomizePage).map((item) => {
      const index = tab.routeFullPath.lastIndexOf('\/');  
      const tabPath = tab.routeFullPath.substring(0, index + 1);
      if (item.includes(tabPath)) {
        deleteFromSessionObject('routeMapRecordForCustomizePage', item);
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
    // gateWay:网关
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
    // if (state.serviceIdMap[tableName] === undefined) {
    //   const serviceIdMapObj = {
    //     k: tableName,
    //     v: serviceId
    //   };
    //   updateSessionObject('serviceIdMap', serviceIdMapObj);// serviceId因刷新后来源信息消失，存入session
    // }
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
      path = `${STANDARD_TABLE_LIST_PREFIX}/${tableName}/${tableId}`;
      const query = {
        isBack: true
      };
      state.treeTableListData.map((item) => { // 支持树结构列表界面单对象返回列表
        if (item.value === tableName && item.id === Number(tableId)) {
          query.isTreeTable = true;
        }
      });
      const routeInfo = {
        path,
        query
      };
  
      router.push(routeInfo);
    }
  },
  tabOpen(state, {// 打开一个新tab添加路由
    back, type, tableName, tableId, id, customizedModuleName, customizedModuleId, linkName,
    linkId, url, label, serviceId, dynamicRoutingForCustomizePage
  }) {
    // back:返回标志, 
    // type:跳转类型,
    // tableName:主表表名,
    // tableId:主表ID,
    // id:明细ID,
    // serviceId:网关,
    // customizedModuleName:自定义界面组件名称
    // customizedModuleId:自定义界面ID，
    // linkName:外链界面名称，
    // linkId:外链界面ID,
    // label：中文tab名称，
    // url:固定格式url（按照框架路由规则拼接好的）,
    // serviceId
    // dynamicRoutingForCustomizePage:自定义界面跳转至单对象界面，为true时可返回来源的单对象界面
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
    // if (state.serviceIdMap[tableName] === undefined) {
    //   const serviceIdMapObj = {
    //     k: tableName,
    //     v: serviceId
    //   };
    //   updateSessionObject('serviceIdMap', serviceIdMapObj);// serviceId因刷新后来源信息消失，存入session
    // }
    let path = '';
    if (type === STANDARD_TABLE_LIST_PREFIX || type === 'S') {
      if (url) {
        path = `${url.toUpperCase()}`;
      } else {
        path = `${STANDARD_TABLE_LIST_PREFIX}/${tableName}/${tableId}`;
      }
    } 
    if (type === 'tableDetailHorizontal' || type === 'H') {
      if (dynamicRoutingForCustomizePage) {
        window.sessionStorage.setItem('dynamicRoutingForCustomizePage', true);
      }

      if (url) {
        path = `${url.toUpperCase()}`;
      } else {
        path = `${HORIZONTAL_TABLE_DETAIL_PREFIX}/${tableName}/${tableId}/${id}`;
      }
    } 
    if (type === 'tableDetailVertical' || type === 'V') {
      if (dynamicRoutingForCustomizePage) {
        window.sessionStorage.setItem('dynamicRoutingForCustomizePage', true);
      }
      if (url) {
        path = `${url.toUpperCase()}`;
      } else {
        path = `${VERTICAL_TABLE_DETAIL_PREFIX}/${tableName}/${tableId}/${id}`;
      }
    }
    if (type === 'tableDetailAction' || type === 'C') {
      if (url) {
        if (url.includes('?')) {
          // 以下逻辑为处理，传入的url中包含路由参数时，不改变参数部分，将基础路由信息转为大写
          const urlRes = url.substring(url.indexOf('?'), 0);// 获取？之前路由信息，
          const urlToUpperCase = urlRes.toUpperCase();// 将基础路由信息转大写
          const urlNew = url.replace(urlRes, urlToUpperCase);// 替换原路由基础路由部分为转大写之后的字符
          path = urlNew;
          if (label) {
            customizedModuleName = urlToUpperCase.split('/')[2];
            customizedModuleId = urlToUpperCase.split('/')[3];
          }
        } else {
          path = `${url.toUpperCase()}`;
          if (label) {
            customizedModuleName = path.split('/')[2];
            customizedModuleId = path.split('/')[3];
          }
        }
      } else {
        path = `${CUSTOMIZED_MODULE_PREFIX}/${customizedModuleName.toUpperCase()}/${customizedModuleId}`;
      }
      if (label) {
        const data = {
          customizedModuleName,
          customizedModuleId,
          label
        };
        setCustomeLabel(data);
      }
    } 
    if (type === 'tableDetailUrl' || type === 'URL') {
      if (url) {
        path = `${url.toUpperCase()}`;
      } else {
        path = `${LINK_MODULE_PREFIX}/${linkName.toUpperCase()}/${linkId}`;
      }
    }
    if (back) {
      const routeMapRecordForCustomizePage = getSeesionObject('routeMapRecordForCustomizePage');
     
      if (routeMapRecordForCustomizePage[router.currentRoute.fullPath]) {
        const CustomizePagePath = routeMapRecordForCustomizePage[router.currentRoute.fullPath];
        Object.keys(routeMapRecordForCustomizePage).map((item) => {
          if (router.currentRoute.fullPath === item) {
            deleteFromSessionObject('routeMapRecordForCustomizePage', router.currentRoute.fullPath);
          }
        });
      
        // const flag = state.openedMenuLists.filter((d, i) => { // 判断单对象界面要返回来源定制界面是否在前一个
        //   if (d.tableName === router.currentRoute.params.tableName) {
        //     d.index = i;
        //     if (i !== 0 && state.openedMenuLists[i - 1].routeFullPath === CustomizePagePath) { // 当自定义及界面要跳转的单对象界面位置不是第一个时
        //       return true;
        //     }
        //   }
        //   return false;
        // })[0];
        const dom = document.querySelector(`#${router.currentRoute.params.tableName}_TAB`);
        dom.click();
        // if (state.openedMenuLists.length > 1) { // 框架路由tab逻辑为刷新浏览器保留最后一个打开的tab页签，则关闭当前会自动激活前一个
        router.push(CustomizePagePath);
        // }
        
        // state.openedMenuLists.map((menu) => {
        //   if (menu.routeFullPath === CustomizePagePath) {
        //     menu.isActive = true;
        //     state.activeTab = menu;
        //     // setTimeout(() => {
        //     //   state.openedMenuLists.splice(index, 1);
        //     //   console.log(3, state.openedMenuLists);
        //     // }, 500);
        //   }
        // });
      } else {
        path = `${STANDARD_TABLE_LIST_PREFIX}/${tableName}/${tableId}`;
        const query = {
          isBack: true
        };
        state.treeTableListData.map((item) => { // 支持树结构列表界面单对象返回列表
          if (item.value === tableName && item.id === Number(tableId)) {
            query.isTreeTable = true;
          }
        });
        const routeInfo = {
          path,
          query
        };
        router.push(routeInfo);
      }
      return;
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
  },
  updateFavoriteData(state, data) { // 收藏
    state.favorite = data.data;
  },

  
};
