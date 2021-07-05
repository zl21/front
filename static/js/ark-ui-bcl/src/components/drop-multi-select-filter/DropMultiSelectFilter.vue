<template>
  <div>
    <DropMultiSelectFilter
            v-bind="propsDataCom"
            v-on="eventFunction">
    </DropMultiSelectFilter>
  </div>
</template>
<script>
  import Mixin from '../../mixin/DropDownFilterMixin/index';
  import Config from '../../../config/nameConfig';

  const prefixCls = `${Config.prefixCls}DropMultiSelectFilter`;


  export default {
    name: prefixCls,
    model: {
      prop: 'value',
      event: 'on-change',
    },
    mixins: [Mixin],
    props: {
      PropsData: {  // 属性集合
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
            autoUrl: '/p/cs/fuzzyquerybyak',
            tableUrl: '/p/cs/QueryList'
          }
        }
      },
      AutoRequest: {  // 模糊传参
        type: Object,
        default: () => {

        }
      },
      TableRequest: {  // 表格模糊传参
        type: Object,
        default: () => {

        }
      },
      autoDataMethods: {  // 模糊数据回调
        type: Function
      },
      tableDataMethods: {  // 表格数据回调
        type: Function
      },

      filterMode: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      'on-input-value-change'(e) {
        // 模糊查询
        if (this.filterMode) {
          this.sendFilterTableMessage(1, e);
        } else {
          this.sendAutoMessage(e);
        }
        // this.newPropsData.value = e;
      },


      // filterMode模式下处理多选过滤数据
      sendFilterTableMessage(page, keyword) {
        this.pageCurrent = page;
        this.searchdata = {
          range: this.pageSize,
          startindex: (this.pageSize || 10) * (page - 1),
          ak: keyword
        };
        this.searchdata = Object.assign(this.TableRequest || {}, this.searchdata);
        this.postTableData(this.localUrl.tableUrl, this.$urlSearchParams({ searchdata: this.searchdata }))
          .then((data) => {
            // console.log('22222222222222', data)
            const da = data.datas;
            this.newPropsData.data = Object.assign({}, da);
            if (da.defaultrange) {
              this.newPropsData.pageSize = da.defaultrange;
              this.pageSize = this.newPropsData.pageSize;
            }
            this.newPropsData.totalRowCount = da.totalRowCount;
          });
      },
    }
  };
</script>

