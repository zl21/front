import network from '../../__utils__/network';

export default {
  namespaced: true,
  state: {
    primaryMenuIndex: -1,
    collapseHistoryAndFavorite: false,
    history: [],
    favorite: [],
    menuLists: [],
    keepAliveLists: []
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
    },
    increaseKeepAliveLists(state, name) {
      if (!state.keepAliveLists.includes(name)) {
        state.keepAliveLists = state.keepAliveLists.concat([name]);
      }
    },
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
