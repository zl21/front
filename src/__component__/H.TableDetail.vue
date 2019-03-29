<template>
  <div class="horizontalTableDetail">
    <tab-panels
      type="line"
      :tab-margin-left="20"
      :tab-panels="tabPanels"
    />
  </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex';
  import tabComponent from './SingleObjectTabComponent';

  export default {
    data() {
      return {
      };
    },
    computed: {
      ...mapState('global', {
        favorite: ({ favorite }) => favorite,
        activeTab: ({ activeTab }) => activeTab
      }),
      tabPanels() {
        const arr = [];
        this.tabPanel.forEach((item, index) => {
          const obj = { ...item };
          const attributeObj = {
            tableData: this.tableDatas,
            buttonsData: this.buttonsDatas,
            formData: this.formDatas
          };
          if (index === 0) {
            obj.label = this.activeTab.label;
          }
          obj.component = tabComponent;
          obj.cilckCallback = this.tabClick;
          obj.componentAttribute = attributeObj;
          arr.push(obj);
        });
        return arr;
      }
    },
    methods: {
      ...mapActions('global', ['updateAccessHistory']),
      tabClick(index) {
        this.updateIsShow();
        if (index === 0) {
          this.getMainTable();
        } else {
          if (this.tabPanel[index].tabrelation === '1:m') {
            if (this.tabPanel[index].refcolid !== -1) {
              this.getInputForitemForChildTableForm({ table: this.tabPanel[index].tablename });
            }
            const { itemId } = this.$route.params;
            const { tablename, refcolid } = this.tabPanel[index];
            this.getObjectTableItemForTableData({
              table: tablename, objid: itemId, refcolid, searchdata: { column_include_uicontroller: true }
            });
          } else if (this.tabPanel[index].tabrelation === '1:1') {
            const { itemId } = this.$route.params;
            const { tablename, refcolid } = this.tabPanel[index];
            this.getItemObjForChildTableForm({ table: tablename, objid: itemId, refcolid });
          }
        }
      }, // tab切换触发的方法
      getMainTable() {
        const { tableName, itemId } = this.$route.params;
        this.getObjectForMainTableForm({ table: tableName, objid: itemId });
        this.getObjectTabForMainTable({ table: tableName, objid: itemId });
      }
    },
    activated() {

    },
    mounted() {
    },
    created() {
      this.getMainTable();
    }
  };
</script>

<style scoped>
  .horizontalTableDetail {
    padding: 0 20px;
  }

</style>
