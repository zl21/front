/* eslint-disable import/no-dynamic-require */

// const actions = file => require(`../__component__/${file}.vue`).default;
import { Version } from '../../constants/global';

// import actions from '../actions/version_1.4/global.actions';
import mutations from '../mutations/global.mutations';

const actions = require(`../actions/version_${Version}/global.actions`).default;
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
    userInfo: {}
  },
  mutations,
  actions,
};
