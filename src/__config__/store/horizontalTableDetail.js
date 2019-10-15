/* eslint-disable import/no-dynamic-require */
// import actions from '../actions/horizontalTableDetail.actions';
// import mutations from '../mutations/horizontalTableDetail.mutations';
import { Version } from '../../constants/global';

const mutations = () => require(`../mutations/version_${Version()}/horizontalTableDetail.mutations`).default;
const actions = () => require(`../actions/version_${Version()}/horizontalTableDetail.actions`).default;


export default () => ({
  namespaced: true,
  state: {
    tabPanels: [], // tab数据
    tabCurrentIndex: 0, // 当前tab的index
    updateData: {}, // 更新的数据
    buttonsData: {
    },
    copy: false,
    defaultDataForCopy: {}, // 复制 按钮操作保存修改前的数据
    copyDataForReadOnly: {}, // 复制按钮操作用作判断是否是只读类型
    tooltipForItemTable: [], // 子表操作失败提示
    tablePageInfo: {
      currentPageIndex: 1,
      pageSize: 10
    },
    objTabActionSlientConfirmData: {},
    LinkageForm: [], // form 校验
    mappStatus: {}, // 校验联动图
    anotherData: [], // 按钮显示的备份数据
    jflowPluginDataArray: []
  },
  actions: actions(),
  mutations: mutations()
});
