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
  import router from '../../__config__/router.config';
  import getComponentName from '../../__utils__/getModuleName';
  import { MODULE_COMPONENT_NAME } from '../../constants/global';

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
      idArray: {// 获取ID用于多选
        type: Array,
        default: () => []
      },
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
      this.src = `/api/rpt/preview?tableName=${tableName}&objIds=${this.idArray}&userId=${userId}`;
    },
    created() {
      this[MODULE_COMPONENT_NAME] = getComponentName();
    },

  };
</script>
<style scoped>
   #printframe{
     border:0;
   }
</style>
