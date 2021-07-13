<template>
  <div id="DropDownSelectFilter-demo">
    <h5>下拉单选 R3</h5>
    <vbsDropDownSelectFilter :PropsData="propsData"
                             :Url="url"
                             ref="vbsDropDownSelectFilter"
                             v-model="value"
                             :http="network"
                             :AutoRequest="sendAutoMessage"
                             :TableRequest="sendTableMessage"
                             @on-valueChange="valueChange"
                             :EventFun="eventFun"></vbsDropDownSelectFilter>

    <vbsDropDownSelectFilter :PropsData="propsData"
                             :Url="url"
                             ref="vbsDropDownSelectFilter"
                             v-model="value1"
                             :http="network"
                             :AutoRequest="sendAutoMessage"
                             :TableRequest="sendTableMessage"
                             @on-valueChange="valueChange"
                             :EventFun="eventFun"></vbsDropDownSelectFilter>

  </div>
</template>
<script>
  import vbsDropDownSelectFilter from '../components/drop-down-select-filter/DropDownSelectFilter';
  import Mixin from '../demo/mixin/common.js';

  export default {
    components: {
      vbsDropDownSelectFilter,
    },
    mixins: [Mixin],
    data() {
      return {
        value1: '',
        sendAutoMessage: {
          colid: 1,
          fixedcolumns: {}
        },
        value: '',
        sendTableMessage: {
          isdroplistsearch: true,
          refcolid: 12,
        },
        propsData: {
          single: true,
          placeholder: '下拉单选9999',
          enterType: false,
          serviceId: 'add-app',
          pageSize: 30,
        },
        eventFun: {
            'on-input-value-change':()=>{
                console.log(111);
            }
        },
        url: {
          autoUrl: '/p/cs/fuzzyquerybyak',
          tableUrl: 'p/cs/QueryList'
        }

      }
    },

    mounted() {
      setTimeout(() => {
        this.value = '121212';
      }, 1000)
    },
    methods: {
      valueChange($) {
        console.log('v-model', this);
      }
    }
  }

</script>
