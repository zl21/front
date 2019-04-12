import {
  VERTICAL_TABLE_DETAIL_PREFIX,
  HORIZONTAL_TABLE_DETAIL_PREFIX,
  STANDARD_TABLE_LIST_PREFIX,
  STANDARD_TABLE_COMPONENT_PREFIX,
  HORIZONTAL_TABLE_DETAIL_COMPONENT_PREFIX,
  VERTICAL_TABLE_DETAIL_COMPONENT_PREFIX,
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
        a[c.value] = c.serviceId;
        return a;
      }, {});
  },
  increaseKeepAliveLists(state, name) {
    if (!state.keepAliveLists.includes(name)) {
      state.keepAliveLists = state.keepAliveLists.concat([name]);
    }
  },
  toggleActiveMenu(state, index) {
    state.openedMenuLists.forEach((d) => { d.isActive = false; });
    state.openedMenuLists[index].isActive = true;
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
  }, // 清除当前tab的keepAlive
  tabCloseAppoint(state, tab) {
    const selectTabs = state.openedMenuLists;
    const tabRouteFullPath = tab.routeFullPath;
    state.keepAliveLists.splice(state.keepAliveLists.indexOf(tab.keepAliveModuleName), 1);
    selectTabs.forEach((item, index) => {
      if (item.routeFullPath === tab.routeFullPath) {
        selectTabs.splice(index, 1);
      }
      if (tabRouteFullPath) {
        if (selectTabs.length > 0) {
          const lastLength = selectTabs.length - 1;
          state.activeTab = selectTabs[lastLength]; // 关闭当前tab时始终打开的是最后一个tab
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
    back, label, type, tableName, tableId, id
  }) {
    let path = '';
    let routePrefix = '';
    let keepAliveModuleName = '';
    if (type === 'tableDetailHorizontal') {
      path = `${HORIZONTAL_TABLE_DETAIL_PREFIX}/${tableName}/${tableId}/${id}`;
      routePrefix = HORIZONTAL_TABLE_DETAIL_PREFIX;
      keepAliveModuleName = `${HORIZONTAL_TABLE_DETAIL_COMPONENT_PREFIX}.${tableName}.${tableId}.${id}`;
      router.push({ path });
    }
    if (type === 'tableDetailVertical') {
      path = `${VERTICAL_TABLE_DETAIL_PREFIX}/${tableName}/${tableId}/${id}`;
      routePrefix = VERTICAL_TABLE_DETAIL_PREFIX;
      keepAliveModuleName = `${VERTICAL_TABLE_DETAIL_COMPONENT_PREFIX}.${tableName}.${tableId}.${id}`;
      router.push({ path });
    }
    if (back) {
      Object.keys(state.keepAliveLabelMaps).forEach((item) => {
        if (item.indexOf(`${tableName}.${tableId}`) !== -1) {
          label = state.keepAliveLabelMaps[item];
        }
      });
      path = `${STANDARD_TABLE_LIST_PREFIX}/${tableName}/${tableId}`;
      keepAliveModuleName = `${STANDARD_TABLE_COMPONENT_PREFIX}.${tableName}.${tableId}`;
      router.push({ path });
      state.keepAliveLists.forEach((item, index) => {
        if (item === state.activeTab.keepAliveModuleName) {
          state.keepAliveLists.splice(index, 1);
        }
      });
    }
    const afterClickActiveTab = {
      label,
      keepAliveModuleName,
      routeFullPath: path,
      routePrefix,
      isActive: true,
    };
    state.openedMenuLists.forEach((item) => {
      if (item.routeFullPath === state.activeTab.routeFullPath) {
        Object.assign(item, afterClickActiveTab);
        state.activeTab = afterClickActiveTab;
      }
    });
  },
  tabOpen(state, // 打开新的tab页
    tab) {
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
};
