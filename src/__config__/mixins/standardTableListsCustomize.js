
export default () => ({
  data() {
    return {
    };
  },
  created() {
  },
  mounted() {
  },
  methods: {
    R3_searchBefore(obj) { // 列表界面查询按钮前置事件，可通过该事件改变查询接口参数
      // obj:{//参数解释
      //   callBack:promise
      // }
      this.searchData.isfresh = true;
      obj.callBack().then(() => {
        delete this.searchData.isfresh;
      });
    },
    onCellSingleClick_type_link(obj) {
      // obj:{
      //   colDef:当前表格明细参数,
      //   rowData:当前明细对应的接口返回的元数据
      // }
      const query = {};
      const queryArray = obj.colDef.customerurl.refobjid.split(',');
      if (queryArray.length > 0) {
        queryArray.reduce((a, o) => {
          if (obj.rowData[o] && obj.rowData[o].val) query[o] = obj.rowData[o].val;
        }, {});
      }
      const param = {
        url: obj.colDef.customerurl.tableurl, // 跳转的外链界面内加载的iframe的src地址，即加载的页面地址
        query, // 地址携带的参数
        label: obj.colDef.customerurl.reftabdesc, // 外链界面对应的Tab展示名称
        isMenu: true, // 设置了label则该参数必须设置为true
        lingkName: obj.colDef.customerurl.linkname, // 外链界面表名，作为路由参数
        linkId: obj.rowData.ID.val, // 外链界面表ID，作为路由参数
      };
      
      this.directionalRouter(param);// 定向路由跳转方法
    }
  },
  computed: {
  },
  updated() {
  }
});
