import { STANDARD_TABLE_COMPONENT_PREFIX } from '../../constants/global';
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
  updateHistoryAndFavorite(state, { history, favorite }) {
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
    label, keepAliveModuleName, type, id, tableName
  }) {
    if (state.openedMenuLists.filter(d => d.label === label && d.keepAliveModuleName === keepAliveModuleName).length === 0) {
      state.openedMenuLists.forEach((d) => { d.isActive = false; });
      state.openedMenuLists = state.openedMenuLists.concat([{
        label,
        keepAliveModuleName,
        routeFullPath: router.currentRoute.fullPath,
        isActive: true,
        type,
        id,
        tableName
      }]);
      state.activeTab = {
        id,
        isActive: true,
        keepAliveModuleName,
        label,
        routeFullPath: router.currentRoute.fullPath,
        tableName,
        type,
      };
    }
  },
  updateActiveMenu({ openedMenuLists }, keepAliveModuleName) {
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
  // selectKeepAliveList(state, path) {
  //   let component = null;
  //   component = `${path.keepAliveModuleName}`;
  //   state.keepAliveLists.forEach((element, index) => {
  //     if (element === component) {
  //       state.keepAliveLists.splice(index, 1);
  //     }
  //   });
  // }, 
  againClickOpenedMenuLists(state, { label, keepAliveModuleName }) {
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
      if (tabRouteFullPath) {
        if (selectTabs) {
          const lastLength = selectTabs.length - 1;
          state.activeTab = selectTabs[lastLength];
          Object.assign(state.activeTab, { isActive: true });
          router.push({
            path: state.activeTab.routeFullPath,
          });
        }
      }
      if (item.routeFullPath === tab.routeFullPath) {
        selectTabs.splice(index, 1);
      }
    });
   
    selectTabs.forEach(() => { // 关闭当前tab时始终打开的是最后一个tab
      
    });
    if (selectTabs < 1) { // 判断当关闭全部tab页时清空路由
      state.activeTab = {
        isActive: false,
        keepAliveModuleName: '',
        label: '',
      };
      state.openedMenuLists = [];
      router.push('/');
    }
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
  addExcludedComponents(state, tab) {
    let component = null;
    component = `${tab.type}.${tab.name}.${tab.id}`;
    if (state.excludedComponents.indexOf(component) === -1) {
      state.excludedComponents.push(component);
    }
  },

};
