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
    },
    addExcludedComponents(state, path) {
      let component = null;
      component = `${path.keepAliveModuleName}`;
      if (state.history.indexOf(component) !== -1) {
        state.history.push(component);
      } 
    },
    TabCloseAppoint(state, tab) {
      // const activeTab = state.activeTab;
      const selectTabs = state.openedMenuLists;
      for (const index in selectTabs) {
        if (selectTabs[index].keepAliveModuleName === tab.keepAliveModuleName) {
          selectTabs.splice(index, 1);
          break;
        }
      }
      if (selectTabs.keepAliveModuleName === tab.keepAliveModuleName) {
        if (state.selectedTabs.length > 0) {
          state.activeTab = selectTabs[selectTabs.length - 1];
          router.push({
            path: state.activeTab.path,
          });
        } else {
          state.activeTab = {
            isActive: false,
            keepAliveModuleName: '',
            label: '',
          };
          state.openedMenuLists = [];
          router.push('/');
        }
      }
    }, // 关闭当前tab
    switchActiveTab(state, tab) {
      const openedMenuLists = state.openedMenuLists;
      console.log(3, openedMenuLists.keepAliveModuleName);

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
