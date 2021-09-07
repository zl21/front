/* eslint-disable import/no-dynamic-require */

import { Version } from '../../constants/global';
import closedImg from '../../assets/image/closed@2x.png';
import openedImg from '../../assets/image/open@2x.png';
import bigDataImg from '../../assets/image/isBig.png';
import logoImg from '../../assets/image/logo.png';
import bannerImg from '../../assets/image/banner.png';
import bannerEnImg from '../../assets/image/logoen2.png';
import bigDataEnImg from '../../assets/image/nodata-en.png';
import loginImg from '../../assets/image/logo.1.png'
import loginEnImg from '../../assets/image/logoen1.png'
import i18n from '../../assets/js/i18n';
console.log("🚀 ~ file: global.store.js ~ line 14 ~ i18n", i18n.locale)

const mutations = () => require(`../mutations/version_${Version()}/global.mutations`).default;
const actions = () => require(`../actions/version_${Version()}/global.actions`).default;

export default () => ({
  namespaced: true,
  state: {
    allMenu: {}, // 全部菜单
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
      bannerImg: i18n.locale === 'zh' ? bannerImg : bannerEnImg,
      bigDataImg: i18n.locale === 'zh' ? bigDataImg : bigDataEnImg,
      loginImg: i18n.locale === 'zh'? loginImg : loginEnImg,
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
      const defaultBanner = language === 'zh' ? bannerImg : bannerEnImg
      const defaultBigData = language === 'zh' ? bigDataImg : bigDataEnImg
      const defaultLogin = language === 'zh' ? loginImg : loginEnImg
      // 没传imageAssets时，需要有个默认值
      let imgsObj = {
        banner: defaultBanner,
        bigData: defaultBigData,
        login: defaultLogin,
        welcome: undefined, // 欢迎页是css实现的，这里写法要区别下
      }

      // 默认图片映射
      // 目前有banner和海量数据图
      const defaultImg = {
        banner: defaultBanner,
        bigData: defaultBigData,
        login: defaultLogin,
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
      console.log('图片资源', imgs)
      return imgs
    }
  },
  mutations: mutations(),
  actions: actions(),
});
