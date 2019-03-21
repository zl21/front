import actions from '../actions/global.actions';
import mutations from '../mutations/global.mutations';

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
    activeTab: {},
    // excludedComponents: []
  },
  mutations,
  actions,
};
