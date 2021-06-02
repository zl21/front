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
      getEventListenerParam() {
        if (!this._inactive) {
          if (window.opener) { // 向全局发送消息
            window.opener.postMessage({ ready: true }, '*');
          }
          // const printPreview = JSON.parse(window.sessionStorage.getItem('printPreview')); //用于保存并打印
          // if (printPreview.objIds && printPreview.tableName && printPreview.userId) { // 如果是window.open打开的窗口，点击打印，取储存在本地的参数
          //   this.src = `/api/rpt/preview?tableName=${printPreview.tableName}&objIds=${printPreview.objIds}&userId=${printPreview.userId}`;
          // } else { // 外部调用传入的参数
          window.addEventListener('message', (event) => {
            // if (event.origin !== 'http://0.0.0.0:8090') return;
            // console.log('接收到:', event.data.print);
            if (event.data.print) {
              this.tableName = event.data.print.tableName;// 主表表名
              this.userId = event.data.print.userId;// 用户ID
              this.objIds = event.data.print.objIds;// 用于标准列表界面:主表多选明细;用于单对象界面：明细ID
              this.searchDatas = event.data.print.searchDatas;
              if (this.userId && this.tableName && this.objIds) {
                this.src = `/api/rpt/preview?tableName=${this.tableName}&objIds=${this.objIds}&userId=${this.userId}`;
              } else if (event.data.print.searchDatas && Object.keys(event.data.print.searchDatas).length > 0) {
                this.src = `/api/rpt/preview?tableName=${this.tableName}&objIds=${this.objIds}&userId=${this.userId}&searchData=${JSON.stringify(this.searchDatas)}`;
              }
            }
          }, false);
        }
      }
    },
    mounted() {
      this.$store.commit('global/setLayout', false);// 去除菜单栏以及收藏夹
      this.getEventListenerParam();
    },
    beforeshowModule() {
      window.removeEventListener('message', this.getEventListenerParam);
    }
    // }

  };
</script>
