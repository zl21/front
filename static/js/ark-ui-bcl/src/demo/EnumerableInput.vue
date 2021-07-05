<template>
  <div id="Wangeditor-demo">
    <EnumerableInput v-model="value" :http="network" :tableName="tableName"></EnumerableInput>
  </div>
</template>
<script>
import EnumerableInput from '../components/enumerable-input/EnumerableInput';
import Mixin from './mixin/common.js';

export default {
  data(){
    return {
      tabAction:true,
      isActives:true, 
      tableName:'AD_COLUMN',
      value:'0011000'
    }
  },
  components: {
    EnumerableInput,
  },
  mixins: [Mixin],

}

</script>
