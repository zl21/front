/* eslint-disable import/no-dynamic-require */

// const actions = file => require(`../__component__/${file}.vue`).default;
import { Version } from '../../constants/global';

// import actions from '../actions/version_1.4/global.actions';
// import mutations from '../mutations/global.mutations';
const mutations = require(`../mutations/version_${Version()}/global.mutations`).default;

const actions = require(`../actions/version_${Version()}/global.actions`).default;
export default {
  namespaced: true,
  state: {
    lastIndex: -1, // 当前点击的menu下标
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
