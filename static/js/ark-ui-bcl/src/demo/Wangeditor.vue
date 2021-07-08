<template>
  <div id="Wangeditor-demo">
    <Wangeditor v-model="value" :http="network"></Wangeditor>
    {{value}}                      
  </div>
</template>
<script>
import Wangeditor from '../components/wangeditor/Wangeditor';
import Mixin from '../demo/mixin/common.js';

export default {
  data(){
    return {
      tabAction:true,
      isActives:true, 
      value:'<h2>这个是一个测是</h2>'
    }
  },
  components: {
    Wangeditor,
  },
  mixins: [Mixin],

}

</script>
