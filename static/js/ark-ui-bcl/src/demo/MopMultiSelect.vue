<template>
  <div id="Wangeditor-demo">
    <MopMultiSelect :PropsData="PropsData" v-model="value"           
    :http="network"
    ></MopMultiSelect>

  </div>
</template>
<script>
import MopMultiSelect from '../components/mop-multi-select/MopMultiSelect';
import Mixin from '../demo/mixin/common.js';


export default {
  components: {
    MopMultiSelect,
  },
  mixins: [Mixin],
  data () {
    return {
      value:[{
        ID:'121',
        label:'12233'
      }],
      PropsData: { 
        placeholder: "aaaaa", 
        enterType: false, 
        webconf: { "placeholder": "aaaaa" }, 
        fkobj: { "reftable": "C_STORE", "fkdisplay": "mop", "reftableid": 23796, "serviceId": "ad-app", "url": "/p/cs/menuimport", "option": null, "searchmodel": "mop", "colid": 165480, "show": true }, 
        blurType: false,
        Selected: [] }
    }
  }

}

</script>
