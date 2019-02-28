import network from '../../__utils__/network';
import { STANDARD_TABLE_COMPONENT_PREFIX } from '../../constants/global';

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
    keepAliveLabelMaps: {}
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
        state.openedMenuLists = state.openedMenuLists.concat([{ label, keepAliveModuleName }]);
      }
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
  }
};
