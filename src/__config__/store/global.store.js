/* eslint-disable import/no-dynamic-require */

import { Version } from '../../constants/global';

const mutations = require(`../mutations/version_${Version()}/global.mutations`).default;
const actions = require(`../actions/version_${Version()}/global.actions`).default;
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
    userInfo: {},
    showFavoritesList: '',
    serviceIdMap: {},
    navigatorSetting: [],
    showModule: {
      HistoryAndFavorite: true, // 隐藏收藏夹
      TabLists: true, // 隐藏tab栏
      Navigator: true, // 隐藏菜单栏
    },
    LinkUrl: []
    
  },
  mutations,
  actions,
};
