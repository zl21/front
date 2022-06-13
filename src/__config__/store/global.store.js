/* eslint-disable import/no-dynamic-require */

import { Version } from '../../constants/global';
import closedImg from '../../assets/image/closed@2x.png';
import openedImg from '../../assets/image/open@2x.png';
import logoImg from '../../assets/image/logo.png';
import bannerImg from '../../assets/image/banner.png';
import bannerEnImg from '../../assets/image/logoen2.png';
import i18n from '../../assets/js/i18n';
const mutations = () => require(`../mutations/version_${Version()}/global.mutations`).default;
const actions = () => require(`../actions/version_${Version()}/global.actions`).default;

export default () => ({
  namespaced: true,
  state: {
    allMenu: {}, // 全部菜单
    // customizeMessage: [], // 存入跳转到定制界面携带的参数    
    primaryMenuIndex: -1,
    collapseHistoryAndFavorite: window.localStorage.getItem('showFavorites') === 'true' ? false : true,
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
    // isRequest: [], // 记录当前tab是否点击过关系
    changeSearchFoldnum: {
      queryDisNumber: null,
      switchValue: false// 为false时列表表单默认展开全部，为true时，展开设置行数
    },
    treeTableListData: [],

    imgSrc: {
      logoImg,
      closedImg,
      openedImg,
      treeImg: undefined,
      bannerImg: i18n.locale === 'zh' ? bannerImg : bannerEnImg,
      bigDataImg: undefined,
      loginImg: undefined,
    },
    isShowDashboardPage: false,
    previewPictureInstance: [], // 记录图片预览实例
    sameNewPage: false,
    switchTag: false
  },
  getters: {
    // 目前含有文字的图片有四处：banner、登录logo、欢迎页、海量数据
    imgAssets(state) { 
      const imageAssets = window.ProjectConfig.imageAssets
      const language = i18n.locale
      
      // 没传imageAssets时，需要有个默认值
      let imgsObj = {
        banner: state.imgSrc.bannerImg,
        bigData: state.imgSrc.bigDataImg,
        login: state.imgSrc.loginImg,
        welcome: undefined, // 欢迎页是css实现的，这里写法要区别下
      }

      // 默认图片映射
      // 目前有banner和海量数据图
      const defaultImg = {
        banner: state.imgSrc.bannerImg,
        bigData: state.imgSrc.bigDataImg,
        login: state.imgSrc.loginImg,
        welcome: undefined,
      }

      if(imageAssets) {
        // 这样写方便以后新增语言时，可以不改逻辑就支持扩展不同语言图片
        Object.keys(defaultImg).forEach(key => {
          const newKey = key.split('-')[0] // 例如'login-zh' 取login作为key
          imgsObj[newKey] = (imageAssets[language] && imageAssets[language][newKey]) || defaultImg[newKey]
        })
      }
      // 优先用项目组传入的定制图片
      const imgs = {
        ...imgsObj
      }
      return imgs
    },
    labelMaps(state) {
      return state.keepAliveLabelMaps
    },
    menuLists(state) {
      return state.openedMenuLists
    }
  },
  mutations: mutations(),
  actions: actions(),
});
