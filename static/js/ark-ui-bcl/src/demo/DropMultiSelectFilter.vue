<template>
  <div id="DropDownSelectFilter-demo">
    <h5>下拉多选</h5>
    <vDropMultiSelectFilter :PropsData="propsData"
                            :Url="url"
                            v-model="value"
                            :http="network"
                            :AutoRequest="sendAutoMessage"
                            :TableRequest="sendTableMessage"
                            @on-valueChange="valueChange"
                            :EventFun="eventFun"></vDropMultiSelectFilter>

    <Divider>filterMode</Divider>

    {{value1}}
    <vDropMultiSelectFilter :PropsData="propsData"
                            filterMode
                            :Url="url"
                            v-model="value1"
                            :http="network"
                            :AutoRequest="sendAutoMessage"
                            :TableRequest="sendTableMessage"
                            @on-valueChange="valueChange"
                            :EventFun="eventFun"></vDropMultiSelectFilter>

  </div>
</template>
<script>
  import vDropMultiSelectFilter from '../components/drop-multi-select-filter/DropMultiSelectFilter';
  import Mixin from '../demo/mixin/common.js';

  export default {
    components: {
      vDropMultiSelectFilter,
    },
    mixins: [Mixin],
    data() {
      return {
        sendAutoMessage: {
          colid: 1,
          fixedcolumns: {}
        },
        value: [
          {
            ID: '1',
            Label: '121212'
          }
        ],
        sendTableMessage: {
          isdroplistsearch: true,
          refcolid: 12,
        },
        propsData: {
          placeholder: '下拉单选9999',
          enterType: true,
          pageSize: 30,
        },
        eventFun: {
          //   'on-input-value-change':()=>{
          //       console.log(111);
          //   }
        },
        url: {
          autoUrl: '/p/cs/fuzzyquerybyak',
          tableUrl: 'p/cs/QueryList',
          tableSearchUrl: '/346/p/cs/newQueryList'
        },
        // filterMode
        value1: ''

      }
    },
    methods: {
      valueChange($) {
        console.log('v-model', this.value);
      }
    }
  }

</script>
