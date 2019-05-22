<template>
  <!-- v-if="newformList.addcolums" -->
  <div
    ref="modify"
  >
    <Spin v-if="loading"
fix>
      <Icon
type="ios-loading"
            size="18"
class="demo-spin-icon-load" 
/>
    </Spin>
    <component 
      :is="'CompositeForm'"
      :default-data="newformList"
      :default-column-col="formList.objviewcol"
      class="formPanel"
      @formChange="formChange"
    /> 
  </div>
</template>
<script>
  import { Version } from '../constants/global';

  // eslint-disable-next-line import/no-dynamic-require
  const {
    getTableQuery
  // eslint-disable-next-line import/no-dynamic-require
  } = require(`../__config__/actions/version_${Version}/formHttpRequest/fkHttpRequest.js`);

  export default {
    name: 'PopDialog',
    components: {
    },
    data() {
      return {
        formList: {},
        newformList: {},
        formChangeData: {},
        loading: false,
        router: {},
        ids: []
      };
    },
    props: {
      
    },
    created() {
      // const searchObject = {
      //   table: this.router.tableName
      // };
      // this.getData(searchObject);
    },
    watch: {
      formList: {
        handler() {
          
        },
        deep: true

      }
    },
    methods: {
      getData(searchObject) {
        console.log(searchObject);
        getTableQuery({
          searchObject,
          success: (res) => {
            if (res.data.code === 0) {
              this.loading = false;
              this.formList = res.data.data;
            }
          }
        });
      },
      saveData() {
        
      },
      formChange(data) {
        // form 修改的数据

        this.formChangeData = Object.assign(this.formChangeData, data);
      },
      confirm() {
        // b保存提交
        this.saveData();
      }
    },
    mounted() {
      const router = this.$route.params;
      const params = {
        tableid: router.tableId,
        getcmd: 'n',
        table: router.tableName
      };
      this.getData(params);
    }
  };
</script>
<style lang="less" scope>
.modify-tip {
    display: inline-block;
    margin-left: 20px;
    font-size: 12px;
    margin: 0px 0 10px;
    height: 24px;
    line-height:24px;
}
</style>
