import actions from '../actions/horizontalTableDetail.actions';
import mutations from '../mutations/horizontalTableDetail.mutations';

export default () => ({
  namespaced: true,
  state: {
    tabPanels: [], // tab数据
    buttonsData: {
      isShow: false,
      buttonsTabcmd: {}, // 按钮数据
      buttonsTabwebact: {}, // 动作定义按钮数据
    },
    formData: {
      isShow: false,
      data: []
    }, // 表单数据
    panelData: {
      isShow: false,
      data: []
    }, // 面板数据
    tableData: {
      isShow: false,
      data: {}
    } // 表格数据
  },
  actions,
  mutations
});
