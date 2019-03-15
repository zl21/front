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
      currentFormItemsLists: [], // 表单此时的整个item数组
      defaultFormItemsLIsts: [], // 整个表单请求的item数组
    },
    buttons: {
      tabcmd: {},
      waListButtons: [],
      query: {// 页面跳转参数
        id: '',
        name: ''
      },
      // formObj_tableid: this.$route.params.tableId,
      errorData: [], // 弹框内容
      excludedComponents: [], // 针对性缓存相应的组件

      
    }
  },
  actions,
  mutations
});
