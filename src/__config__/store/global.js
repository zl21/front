export default {
  namespaced: true,
  state: {
    primaryMenuIndex: -1
  },
  mutations: {
    changeSelectedPrimaryMenu(state, index) {
      state.primaryMenuIndex = index;
    },
    hideMenu(state) {
      state.primaryMenuIndex = -1;
    }
  }
};
