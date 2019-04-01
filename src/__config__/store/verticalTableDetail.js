import actions from '../actions/verticalTableDetail.actions';
import mutations from '../mutations/verticalTableDetail.mutations';

export default () => ({
  namespaced: true,
  state: {
    mainFormInfo: {
      tableName: null,
      tableId: null,
      itemId: null,
      buttonsData: {
        buttonsTabcmd: {}, // 主表按钮数据
        buttonsTabwebact: {}, // 主表动作定义按钮数据
      },
      formData: {
        isShow: false,
        data: [] // 主表面板数据
      }
    },
    tabPanels: [], // tab数据
    tabCurrentIndex: 0,
  },
  actions,
  mutations
});
