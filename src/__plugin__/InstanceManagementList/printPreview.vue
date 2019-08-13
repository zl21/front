<template>
  <iframe id="printframe"
name="printframe" width="100%" height="100%" :src="src" />
</template> 
<script>
  import router from '../../__config__/router.config';

  export default {
    name: 'PrintPreview',
    data() {
      return {
        src: ''
      };
    },
    methods: {
        
    },
    mounted() {
      const userId = this.userInfo.id;// 用户ID
      const { tableName, tableId, itemId } = router.currentRoute.params;// 明细ID
      window.addEventListener('message', (event) => {
        if (event.origin !== 'http://127.0.0.1:8190/PLUGIN/PRINTTEMPLATE') return;
        console.log('received response:  ', event.data);
        tableId = event.data.tableId;
        userId = event.data.userId;
      }, false);
      if (userId && itemId) {
        this.src = `/api/rpt/preview?tableName=${tableName}&objIds=${itemId}&userId=${userId}`;
      }
    }

  };
</script>
