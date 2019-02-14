export default {
  namespaced: true,
  state: {
    primaryMenuIndex: -1,
    collapseHistoryAndFavorite: false,
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
  }
};
