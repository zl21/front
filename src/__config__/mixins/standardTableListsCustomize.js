
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
  },
  computed: {
  },
  updated() {
  }
});
