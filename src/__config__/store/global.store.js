/* eslint-disable import/no-dynamic-require */

import { Version } from '../../constants/global';
import closedImg from '../../assets/image/closed@2x.png';
import openedImg from '../../assets/image/open@2x.png';
import logoImg from '../../assets/image/logo.png';
import bannerImg from '../../assets/image/banner.png';

const mutations = () => require(`../mutations/version_${Version()}/global.mutations`).default;
const actions = () => require(`../actions/version_${Version()}/global.actions`).default;

export default () => ({
  namespaced: true,
  state: {
    // customizeMessage: [], // 存入跳转到定制界面携带的参数    
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
    LinkUrl: [],
    exportTask: {
      dialog: false,
      successMsg: false
    }, // 导出状态
    exportTasks: {},
    taskMessageCount: 0, // 我的任务数量
    currentLoading: [], // 当前tabloading标记
    isRequest: [], // 记录当前tab是否点击过关系
    changeSearchFoldnum: {
      queryDisNumber: null,
      switchValue: false// 为false时列表表单默认展开全部，为true时，展开设置行数
    },
    treeTableListData: [],

    imgSrc: {
      logoImg,
      bannerImg,
      closedImg,
      openedImg
    }
  },
  mutations: mutations(),
  actions: actions(),
});
