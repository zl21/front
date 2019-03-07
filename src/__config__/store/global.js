import network from '../../__utils__/network';
import { STANDARD_TABLE_COMPONENT_PREFIX } from '../../constants/global';
import router from '../router.config';

export default {
  namespaced: true,
  state: {
    primaryMenuIndex: -1,
    collapseHistoryAndFavorite: false,
    history: [],
    favorite: [],
    menuLists: [],
    openedMenuLists: [],
    keepAliveLists: [],
    keepAliveLabelMaps: {},
    selectedTabs: [], // 当前点击
    activeTab: {

    },
  },
  mutations: {
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
      state.history = history;
      state.favorite = favorite;
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
    increaseOpenedMenuLists(state, { label, keepAliveModuleName }) {
      if (state.openedMenuLists.filter(d => d.label === label && d.keepAliveModuleName === keepAliveModuleName).length === 0) {
        state.openedMenuLists.forEach((d) => { d.isActive = false; });
        
        state.openedMenuLists = state.openedMenuLists.concat([{
          label,
          keepAliveModuleName,
          routeFullPath: router.currentRoute.fullPath,
          isActive: true,
          
        }]);
      }
    },
    emptyTabs(state) {
      state.openedMenuLists = [];
      state.keepAliveLists = [];
    },
    selectKeepAliveList(state, path) {
      let component = null;
      component = `${path.keepAliveModuleName}`;
      state.keepAliveLists.forEach((element, index) => {
        if (element === component) {
          state.keepAliveLists.splice(index, 1);
        } 
      });
    }, // 清除当前tab的keepAlive
    TabCloseAppoint(state, tab) {
      const selectTabs = state.openedMenuLists;
      const tabRouteFullPath = tab.routeFullPath;
      for (const index in selectTabs) {
        if (selectTabs[index].routeFullPath === tab.routeFullPath) {
          selectTabs.splice(index, 1);
          break;
        }
      }
      selectTabs.forEach(() => { // 关闭当前tab时始终打开的是最后一个tab
        if (tabRouteFullPath) {
          if (selectTabs) {
            const lastLength = selectTabs.length - 1;
            state.activeTab = selectTabs[lastLength];
            Object.assign(state.activeTab, { isActive: true });
            router.push({
              path: state.activeTab.path,
            });
          }
        }
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
      Object.assign(state.activeTab, { isActive: true });
    }
  },
 
  actions: {
    getHistoryAndFavorite({ commit }) {
      network.post('/p/cs/getHistoryAndFavorite').then((res) => {
        const { history, favorite } = res.data.data;
        commit('updateHistoryAndFavorite', { history, favorite });
      });
    },
    getMenuLists({ commit }) {
      network.post('/p/cs/getSubSystems').then((res) => {
        commit('updateMenuLists', res.data.data);
      });
    },
    emptyTabs({ commit }) {
      commit('emptyTabs');
      // commit.state.openedMenuLists = [];
    },
  },
  
};
