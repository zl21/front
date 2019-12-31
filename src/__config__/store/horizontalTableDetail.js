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
    childTableReadonly: false, // 子表是否为只读状态
    objTabActionSlientConfirmData: {},
    LinkageForm: {}, // form 校验
    mappStatus: {}, // 校验联动图
    defaultButtonData: [], // 业务系统按钮默认数据         
    CompositeForm: {}, // 表单实例
    anotherData: [], // 按钮显示的备份数据
    jflowPluginDataArray: [],
    instanceId: null, // jflow流程标志
    refreshButton: true, // 为方便jflow控制，改为全局状态调用
    jflowWaterMark: null, // jflow水印
    globalLoading: false,
    tempStorage: {
      isenable: true,
      path: '/p/cs/objectSave111'
    }

  },
  actions: actions(),
  mutations: mutations()
});
