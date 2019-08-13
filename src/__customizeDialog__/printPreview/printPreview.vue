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

  export default {
    name: 'PrintPreview',
    data() {
      return {
        src: ''
      };
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
      const { tableName, tableId } = router.currentRoute.params;// 明细ID
      this.src = `/api/rpt/preview?tableName=${tableName}&objIds=${tableId}&userId=${userId}`;
    }

  };
</script>
