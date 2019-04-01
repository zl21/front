<template>
  <div>
    <h1>{{ $route.params.tableName }}</h1>
    <h1>{{ $route.params.tableId }}</h1>
    <h1>{{ $route.params.itemId }}</h1>
    <TabPanels
      type="line"
      :tab-margin-left="20"
      :tab-panels="tabPanels"
    />
    <!-- <TableDetailCollection
      :data-source="dataSource"
      @tableSearch="getRefTableSearchList"
    /> -->
  </div>
</template>

<script>

  import { mapActions, mapState } from 'vuex';

  // import TableDetailCollection from './TableDetailCollection';
  import tabComponent from './SingleObjectTabComponent';
  import router from '../__config__/router.config';


  export default {
    computed: {
      ...mapState('global', {
        favorite: ({ favorite }) => favorite
      }),
      tabPanels() {
        const arr = [];
        
        this.tabPanel.forEach((item, index) => {
          const obj = { ...item };
          obj.componentAttribute.type = 'vertical';
          obj.component = tabComponent;
          obj.cilckCallback = this.tabClick;
          arr.push(obj);
        });
        return arr;
      }
    },
    mounted() {
    },
    created() {
      const { tableName, itemId } = this.$route.params;
      this.getObjectForMainTableForm({ table: tableName, objid: itemId });
      this.getObjectTabForMainTable({ table: tableName, objid: itemId });
    },
    methods: {
      ...mapActions('global', ['updateAccessHistory']),
      tabClick(index) {
        // tab点击
        if (index === this.tabCurrentIndex) {
          return;
        }
        this.updateTabCurrentIndex(index);

        const { itemId } = this.$route.params;
        const refTab = this.tabPanel[index];
        if (refTab.reftabs && refTab.reftabs.length > 0) {
          this.getObjectTabForRefTable(refTab.tablename, itemId);
        }
        if (this.tabPanels[index].componentAttribute.refcolid !== -1) {
          // 获取子表表单
          const formParam = {
            table: refTab.tablename,
            inlinemode: refTab.tabinlinemode
          };
          this.getFormDataForRefTable(formParam);
        }
        if (refTab.tabrelation === '1:m') {
          this.getTableListForRefTable({
            table: refTab.tablename, objid: itemId, refcolid: refTab.refcolid, searchdata: { column_include_uicontroller: true }
          });
        } else if (refTab.tabrelation === '1:1') {
        }
      },

      // 列表查询
      getRefTableSearchList({ startindex, range, fixedcolumns }) {
        const { itemId } = this.$route.params;
        // table, objid, refcolid, startindex, range, fixedcolumns
        const params = {
          startindex,
          range,
          fixedcolumns,
          // table: this.activeRefFormInfo.refInfo.tablename,
          objid: itemId,
          // refcolid: this.activeRefFormInfo.refInfo.refcolid,
        };
        this.getTableListForRefTable(params);
      }
    }
  };
</script>

<style scoped>
</style>
