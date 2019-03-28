import actions from '../actions/horizontalTableDetail.actions';
import mutations from '../mutations/horizontalTableDetail.mutations';

export default () => ({
  namespaced: true,
  state: {
    tabPanels: [], // tab数据
    buttonsTabcmd: {}, // 按钮数据
    buttonsTabwebact: {}, // 动作定义按钮数据
    formData: [], // 表单数据
    tableData: {} // 表格数据
  },
  actions,
  mutations
});
