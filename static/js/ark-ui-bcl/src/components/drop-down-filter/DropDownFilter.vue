<template>
  <div>
    <DropDownSelectFilter v-bind="propsDataCom"
                          ref="DropDownSelectFilter"
                          v-on="eventFunction">
      <div class="DropDownSelectFilter-content">
        <Table ref="selection"
               @on-row-dblclick="dblclick"
               :height="height"
               :border="false"
               :columns="tableColumns"
               :highlight-row="true"
               :data="tabledata"></Table>
      </div>
    </DropDownSelectFilter>
  </div>
</template>
<script>
import Mixin from '../../mixin/DropDownFilterMixin/index';

import Config from '../../../config/nameConfig';

const prefixCls = `${Config.prefixCls}DropDownFilter`;

export default {
  name: prefixCls,
  model: {
    prop: 'value',
    event: 'on-change',
  },
  mixins: [Mixin],
  data () {
    return {
      newPropsData: {
        AutoData: [],
        data: {},
        defaultSelected: []
      }, // 属性值
      height: 100,
      pageSize: 10, // 每页条数
      pageCurrent: 1, // 当前页面
      newTableData: [], // 查询的表格数据
      sendMessage: {},  //  模糊查询头部请求数据
      searchdata: {}, // 表格查询
    };
  },
  props: {
    PropsData: {  // 属性集合
      type: Object,
      default: () => {

      }
    },
    columns: {  // 表格头部
      type: Array,
      default: () => []
    },
    data: { //  表格数据
      type: Array,
      default: () => []
    },
    tableSelectedKey: {  // 表格选中显示的数据
      type: Object,
      default: () => {

      }
    },
    value: {
      type: [Array, String]
    },
    EventFun: {  // 函数集合
      type: Object,
      default: () => {

      }
    },
    Url: {   // 传承集合
      type: Object,
      default: () => {
        return {
          autoUrl:'/p/cs/fuzzyquerybyak',
          tableUrl:'/p/cs/QueryList'
        }

      }
    },
    postAutoMessage: {  // 模糊传参
      type: Object,
      default: () => {

      }
    },
    postTableMessage: {  // 表格模糊传参
      type: Object,
      default: () => {

      }
    },
    autoDataMethods: {  // 模糊数据回调
      type: Function
    },
    tableDataMethods: {  // 表格数据回调
      type: Function
    }
  },
  created () {
  },
  computed: {
    tabledata () {
      // 表格数据
      //  this.newTableData = JSON.parse(JSON.stringify());
      let ref = this.$refs.DropDownSelectFilter && this.$refs.DropDownSelectFilter.$refs.slotTable;
      if(ref){
         ref.spinShow = false;
      }
      if(this.$refs.selection && this.value[0]){
          let index = this.newTableData.findIndex((item)=>{
              if(item[this.tableSelectedKey.ID] === this.value[0].ID){
                return true;
              }
          });
          //this.newTableData[0]._isHighlight = true;
          let self = this;
          setTimeout(()=>{
              self.$refs.selection.highlightCurrentRow(index);
          },50);
      }
     // this.newTableData[0]handleCurrentRow
      console.log('newTableData', this.newTableData)
      return this.newTableData;
    },
    tableColumns () {
      // 表格头部
      return this.columns;
    },

  },
  methods: {
    dblclick (value, index) {
      let _value = [
        {
          ID: value[this.tableSelectedKey.ID],
          Label: value[this.tableSelectedKey.Label]
        }
      ];
      this.$refs.DropDownSelectFilter.popperVisible = false;
      this.newPropsData.defaultSelected = _value;
      this.valueChange(_value, 'dblclick', this);
      // this.$emit('on-valueChange', _value, 'dblclick', this);

    },
    'on-popper-show'(e) {
            // 气泡下拉
            this.newTableData = [];
            this.sendTableMessage(1);
            // this.postTableData(this.url.tableUrl, this.searchdata);
    },
    sendTableMessage (page) {
      this.pageCurrent = page;
      this.searchdata = {
        range: this.pageSize,
        startindex: (this.pageSize || 10) * (page - 1),
      }
      this.searchdata = Object.assign(this.TableRequest || {}, this.searchdata);
      this.postTableData(this.Url.tableUrl, this.$urlSearchParams({
        searchdata: this.searchdata
      })).then((data) => {
        this.newTableData = data.data;
        if (data.data.defaultrange) {
          this.newPropsData.pageSize = data.data.defaultrange;
          this.pageSize = this.newPropsData.pageSize;
        }
        this.newPropsData.totalRowCount = data.totalRowCount;
      });
    }

  }
};
</script>

