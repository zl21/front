// 任务记录列表
<template>
  <div class="task-list-container">
    <div class="btn-area">
      <Button
        type="posdefault"
        @click="btnclick('search')"
      >
        查找
      </Button>
      <Button
        type="fcdefault"
        @click="btnclick('reset')"
      >
        重置
      </Button>
    </div>
    <FormItemComponent
      ref="FormItemComponent"
      :search-foldnum="7"
      :form-item-lists="formItemsLists"
      :form-items-data="formItems"
      @formDataChange="formDataChange"
    />
    <div class="table-area">
      <Page
        ref="page"
        size="small"
        v-bind="pageAttribute"
        @on-change="pageChange"
        @on-page-size-change="pageSizeChange"
      />
      <div class="table-wrap">
        <Table
          ref="table"
          :columns="columns"
          class="table"
          :height="true"
          :data="tableData"
          :row-class-name="rowClassName"
          :total-data="tableTotalData"
          @on-selection-change="tableSelectionChange"
          @on-row-dblclick="tableRowDbclick"
          @on-row-click="tableRowClick"
          @on-sort-change="tableSortChange"
        />
      </div>
    </div>
  </div>
</template>
<script>
  import FormItemComponent from '../../__component__/FormItemComponent';
  import ItemComponent from '../../__component__/ItemComponent.vue';

  export default {
    components: {
      FormItemComponent
    },
    data() {
      return {
        searchData: {
          table: '',
          startIndex: 0,
          range: 10,
          orderby: undefined
        }, // 查询条件
        formItemsLists: [
          {
            row: 1,
            col: 1,
            component: ItemComponent,
            labelWidth: 90,
            item: {
              type: 'input',
              title: '姓名/员工编号',
              filed: 'EMPLOYEE',
              props: {
                // regx: /^[0-9]*$/
              },
              event: {
                keydown: (event) => {
               
                }
              }
            }
          },
          {
            row: 1,
            col: 1,
            component: ItemComponent,
            labelWidth: 90,
            item: {
              type: 'input',
              title: '角色',
              filed: 'instanceId',
              props: {
              },
              event: {
                keydown: (event) => {
                // if(event.keyCode === 13){
                //   this.queryLists()
                // }
                }
              }
            }
          },
          {
            row: 1,
            col: 1,
            component: ItemComponent,
            labelWidth: 90,
            item: {
              type: 'DatePicker',
              title: '时间范围',
              filed: 'instanceId',
              props: {
                type: 'daterange'
              },
              event: {
              
              }
            }
          },
          {
            row: 1,
            col: 1,
            component: ItemComponent,
            labelWidth: 90,
            item: {
              type: 'select',
              title: '任务来源',
              filed: 'TABLE_NAME',
              props: {
                //   regx:/^[0-9]*$/
              },
              event: {
                keydown: (event) => {
                // if(event.keyCode === 13){
                //   this.queryLists()
                // }
                }
              }
            }
          },
        ],
        formItems: {
          EMPLOYEE: '',
          instanceId: '',
          BEGIN_TIME: '',
          TABLE_NAME: ''

        },
        columns: [], // 表头
        tableData: [], // 表体数据
        pageAttribute: {

        }
      };
    },
    computed: {
      tableTotalData() {
        return [];
      }
    },
    methods: {
      btnclick(type) {
        if (type === 'reset') {
          // 重置列表渲染
          this.resetForm();
        } else {
          this.searchClickData();
        }
      },
      resetForm() {
        // 列表查询重置
        // this.resetType = true;
        // const promise = new Promise((resolve, reject) => {
        //   const searchData = this.searchData;
        // // this.getTableQueryForForm({ searchData, resolve, reject });
        // });
      },
      searchClickData(value) {
      // 按钮查找 查询第一页数据
        //   if (!value) {
        //     // 返回时查询之前页码
        //     this.searchData.startIndex = 0;
        //   }
        //   this.searchData.fixedcolumns = this.dataProcessing();
        //   this.getQueryListForAg(this.searchData);
        //   this.onSelectionChangedAssignment({ rowIdArray: [], rowArray: [] }); // 查询成功后清除表格选中项
      },
      formDataChange(data, item, index) { // 表单数据修改
        if (JSON.stringify(this.formItems) !== JSON.stringify(data)) {
          if (this.formItemsLists.length > 0) {
            this.formItemsLists[index].item.value = item.item.value;
          }

          // this.updateFormData(data);
        }
      },
      pageChange(val) {

      }, // 页码变化
      pageSizeChange(val) {
        console.log(val);
      }, // 每页显示条数变化
      rowClassName(row) {
        console.log(row, '行数据');
      },
      tableSelectionChange() {

      },
      tableRowDbclick() {

      },
      tableRowClick() {

      },
      tableSortChange() {

      }
    
    }
  };
</script>  
<style lang="less">
.task-list-container {
  .btn-area{
     padding: 8px 0px;
      button {
      height: 22px;
      font-size:12px;
      line-height: 18px;
      margin-right: 8px;
      margin-left: 0px;
      padding: 0 8px;
      margin-bottom: 4px;
    }
    > button:last-child {
      margin-right: 0px;
    }
  }
}
</style>
