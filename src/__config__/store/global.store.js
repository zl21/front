/* eslint-disable import/no-dynamic-require */

import { Version } from '../../constants/global';

const mutations = () => require(`../mutations/version_${Version()}/global.mutations`).default;
const actions = () => require(`../actions/version_${Version()}/global.actions`).default;

export default () => ({
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
    objreadonlyForJflow: {
      readonly: false,
      itemTableName: ''
    }, 
    JflowControlField: {
      // data:[
      //   {
      // readonly: true   不可编辑，false 可编辑，   
      // isnotnull：true 必填，false 不必填  ，
      // display:'none'是不显示，
      // colid：'字段id'，
      // itemTableName:子表表名
      //   }
      // ]
      itemTableName: 'BCP_CUSTOMER_CONTACT_JFLOW',
      isShow: [// 所有可见字段
        169143, // 联系人
        // 169132, // 可用
      ],
      readonly: [// 所有可编辑字段
        169143, // 联系人
        169132, // 可用
      ]
    },
    
  },
  mutations: mutations(),
  actions: actions(),
});
