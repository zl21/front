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


export default {
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

            console.log(actionType);
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
    const customizedMessage = JSON.parse(window.sessionStorage.getItem('customizedMessage'));
    if (customizedMessage) {
      Object.keys(customize).forEach((customizeName) => { // 处理列表界面跳转定制界面label获取问题
        const nameToUpperCase = customizeName.toUpperCase();
        if (nameToUpperCase === customizedMessage.customizedModuleName) {
          const labelName = customize[customizeName].labelName;
          const name = `C.${customizedMessage.customizedModuleName}.${customizedMessage.id}`;
          state.keepAliveLabelMaps[name] = `${labelName}`;
        }
      });
    }
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
    back, type, tableName, tableId, id
  }) {
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
    type, tableName, tableId, id, customizedModuleName, customizedModuleId, url, label
  }) {
    let path = '';
    if (type === 'tableDetailHorizontal') {
      path = `${HORIZONTAL_TABLE_DETAIL_PREFIX}/${tableName}/${tableId}/${id}`;
      router.push({
        path
      });
    }
    if (type === 'tableDetailVertical') {
      path = `${VERTICAL_TABLE_DETAIL_PREFIX}/${tableName}/${tableId}/${id}`;
      router.push({
        path
      });
    }
    if (type === 'tableDetailAction') {
      if (url) {
        path = `${CUSTOMIZED_MODULE_PREFIX}/${url.toUpperCase()}`;
        const routeInfo = {
          path,
          query: { label }
        };
        router.push(routeInfo);
      } else {
        path = `${CUSTOMIZED_MODULE_PREFIX}/${customizedModuleName.toUpperCase()}/${customizedModuleId}`;
      }
      router.push({
        path
      });
    }
  
    if (type === 'tableDetailUrl') {
      path = `${LINK_MODULE_PREFIX}/${tableName.toUpperCase()}/${tableId}`;
      router.push({
        path
      });
    }
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
