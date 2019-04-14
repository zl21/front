import actions from '../actions/verticalTableDetail.actions';
import mutations from '../mutations/verticalTableDetail.mutations';

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
    updateData: {} // 更新的数据
  },
  actions,
  mutations
});
