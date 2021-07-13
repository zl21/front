<template>
  <div id="DropDownSelectFilter-demo">
    <h5>下拉多选 普通</h5>
    {{ value }}
    <DropMultiDownFilter :PropsData="propsData"
                               :Url="url"
                               v-model="value"
                               :http="network"
                               :PostAutoMessage="sendAutoMessage"
                               :PostTableMessage="sendTableMessage"
                               :columns="columns"
                               :tableSelectedKey="tableSelectedKey"
                               @on-valueChange="valueChange"
                               :EventFun="eventFun">
      </DropMultiDownFilter>
                               
  </div>
</template>
<script>
import DropMultiDownFilter from '../components/drop-multi-down-filter/DropMultiDownFilter';
import Mixin from '../demo/mixin/common.js';

export default {
  components: {
    DropMultiDownFilter

  },
  mixins: [Mixin],
  data () {
    return {
      sendAutoMessage: {
        colid: 1,
        fixedcolumns: {

        }
      },
      value: [
        {
          ID:'11',
          Label:'1212'
        }
      ],
      tableSelectedKey:{
        ID:'age',
        Label:'name'
      },
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: 'Name',
          key: 'name'
        },
        {
          title: 'Age',
          key: 'age'
        },
        {
          title: 'Address',
          key: 'address'
        }

      ],
      sendTableMessage: {
        isdroplistsearch: true,
        refcolid: 12,
      },
      propsData: {
        placeholder: '下拉单选9999',
        enterType: true,
      },
      eventFun: {
        //   'on-input-value-change':()=>{
        //       console.log(111);
        //   }
      },
      url: {
        autoUrl: '/p/cs/fuzzyquerybyak',
        tableUrl: '/p/cs/table'
      }

    }
  },
  methods: {
    valueChange ($) {
      console.log('v-model', this.propsData.value);
    }
  }
}

</script>
