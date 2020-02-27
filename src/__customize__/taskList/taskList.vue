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
    <div class="form-area">
      <FormLayout
        ref="FormItemComponent"
        :default-column="4"
        :defaultconfig="formItemsLists"
        @formDataChange="formDataChange"
      />
    </div>
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
  import network, { urlSearchParams } from '../../__utils__/network';

  export default {
    data() {
      return {
        searchData: {
          table: 'TASK_RECORD',
          startIndex: 0,
          range: 10,
          fixedcolumns: { ISACTIVE: ['=Y'] },
          column_include_uicontroller: true
        }, // 查询条件
        formItemsLists: [
          {
            show: true, // 是否显示隐藏
            row: 1, // 行高
            col: 1, // 列宽
            item: {
              type: 'input',
              label: '姓名/员工编号',
              filed: 'EMPLOYEE',
              props: {
                placeholder: '请输入'
              },
              event: {
                keydown: (event) => {}
              }
            }
          },
          {
            show: true, // 是否显示隐藏
            row: 1, // 行高
            col: 1, // 列宽
            item: {
              type: 'input',
              label: '角色',
              filed: 'instanceId',
              props: {
                placeholder: '请输入'
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
            show: true, // 是否显示隐藏
            row: 1, // 行高
            col: 1, // 列宽
            item: {
              type: 'DatePicker',
              label: '时间范围',
              filed: 'instanceId',
              props: {
                type: 'daterange'
              },
              event: {}
            }
          },
          {
            show: true, // 是否显示隐藏
            row: 1, // 行高
            col: 1, // 列宽
            item: {
              type: 'select',
              label: '任务来源',
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
          }
        ],
        formItems: {
          EMPLOYEE: '',
          instanceId: '',
          BEGIN_TIME: '',
          TABLE_NAME: ''
        },
        columns: [], // 表头
        tableData: [], // 表体数据
        pageAttribute: {}
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
      getTableQuery() {
        network.post('/p/cs/getTableQuery', urlSearchParams({
          table: 'TASK_RECORD',
          getcmd: 'y'
        })).then((res) => {
          if (res.data.code === 0) {
            const data = res.data.data.datas;
            console.log(data, '配置数据');
            // this.formItemsLists=data.dataarray.map(item=>{

            // })
          }
        });
      }, // 获取查询条件的一些数据
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
      formDataChange(data, item, index) {
        // 表单数据修改
        if (JSON.stringify(this.formItems) !== JSON.stringify(data)) {
          if (this.formItemsLists.length > 0) {
            this.formItemsLists[index].item.value = item.item.value;
          }

        // this.updateFormData(data);
        }
      },
      pageChange(val) {}, // 页码变化
      pageSizeChange(val) {
        console.log(val);
      }, // 每页显示条数变化
      rowClassName(row) {
        console.log(row, '行数据');
      },
      tableSelectionChange() {},
      tableRowDbclick() {},
      tableRowClick() {},
      tableSortChange() {}
    },
    created() {
      this.getTableQuery();
    }

  };
</script>  
<style lang="less">
.task-list-container {
  .btn-area {
    padding: 8px 0px;
    button {
      height: 22px;
      font-size: 12px;
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
  .form-area {
    padding: 8px 26px 8px 0px;
    border: 1px solid #d8d8d8;
    .formlayout-Item {
      box-sizing:border-box;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      padding-top: 8px;
      .formlayout-div{
        padding-left:8px;
        height:26px;
        border: 1px solid #d8d8d8;
        overflow: hidden;
        input{
          width:100%;
          height:100%;
          border: none;
        }
        select{
          width:100%;
          height:100%;
          border: none;
        }
      }
    }
  }
}
</style>
