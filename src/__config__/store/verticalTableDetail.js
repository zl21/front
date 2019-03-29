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
    activaRefFormInfo: { // 当前激活tab子表
      buttonsData: {
        isShow: false,
        buttonsTabcmd: {}, // 按钮数据
        buttonsTabwebact: {}, // 动作定义按钮数据
      },
      formData: {
        isShow: false,
        data: []
      }, // 表单数据
      tableData: {
        isShow: false,
        data: {}
      } // 表格数据
    }
  },
  actions,
  mutations
});
