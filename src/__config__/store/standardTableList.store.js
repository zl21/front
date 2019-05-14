// import actions from '../actions/standardTableList.actions';
import mutations from '../mutations/standardTableList.mutations';
import { Version } from '../../constants/global';

const actions = require(`../actions/version_${Version}/standardTableList.actions`).default;
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
    hideColumn: '',
    colPosition: '',
    fixedColumn: '',
    buttons: {
      dataArray: {
        printValue: false, // 是否显示打印
        actionCollection: true, // 是否显示收藏
        collectiImg: false, // 是否收藏
        search: true,
        waListButtonsConfig: {// 自定义按钮
          waListButtons: []
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
      // waListButtons: [],
      query: {// 页面跳转参数
        id: '',
        name: ''
      },
      tableName: '',
      tableId: '',
      // formObj_tableid: this.$route.params.tableId,
      errorData: {}, // 弹框内容
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
      mask: true,
      dialogConfig: {
        title: '提示',
        mask: true,
        footerHide: false,
        contentText: '',
      },
      // errorDialogBack: false, // 是否有返回按钮
      // errorDialogClass: '', // 弹框类型
      // errorDialog: false,
      // errorDialogTitle: '',
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
