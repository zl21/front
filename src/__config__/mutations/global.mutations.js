import {
  VERTICAL_TABLE_DETAIL_PREFIX,
  HORIZONTAL_TABLE_DETAIL_PREFIX,
  STANDARD_TABLE_LIST_PREFIX,
  STANDARD_TABLE_COMPONENT_PREFIX,
  CUSTOMIZED_MODULE_COMPONENT_PREFIX
} from '../../constants/global';
import router from '../router.config';

export default {
  changeSelectedPrimaryMenu(state, index) {
    state.primaryMenuIndex = index;
  },
  hideMenu(state) {
    state.primaryMenuIndex = -1;
  },
  doCollapseHistoryAndFavorite(state) {
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
          a[`${CUSTOMIZED_MODULE_COMPONENT_PREFIX}.${c.value.toUpperCase()}.${c.id}`] = c.label;
        }
        if (c.type === 'table') {
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
  },
  increaseKeepAliveLists(state, name) {
    if (!state.keepAliveLists.includes(name)) {
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
      if (item.routeFullPath === tab.routeFullPath) {
        openedMenuLists.splice(index, 1);
      }
      if (tabRouteFullPath) {
        if (openedMenuLists.length > 0) {
          const lastLength = openedMenuLists.length - 1;
          state.activeTab = openedMenuLists[lastLength]; // 关闭当前tab时始终打开的是最后一个tab
          router.push({
            path: state.activeTab.routeFullPath,
          });
        } else {
          router.push('/');
        }
      }
    });
  }, // 关闭当前tab
  tabHref(state, {
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
  tabOpen(state, tab) {
    let path = '';
    if (tab.type === 'tableDetailHorizontal') {
      path = `${HORIZONTAL_TABLE_DETAIL_PREFIX}/${tab.tableName}/${tab.tableId}/${tab.id}`;
      router.push({
        path
      });
    }
    if (tab.type === 'tableDetailVertical') {
      path = `${VERTICAL_TABLE_DETAIL_PREFIX}/${tab.tableName}/${tab.tableId}/${tab.id}`;
      router.push({
        path
      });
    }
    if (tab.type === 'tableDetailAction') {
      path = `${VERTICAL_TABLE_DETAIL_PREFIX}/${tab.tableName}/${tab.tableId}/${tab.pathType}`;
      router.push({
        path
      });
    }
    const afterClickActiveTab = {
      routeFullPath: path,
      isActive: true,
      label: tab.label
    };
    state.openedMenuLists.forEach((item) => {
      if (item.routeFullPath === state.activeTab.routeFullPath) {
        state.openedMenuLists.push(afterClickActiveTab);
        item.isActive = false;
        state.activeTab = afterClickActiveTab;
      }
    });
    // 添加到新的列表中
  },
  deleteCurrentKeepAlive(state) { // 移除当前keepAlive
    console.log(1, state.keepAliveLists);
    debugger;
    state.keepAliveLists.forEach((item, index) => {
      if (item === state.activeTab.keepAliveModuleName) {
        state.keepAliveLists.splice(1, index);
      }
    });
    console.log(2, state.keepAliveLists);
  }
};
