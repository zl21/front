/* eslint-disable import/no-dynamic-require */
// import actions from '../actions/verticalTableDetail.actions';
// import mutations from '../mutations/verticalTableDetail.mutations';
import { Version } from '../../constants/global';

const mutations = () => require(`../mutations/version_${Version()}/verticalTableDetail.mutations`).default;
const actions = () => require(`../actions/version_${Version()}/verticalTableDetail.actions`).default;

export default () => ({
  namespaced: true,
  state: {
    mainFormInfo: {
      tablename: null,
      tableid: null,
      buttonsData: { // 主表按钮数据
        data: ({}),
        newMainTableSaveData: {}, // 主表新增保存返回data
      },
      formData: {
        isShow: false,
        data: ({}) // 主表面板数据
      }
    },
    tabPanels: [], // tab数据
    tabCurrentIndex: 0, // 当前tab的index
    updateData: {}, // 更新的数据
    buttonsData: {
    },
    copy: false,
    defaultDataForCopy: {},
    copyDataForReadOnly: {}, // 复制按钮操作用作判断是否是只读类型
    tooltipForItemTable: [], // 子表操作失败提示
    tablePageInfo: {
      currentPageIndex: 1,
      pageSize: 10
    },
    childTableReadonly: false, // 子表是否为只读状态
    objTabActionSlientConfirmData: {},
    LinkageForm: {}, // 所有form
    CompositeForm: {}, // 表单实例
    mappStatus: {},
    defaultButtonData: [], // 业务系统按钮默认数据
    globalLoading: false,
    testData: false, // 校验是否更改过值
    WebConf: {},
    ExeActionDataForComponent: {},
    itemObjId: null, // 子表1:1ID
    isHideTempStorage: false, // 为true时隐藏单对象配置的暂存按钮
    clickSaveFunction: {},
    updataVerifyRequiredInformation: {},
    saveInfo: {},
    testUpdata: {},
  },
  actions: actions(),
  mutations: mutations()
});
