import {
  HORIZONTAL_TABLE_DETAIL_PREFIX,
  VERTICAL_TABLE_DETAIL_PREFIX, STANDARD_TABLE_COMPONENT_PREFIX
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
    state.keepAliveLabelMaps = JSON.parse(JSON.stringify(menuLists))
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
  },
  increaseKeepAliveLists(state, name) {
    if (!state.keepAliveLists.includes(name)) {
      state.keepAliveLists = state.keepAliveLists.concat([name]);
    }
  },
  increaseOpenedMenuLists(state, {
    label,
    keepAliveModuleName,
    type,
    id,
    tableName,
    routeFullPath
  }) {
    if (state.openedMenuLists.filter(d => d.label === label && d.keepAliveModuleName === keepAliveModuleName).length === 0) {
      state.openedMenuLists.forEach((d) => {
        d.isActive = false;
      });
      state.openedMenuLists = state.openedMenuLists.concat([{
        label,
        keepAliveModuleName,
        routeFullPath,
        isActive: true,
      }]);
      state.activeTab = {
        id,
        isActive: true,
        keepAliveModuleName,
        label,
        routeFullPath,
        tableName,
        type,
      };
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
  TabCloseAppoint(state, tab) {
    const selectTabs = state.openedMenuLists;
    const tabRouteFullPath = tab.routeFullPath;

    selectTabs.forEach((item, index) => {
      if (item.routeFullPath === tab.routeFullPath) {
        selectTabs.splice(index, 1);
      }
      if (tabRouteFullPath) {
        if (selectTabs.length > 0) {
          const lastLength = selectTabs.length - 1;
          state.activeTab = selectTabs[lastLength]; // 关闭当前tab时始终打开的是最后一个tab
          state.activeTab.isActive = true;
          router.push({
            path: state.activeTab.routeFullPath,
          });
        } else {
          router.push('/');
        }
      } 
    });
  }, // 关闭当前tab
  switchActiveTab(state, tab) {
    const openedMenuLists = state.openedMenuLists;
    openedMenuLists.forEach((element, index) => {
      element.isActive = false;
      if (openedMenuLists[index].keepAliveModuleName === tab.keepAliveModuleName) {
        state.activeTab = state.openedMenuLists[index];
      }
    });
    state.activeTab.isActive = true;
    if (tab.type === 'singleView' || tab.type === 'singleObject') {
      const component = tab.routeFullPath;
      const index = state.excludedComponents.indexOf(component);
      if (index > -1) {
        state.excludedComponents.splice(index, 1);
      }
    }
  },
  TabHref(state, {
    type, tableName, tableId, label, val 
  }) {
    let path = '';
    let ModuleName = '';
    if (type === 'tableDetailHorizontal') {
      path = `${HORIZONTAL_TABLE_DETAIL_PREFIX}/${tableName}/${tableId}/${val}`;
      ModuleName = `${HORIZONTAL_TABLE_DETAIL_PREFIX}.${tableName}.${tableId}.${val}`;
      router.push({
        path
      });
    }
    if (type === 'tableDetailVertical') {
      path = `${VERTICAL_TABLE_DETAIL_PREFIX}/${tableName}/${tableId}/${val}`;
      ModuleName = `${VERTICAL_TABLE_DETAIL_PREFIX}.${tableName}.${tableId}.${val}`;

      router.push({
        path
      });
    }
    const afterClickActiveTab = {
      routeFullPath: path,
      isActive: true,
      keepAliveModuleName: ModuleName,
      label,
    };
    state.openedMenuLists.forEach((item) => {
      if (item.routeFullPath === state.activeTab.routeFullPath) {
        Object.assign(item, afterClickActiveTab);
        state.activeTab = afterClickActiveTab;
      }
    });
  }
 

};
