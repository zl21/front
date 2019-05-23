<template>
  <!-- v-if="newformList.addcolums" -->
  <div
    ref="modify"
    class="popDialog_pop"
  >
    <Spin
      v-if="loading"
      fix
    >
      <Icon
        type="ios-loading"
        size="18"
        class="demo-spin-icon-load" 
      />
    </Spin>
    <component
      :is="'CompositeForm'"
      v-if="formList.show"
      :default-data="formList"
      :default-column-col="formList.objviewcol"
      class="formPanel"
      @InitializationForm="InitializationForm"
      @formChange="formChange"
    />
    <div class="pageInfo">
      <Page
        :total="pageInfo.totalRowCount"
        :page-size-opts="pageInfo.selectrange"
        class="table-page"
        size="small"
        show-elevator
        show-sizer
        show-total
      />
      <Button
        type="primary"
        style="margin:0 20px;"
      >
        查询
      </Button>
      <Button
        type="fcdefault"
      >
        取消
      </Button>
    </div>

    <div class="table-outside">
      <Table
        ref="selection"
        class="table-in"
        :height="true"
        border
        :columns="SelectionData.thead"
        :data="SelectionData.row"
      />
    </div>
  </div>
</template>
<script>
  import { Version } from '../constants/global';

  // eslint-disable-next-line import/no-dynamic-require
  const {
    getTableQuery, fkQueryListPop
  // eslint-disable-next-line import/no-dynamic-require
  } = require(`../__config__/actions/version_${Version}/formHttpRequest/fkHttpRequest.js`);

  export default {
    name: 'PopDialog',
    components: {
    },
    data() {
      return {
        formList: {
          inpubobj: [],
          show: false,
          objviewcol: 4
        },
        newformList: {},
        formChangeData: {},
        SelectionData: {
          config: [],
          thead: [],
          row: [],
          item: '',
          tableAllDatas: {},
        },
        SingleSelect: {
          show: false,
        },
        selectOperation: {
          page: {
            totalRowCount: 0,
          },
          startindex: 0,
          pageSize: 10,
          pageSizeList: [10, 20, 50, 100, 200],
        },
        loading: false,
        params: {},
        pageInfo: { // 列表的分页
          currentPageIndex: 1, // 当前页码
          pageSize: 10, // 显示条数
          totalRowCount: 100,
          selectrange: [10, 20, 50, 100, 200]
        },
        ids: []
      };
    },
    props: {
      
    },
    created() {
      this.loading = true;
      const router = this.$route.params;
      const params = {
        tableid: router.tableId,
        getcmd: 'n',
        table: router.tableName
      };
      this.params = params;
      this.getData(params);
    },
    mounted() {
      
    },
    watch: {
      formList: {
        handler(val) {
          this.newformList = val;
        },
        deep: true

      }
    },
    methods: {
      getData(searchObject) {
        //  form 请求
        getTableQuery({
          searchObject,
          success: (res) => {
            if (res.data.code === 0) {
              this.loading = false;
              const Data = res.data.data.datas;
              Data.dataarry.forEach((item) => {
                item.name = item.coldesc;
                item.defval = item.default;
                if (item.fkobj) {
                  item.data = {};
                }
              });
              this.formList.inpubobj = Data.dataarry;
              this.formList.show = true;
              this.formList.objviewcol = Data.searchFoldnum;
            }
          }
        });
      },
      getList() {
        //  table list 请求
        const searchObject = {
          refcolid: Number(this.params.tableid),
          isdroplistsearch: true,
          startindex: this.selectOperation.startindex,
          range: this.selectOperation.pageSize
        };
        if (Object.keys(this.formChangeData).length > 0) {
          searchObject.fixedcolumns = { ...this.formChangeData };
        }
        fkQueryListPop({
          searchObject,
          success: (res) => {
            if (res.data.code === 0) {
              console.log(res.data);
            }
          }
        });
      },
      saveData() {
        
      },
      InitializationForm(data) {
        // 默认值
        if (Object.keys(data).length > 0) {
          Object.keys(data).forEach((item) => {
            if (data[item] !== undefined) {
              const dataSelect = this.checkForm(data ,item);
              this.formChangeData = Object.assign(this.formChangeData, { [item]: dataSelect[item] });
            }
          });
        }
        this.getList();
      },
      checkForm(data ,item) {
        // 校验select
        const index = this.formList.inpubobj.findIndex(x => x.colname === item);
        if (index && this.formList.inpubobj[index].display === 'OBJ_SELECT' || index && this.formList.inpubobj[index].display === 'select') {
          data[item] = [`=${data[item]}`.toString()];
        }
        return data;
      },
      formChange(data) {
        // form 修改的数据
        const dataSelect = this.checkForm(data ,Object.keys(data)[0]);
        this.formChangeData = Object.assign(this.formChangeData, dataSelect);
      },
      confirm() {
        // b保存提交
        this.saveData();
      }
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
.popDialog_pop{
  padding:20px
}
.pageInfo{
  padding:10px 0;
  display:flex;
}
</style>
