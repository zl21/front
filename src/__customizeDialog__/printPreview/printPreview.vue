<template>
  <iframe
    id="printframe"
    name="printframe"
    width="1000px"
    height="600px"
    :src="src"
  />
</template> 
<script>
  import { mapState } from 'vuex';
  import axios from 'axios';
  import router from '../../__config__/router.config';
  import getComponentName from '../../__utils__/getModuleName';
  import { MODULE_COMPONENT_NAME } from '../../constants/global';
  import network, { urlSearchParams } from '../../__utils__/network';

  export default {
    name: 'PrintPreview',
    provide: { [MODULE_COMPONENT_NAME]: getComponentName() },
    data() {
      return {
        src: ''
      };
    },
    props: {
      objList: {
        type: Array,
        default: () => []
      },
      idArray: {
        type: [Array, Object],
        default: () => ({})
      },
      itemId: {// 获取当前子表表明细ID
        type: String,
        default: () => ''
      },
      // clickPrint: {// 用于调取打印方法
      //   type: Boolean,
      //   default: () => false
      // },
      
    },
    watch: {
      
    },
    computed: {
      ...mapState('global', {
        userInfo: ({ userInfo }) => userInfo,
      }),
     
    }, 
    methods: {
        
    },
    mounted() {
      const userId = this.userInfo.id;// 用户ID
      const { tableName } = router.currentRoute.params;// 明细ID
      let printIds = [];

      if (getComponentName()[0] === 'S') {
        printIds = this.idArray;
      } else {
        printIds = this.itemId;
      }
    
      network.get('/api/rpt/preview',).then((res) => {
        console.log(res.data);
      });
      // this.src = `/api/rpt/preview?tableName=33&objIds=${printIds}&userId=${userId}`;
    },
    created() {
      this[MODULE_COMPONENT_NAME] = getComponentName();
    },
    destroyed() {
      this.$emit('clearSelectIdArray');
    }

  };
</script>
<style scoped>
   #printframe{
     border:0;
   }
</style>
