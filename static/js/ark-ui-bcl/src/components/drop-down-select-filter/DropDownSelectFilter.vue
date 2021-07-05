<template>
  <div>
    <DropDownSelectFilter v-bind="propsDataCom"
                          v-on="eventFunction">
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
         autoUrl:'/p/cs/fuzzyquerybyak',
         tableUrl:'/p/cs/QueryList'
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
    }
  },
  methods: {
    render (html) {
      this.html = html;
    }
  },
  set () {
    class Component {
      constructor(prop) {
        this.props = props;
      }
      init () {
        return this;
      }
    }
  },


};
</script>

