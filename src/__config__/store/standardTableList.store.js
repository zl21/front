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
      searchFoldnum: '', // 表单展示行数
    },
    buttons: {
      dataArray: {
        printValue: false,
        actionCollection: false,
        collectiImg: false, // 是否收藏
        waListButtonsConfig: {// 自定义按钮
          waListButtons: [
            {
              // action: ' /SYSTEM/TABLE/AD_TABLE',
              // actiontype: 'url',
              // confirm: null,
              // cuscomponent: null,
              // ishide: false,
              // isrefrsh: true,
              // vuedisplay: 'dialog',
              // webdesc: '验收',
              // webicon: null,
              // webid: 2461,
              // webname: 'DL_B_STORE_PAL_SUM',
              action: 'Dialog/Confirm',
              actiontype: 'rpc',
              confirm: '{"isselect":true,"nodesc":"请先选择需要启用的记录"}',
              cuscomponent: null,
              ishide: false,
              isrefrsh: false,
              vuedisplay: 'dialog',
              webdesc: 'VIP账户启用',
              webicon: null,
              webid: 2187,
              webname: 'VP_C_VIP_ACCEnable',
            },
          
          ]
        },
        buttonGroupShowConfig: {// 标准按钮
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
      errorDialog: false,
      errorDialogTitle: '',
      detailState: true, // 是否可以双击查看或点击序号查看
      actionLoading: true,
      batchSubmitData: {}, // 批量提交返回数据
      sysmentArr: [], // 系统数据
      selectSysment: [], // 选中的系统数据，
      batchUnSubmitData: {}, // 批量反提交返回数据
      batchDeleteData: {}, // 删除返回数据
      dialogComponent: null, // 静默按钮需要渲染的组件
      actionDialog: { // 自定义动作弹框
        show: false,
        title: '',
        queryString: '',
      },
      
    }
  },
  actions,
  mutations
});
