<template>
  <iframe
    id="printframe"
    name="printframe"
    width="400px"
    height="500px"
    :src="src"
  />
</template> 
<script>

  export default {
    name: 'PrintPreview',
    data() {
      return {
        src: '',
        tableName: '', // 主表表名
        objIds: '', // 明细ID
        userId: ''// 用户ID
      };
    },
    methods: {
        
    },
    mounted() {
      // const userId = this.userInfo.id;// 用户ID
      // const { tableName, tableId, itemId } = router.currentRoute.params;// 明细ID
      // window.addEventListener('message', (event) => {
      //   if (event.origin !== 'http://0.0.0.0:8090') return;
      //   console.log('received response:  ', event.data);
      //   tableId = event.data.tableId;
      //   userId = event.data.userId;
      // }, false);
      // if (userId && itemId) {
      //   this.src = `/api/rpt/preview?tableName=${tableName}&objIds=${itemId}&userId=${userId}`;
      // }
      
      this.$store.commit('global/setLayout', false);
      window.addEventListener('message', (event) => {
        if (event.origin !== 'http://0.0.0.0:8090') return;
        console.log('received response:  ', event.data);
        this.tableName = event.data.tableName;
        this.userId = event.data.userId;
        this.objIds = event.data.objIds;
      }, false);
      setTimeout(() => {
        if (this.userId && this.tableName && this.objIds) {
          this.src = `/api/rpt/preview?tableName=${this.tableName}&objIds=${this.objIds}&userId=${this.userId}`;
        }
      }, 1000);
    }

  };
</script>
