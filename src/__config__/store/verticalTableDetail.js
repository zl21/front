import actions from '../actions/verticalTableDetail.actions';
import mutations from '../mutations/verticalTableDetail.mutations';

export default () => ({
  namespaced: true,
  state: {
    mainFormInfo: {
      tablename: null,
      tableid: null,
      buttonsData: { // 主表按钮数据
        data: ({})
      },
      formData: {
        isShow: false,
        data: ({}) // 主表面板数据
      }
    },
    tabPanels: [], // tab数据
    tabCurrentIndex: 0,
    checkTipsInfo: {
      formInfo: [],
      panelFormInfo: [],
      tableInfo: []
    }
  },
  actions,
  mutations
});
