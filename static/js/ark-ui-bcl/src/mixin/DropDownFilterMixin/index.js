import {urlSearchParams} from '../../utils/http.js';
import deepClone from "../../utils/deepClone";

export default {
  props: {  // 接通项目网关
    http: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      newPropsData: {
        AutoData: [],
        data: {},
        defaultSelected: []
      }, // 属性值
      defaultSelected: [],
      pageSize: 10, // 当前表格显示条数
      pageCurrent: 1, // 当前页面
      sendMessage: {},  //  模糊查询头部请求数据
      searchdata: {}, // 表格查询
      localUrl: {}
    };
  },
  computed: {
    propsDataCom() {
      // 属性值
      this.newPropsData = Object.assign(deepClone(this.newPropsData),deepClone(this.PropsData));
      if (this.newPropsData.pageSize) {
        this.pageSize = this.newPropsData.pageSize;
      }
      return this.newPropsData;
    },
    eventFunction() {
      let event_Fun = this.$deepClone(this.EventFun || {}) || {};
      // 函数重组
      let key = [
        'on-fkrp-selected',
        'on-page-change',
        'on-input-value-change',
        'on-focus',
        'on-blur',
        'on-keyup',
        'on-keydown',
        'on-clear',
        'on-popper-show',
        'on-popper-hide'
      ];
      Object.keys(this.eventFun || {}).forEach((e) => {
        let index = key.indexOf(e);
        if (index !== -1) {
          key.splice(index, 1);
        }
      });
      key.forEach((e) => {
        if (this[e]) {
          event_Fun[e] = this[e];
        }
      });
      return event_Fun;
    }
  },
  created() {
    this.$axios = this.http;
    this.$deepClone = deepClone;
    this.$urlSearchParams = urlSearchParams;
    this.handleUrl();
  },
  mounted() {
    if (Array.isArray(this.value)) {
      this.newPropsData.defaultSelected = this.value || [];
    }
  },
  watch: {
    value(value) {
      if (Array.isArray(this.value)) {
        this.newPropsData.defaultSelected = value || [];
      } else {
        this.newPropsData.defaultSelected = [];
      }
    }

  },
  methods: {
    handleUrl() {
      this.localUrl = Object.assign({}, this.Url, this.filterMode ? { tableUrl: this.Url.tableSearchUrl } : {})
    },
    post(url, Message, callback) {
      this.$axios.post(url, Message, {serviceId: this.newPropsData.serviceId}).then((res) => {
        if (res.data.datas) {
          res.data.data = res.data.datas;
        }
        // if (res && res.data && res.data.code === 0) {
        const data = res.data;
        callback(data);
        // }
      });
    },
    valueChange(value, type, event) {
      //console.log(value,type,'1212');
      this.$emit('on-change', value, type, event, this);
    },
    sendAutoMessage(e) {
      // 拼接模糊的传参的数据
      this.sendMessage.ak = e;
      // this.sendMessage.colid = this.newPropsData.colid;
      // this.sendMessage.fixedcolumns = {};
      this.sendMessage = Object.assign(this.AutoRequest || {}, this.sendMessage);
      this.postData(this.localUrl.autoUrl, urlSearchParams(this.sendMessage)).then((data) => {
        this.newPropsData.AutoData = data;
      });
    },
    postData(url, message) {
      // 模糊下拉数据展示    this.newPropsData.AutoData = data;
      let self = this;
      return new Promise((resolve) => {
        self.post(url, message, (res) => {
          resolve(res.data);
        });
      });
    },
    sendTableMessage(page) {
      // 拼接表格的传参的数据
      this.pageCurrent = page;
      this.searchdata = {
        range: this.pageSize,
        startindex: (this.pageSize || 10) * (page - 1),
      }
      this.searchdata = Object.assign(this.TableRequest || {}, this.searchdata);
      this.postTableData(this.localUrl.tableUrl, urlSearchParams({
        searchdata: this.searchdata
      })).then((data) => {
        this.newPropsData.data = Object.assign({}, data.data);
        if (data.data.defaultrange) {
          this.newPropsData.pageSize = data.data.defaultrange;
          this.pageSize = this.newPropsData.pageSize;
        }
        this.newPropsData.totalRowCount = data.data.totalRowCount;

      });
    },
    postTableData(url, message) {
      // 表格数据展示
      return new Promise((resolve) => {
        this.post(url, message, (data) => {
          resolve(data);
        });
      });

    },
    'on-popper-show'(e) {
      // 气泡下拉
      this.newPropsData.data = {};
      if (this.filterMode) {
        this.sendFilterTableMessage(1);
      } else {
        this.sendTableMessage(1);
      }
      // this.postTableData(this.url.tableUrl, this.searchdata);
    },
    'on-keydown'(e) {
      this.$emit('on-keydown', e, this);
      //this.valueChange(e.target.value, {type:'keydown',code:e.keyCode});
    },
    'on-page-change'(e) {
      // 翻页
      if (this.filterMode) {
        this.sendFilterTableMessage(e, this.searchdata.ak);
      } else {
        this.sendTableMessage(e);
      }
    },
    'on-fkrp-selected'(value) {
      // 选中值
      //
      this.valueChange(value, 'selected');
    },
    'on-clear'(e) {
      this.newPropsData.defaultSelected = [];
      this.valueChange('', 'clear');
      console.log(this, 'clear');
      this.$emit('on-clear', e, this);
    },
    'on-input-value-change'(e) {
      // 模糊查询
      this.sendAutoMessage(e);
      // this.newPropsData.value = e;
      this.valueChange(e, 'input');

    }


  }
}
