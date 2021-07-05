<template>
  <div id="DropDownSelectFilter-demo">
    <h5>下拉单选 普通</h5>
    <DropDownFilter :PropsData="propsData"
                    :Url="url"
                    :http="network"
                    v-model="value"
                    :PostAutoMessage="sendAutoMessage"
                    :PostTableMessage="sendTableMessage"
                    :columns="columns"
                    :tableSelectedKey="tableSelectedKey"
                    @on-valueChange="valueChange"
                    :EventFun="eventFun">
    </DropDownFilter>

  </div>
</template>
<script>
import DropDownFilter from '../components/drop-down-filter/DropDownFilter';
import Mixin from '../demo/mixin/common.js';

export default {
  components: {
    DropDownFilter

  },
  mixins: [Mixin],
  data () {
    return {
      sendAutoMessage: {
        colid: 1,
        fixedcolumns: {

        }
      },
      value: [{
        ID: 'age',
        Label: 'name'
      }],
      tableSelectedKey: {
        ID: 'age',
        Label: 'name'
      },
      columns: [
        {
          type: 'index',
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
        single: true,
        placeholder: '下拉单选9999',
        enterType: true,
        "coldesc": "下级品牌",
        "colname": "CHILDREN_BRAND",
        "isuppercase": false,
        "display": "OBJ_FK",
        "scale": 0,
        "webconf": {
          "placeholder": "可输入内容模糊查询aa",
          "required": false
        },
        "colid": 171960,
        "type": "NUMBER",
        "inputname": "CHILDREN_BRAND:ENAME",
        "fkobj": {
          "reftable": "PS_C_BRAND",
          "fkdisplay": "drp",
          "reftableid": 23051,
          "serviceId": "ad-app",
          "url": "",
          "option": null,
          "searchmodel": "drp"
        },
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
  mounted () {
    let self = this;
    setTimeout(() => {
      self.value = [
        {
          ID: '6666',
          Label: '5555'
        }
      ];
    },1000)
  },
  methods: {
    valueChange ($) {
      console.log('v-model', this.propsData.value);
    }
  }
}

</script>
