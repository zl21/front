import actions from '../actions/verticalTableDetail.actions';
import mutations from '../mutations/verticalTableDetail.mutations';

export default () => ({
  namespaced: true,
  state: {
    mainFormInfo: {
      tableName: null,
      tableId: null,
      itemId: null,
      buttonsData: { // 主表按钮数据
        data: {}
      },
      formData: {
        isShow: false,
        data: {} // 主表面板数据
      }
    },
    tabPanels: [], // tab数据
    tabCurrentIndex: 0,
  },
  actions,
  mutations
});
