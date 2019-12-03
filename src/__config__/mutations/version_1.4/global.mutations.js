import {
  VERTICAL_TABLE_DETAIL_PREFIX,
  HORIZONTAL_TABLE_DETAIL_PREFIX,
  STANDARD_TABLE_LIST_PREFIX,
  STANDARD_TABLE_COMPONENT_PREFIX,
  CUSTOMIZED_MODULE_COMPONENT_PREFIX,
  CUSTOMIZED_MODULE_PREFIX,
  LINK_MODULE_COMPONENT_PREFIX,
  LINK_MODULE_PREFIX,
  enableKeepAlive
} from '../../../constants/global';
import router from '../../router.config';
import customize from '../../customize.config';
import { getSeesionObject, updateSessionObject } from '../../../__utils__/sessionStorage';


export default {
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
        const obj = {
          customizedModuleName,
          id: param.id
        };
        window.sessionStorage.setItem('customizedMessage', JSON.stringify(obj));
        Object.keys(customize).forEach((customizeName) => {
          const nameToUpperCase = customizeName.toUpperCase();
          if (nameToUpperCase === customizedModuleName) {
            const labelName = customize[customizeName].labelName;
            const name = `C.${customizedModuleName}.${param.id}`;
            state.keepAliveLabelMaps[name] = `${labelName}`;
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
                const index = c.url.lastIndexOf('/');
                const customizedModuleName = c.url.substring(index + 1, c.url.length);
                a[`${CUSTOMIZED_MODULE_COMPONENT_PREFIX}.${customizedModuleName.toUpperCase()}.${c.id}`] = c.label;
              }
            }
          } else if (c.type === 'table') {
          // 标准列表的处理
            a[`${STANDARD_TABLE_COMPONENT_PREFIX}.${c.value}.${c.id}`] = c.label;
          }
          return a;
        }, {});

      state.serviceIdMap = menuLists.map(d => d.children)
        .reduce((a, c) => a.concat(c))
        .map(d => d.children)
        .reduce((a, c) => a.concat(c))
        .filter(d => d.type === 'table' || d.type === 'action')
        .reduce((a, c) => {
          a[c.value.toUpperCase()] = c.serviceId;
          return a;
        }, {});
    }

    // 以下逻辑是为了解决菜单外路由跳转提供信息
    const customizedMessage = JSON.parse(window.sessionStorage.getItem('customizedMessage'));
    const tableDetailUrlMessage = JSON.parse(window.sessionStorage.getItem('tableDetailUrlMessage'));
    const customizedMessageForbutton = JSON.parse(window.sessionStorage.getItem('customizedMessageForbutton'));
    if (customizedMessageForbutton) { // 取按钮跳转定制界面label
      state.keepAliveLabelMaps[customizedMessageForbutton.customizedName] = `${customizedMessageForbutton.customizedLabel}`;
    }

    if (tableDetailUrlMessage) { // 取按钮跳转外链label
      const labelName = tableDetailUrlMessage.linkName;
      const name = `L.${tableDetailUrlMessage.linkName.toUpperCase()}.${tableDetailUrlMessage.linkId}`;
      state.keepAliveLabelMaps[name] = `${labelName}`;
      const linkUrl = {};
      linkUrl[tableDetailUrlMessage.linkId] = tableDetailUrlMessage.linkUrl;
      state.LinkUrl.push(linkUrl); // 方便记录外部链接的跳转URL
      state.keepAliveLabelMaps[name] = `${tableDetailUrlMessage.linkLabel}`;
    }

    
    if (customizedMessage) {
      Object.keys(customize).forEach((customizeName) => { // 处理列表界面跳转定制界面label获取问题
        const nameToUpperCase = customizeName.toUpperCase();
        if (nameToUpperCase === customizedMessage.customizedModuleName) {
          const labelName = customize[customizeName].labelName;
          const name = `C.${customizedMessage.customizedModuleName.toUpperCase()}.${customizedMessage.id}`;
          state.keepAliveLabelMaps[name] = `${labelName}`;
        }
      });
    }
    state.keepAliveLabelMaps = Object.assign({}, state.keepAliveLabelMaps, getSeesionObject('keepAliveLabelMaps'));
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
    console.log('0', state.keepAliveLists);
    console.log(1, name);
    state.keepAliveLists.splice(state.keepAliveLists.indexOf(name), 1);

    console.log(2, state.keepAliveLists);
  },
  toggleActiveMenu(state, index) {
    state.openedMenuLists.forEach((d) => { d.isActive = false; });
    state.openedMenuLists[index].isActive = true;
  },
  forceUpdateOpenedMenuLists(state, { openedMenuInfo, index }) {
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
    const { openedMenuLists } = state;
    const tabRouteFullPath = tab.routeFullPath;
    // 如果关闭某个Tab，则清空所有该模块可能的对应的keepAlive信息。
    state.keepAliveLists = state.keepAliveLists.filter(d => d.indexOf(tab.tableName) === -1);
    openedMenuLists.forEach((item, index) => {
      if (item.routeFullPath === tabRouteFullPath) {
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
    back, type, tableName, tableId, id, label, gateWay
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
      state.serviceIdMap[tableName] = `${gateWay}`;
      const keepAliveLabelMapsObj = {
        k: keepAliveModuleName,
        v: label
      };
     
      updateSessionObject('keepAliveLabelMaps', keepAliveLabelMapsObj);// keepAliveLabel因刷新后来源信息消失，存入session
    }
    if (state.serviceIdMap[tableName] === undefined) {
      const serviceIdMapObj = {
        k: tableName,
        v: gateWay
      };
      updateSessionObject('serviceIdMap', serviceIdMapObj);// serviceId因刷新后来源信息消失，存入session
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
    linkId, url, label, gateWay
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
      state.serviceIdMap[tableName] = `${gateWay}`;
      const keepAliveLabelMapsObj = {
        k: keepAliveModuleName,
        v: label
      };
     
      updateSessionObject('keepAliveLabelMaps', keepAliveLabelMapsObj);// keepAliveLabel因刷新后来源信息消失，存入session
    }
    if (state.serviceIdMap[tableName] === undefined) {
      const serviceIdMapObj = {
        k: tableName,
        v: gateWay
      };
      updateSessionObject('serviceIdMap', serviceIdMapObj);// serviceId因刷新后来源信息消失，存入session
    }
    let path = '';
    if (type === STANDARD_TABLE_LIST_PREFIX) {
      path = `${STANDARD_TABLE_LIST_PREFIX}/${tableName}/${tableId}`;
    } else if (type === 'tableDetailHorizontal') {
      path = `${HORIZONTAL_TABLE_DETAIL_PREFIX}/${tableName}/${tableId}/${id}`;
    } else if (type === 'tableDetailVertical') {
      path = `${VERTICAL_TABLE_DETAIL_PREFIX}/${tableName}/${tableId}/${id}`;
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
    state.serviceIdMap[tableName] = `${gateWay}`;
  }

  
};
