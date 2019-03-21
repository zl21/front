import actions from '../actions/standardTableList.actions';
import mutations from '../mutations/standardTableList.mutations';

export default () => ({
  namespaced: true,
  state: {
    ag: {
      datas: {},
      status4css: [], // 图例数据
    },
    formItems: {
      data: {}, // 整个表单的数据对象
      defaultFormItemsLists: [], // 整个表单请求的item数组
    },
    buttons: {
      dataArray: {
        printValue: false,
       
        actionCollection: true,
        collectiImg: false, // 是否收藏
        waListButtonsConfig: {
          waListButtons: []
        },
        buttonGroupShowConfig: {
          buttonGroupShow: []
        },
        btnclick: (type, item) => {
          const self = this;
          return self.buttonClick(type, item);
        }
      },
      
      tabcmd: {},
      waListButtons: [],
      query: {// 页面跳转参数
        id: '',
        name: ''
      },
      tableName: '',
      tableId: '',
      // formObj_tableid: this.$route.params.tableId,
      errorData: [], // 弹框内容
      excludedComponents: [], // 针对性缓存相应的组件
      selectIdArr: [], // 保存选中的数据id
      selectArr: [], // 保存选中数据全部信息
      dynamicRequestUrl: {},
      searchobj: {}, // 查询条件
      isFold: false,
      isBig: false,
      isSolr: false, // 合计是否同时在检索中请求
      objTableUrl: '', // 判断双击跳转是否是单对象
      activeTabAction: {},
      exeActionData: {},
      getActionData: {},
      importData: {
        // 导出提示
        importDialog: false,
        importDialogTitle: '',
        // mainTable: this.$route.query.tableName,
        // mainId: this.$route.query.id
      },
      importParameters: {},
      importTemplate: {},
      errorDialogBack: false, // 是否有返回按钮
      errorDialogClass: '', // 弹框类型

      errorDialog: '',
      errorDialogTitle: '',


    }
  },
  actions,
  mutations
});
