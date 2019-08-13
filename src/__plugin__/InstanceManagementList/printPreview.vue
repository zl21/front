<template>
  <iframe
    id="printframe"
    name="printframe"
    width="100%"
    height="100%"
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
      this.$store.commit('global/setLayout', false);
      if (window.opener) {
        window.opener.postMessage({ ready: true }, '*');
      }
      window.addEventListener('message', (event) => {
        // if (event.origin !== 'http://0.0.0.0:8090') return;
        console.log('接收到:', event.data.print);
        if (event.data.print) {
          this.tableName = event.data.print.tableName;
          this.userId = event.data.print.userId;
          this.objIds = event.data.print.objIds;
          if (this.userId && this.tableName && this.objIds) {
            this.src = `/api/rpt/preview?tableName=${this.tableName}&objIds=${this.objIds}&userId=${this.userId}`;
          }
        }
      }, false);
    }

  };
</script>
