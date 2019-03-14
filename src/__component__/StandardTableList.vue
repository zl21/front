<template>
  <div class="StandardTableListRootDiv">
    <buttonGroup :data-array="dataArray" />
    <FormItemComponent
      ref="FormItemComponent"
      :form-item-lists="lists"
      :default-column="4"
      @formDataChange="formDataChange"
    />
    <AgTable
      ref="agTableElement"
      :page-attribute="pageAttribute"
      :datas="ag.datas"
      :on-page-change="onPageChange"
      :on-page-size-change="onPageSizeChange"
    />
  </div>
</template>

<script>
  import { mapActions } from 'vuex';
  import buttonGroup from './buttonComponent';
  import AgTable from './StandardTable';
  import FormItemComponent from './FormItemComponent';
  import itemComponent from './itemComponent';
  import { STANDARD_TABLE_COMPONENT_PREFIX } from '../constants/global';


  export default {
    components: {
      buttonGroup,
      AgTable,
      FormItemComponent,
    },
    data() {
      return {
        dataArray: {
          printValue: true,
          waListButtons: [
            {
              action: '/p/c/loadschema',
              actiontype: 'url',
              confirm: null,
              cuscomponent: null,
              ishide: false,
              isrefrsh: false,
              vuedisplay: 'slient',
              webdesc: '重载',
              webicon: null,
              webid: 2221,
              webname: 'loadschema',
            }
          ],
          buttonGroupShow: [

            {
              action: '',
              defbutton: 'S',
              icon: '',
              name: '新增',
              requestUrlPath: '',
            },
            {
              action: '',
              defbutton: 'S',
              icon: '',
              name: '删除',
              requestUrlPath: '',
            },
            {
              action: '',
              defbutton: 'S',
              icon: '',
              name: '批量修改',
              requestUrlPath: '',
            },
            {
              action: '',
              defbutton: 'S',
              icon: '',
              name: '导入',
              requestUrlPath: '',
            },
            {
              action: '',
              defbutton: 'S',
              icon: '',
              name: '导出',
              requestUrlPath: '',
            },
          ],
        },
        searchData: {
          table: this.$route.params.tableName,
          startIndex: 0,
          range: 10
        },
        lists: [],
        param: {
          id: '',
          tablename: '',
        },
      };
    },
    computed: {
      formLists() {
        // 对获取的数据进行处理
        let items = [];
        items = JSON.parse(JSON.stringify(this.formItems.defaultFormItemsLIsts)).reduce((array, current) => {
          function checkDisplay(item) {
            let str = '';
            if (!item.display || item.display === 'text') {
              str = 'input';
            }
            if (item.display === 'OBJ_SELECT') {
              str = 'select';
            }

            if (item.display === 'OBJ_FK') {
              if (item.fkobj.fkdisplay === 'drp') {
                str = 'DropDownSelectFilter';
              } else {
                str = 'AttachFilter';
              }
            }

            return str;
          }
          const obj = {};
          obj.row = current.row ? current.row : 1;
          obj.col = current.col ? current.col : 1;
          obj.component = itemComponent;
          obj.item = {
            type: checkDisplay(current),
            title: current.coldesc,
            field: current.colname,
            value: current.default,
            props: {},
            event: {},
            validate: {}
          };
          if (current.combobox) {
            const arr = current.combobox.reduce((sum, item) => {
              sum.push({
                label: item.limitdesc,
                value: item.limitval
              });
              return sum;
            }, []);

            obj.item.options = arr;
          }
          array.push(obj);
          return array;
        }, []);
        return items;
      }
    },
    watch: {
      formLists() {
        const arr = JSON.parse(JSON.stringify(this.formLists));
        arr.map((temp, index) => {
          temp.component = this.formLists[index].component;
          return temp;
        });
        this.lists = arr;
        console.log(this.lists);
      }
    },
    methods: {
      ...mapActions('global', ['updateAccessHistory']),
      getQueryList() {
        const { agTableElement } = this.$refs;
        agTableElement.showAgLoading();
        this.getQueryListForAg(this.searchData);
      },
      onPageChange(page) {
        const { range } = this.searchData;
        this.searchData.startIndex = range * (page - 1);
        this.getQueryList();
      },
      onPageSizeChange(pageSize) {
        this.searchData.startIndex = 0;
        this.searchData.range = pageSize;
        this.getQueryList();
      },
      

      // 表单操作
      getTableQuery() {
        this.getTableQueryForForm(this.searchData);
      },
      formDataChange(data, item) {
        this.updateFormData(data);
      },
      
    },
    mounted() {
      // 记录模块名
      const { tableName, tableId } = this.$route.params;
      this.moduleStateName = `${STANDARD_TABLE_COMPONENT_PREFIX}.${tableName}.${tableId}`;
      this.getTableQuery();
      this.getQueryList();
    },
    
    activated() {
      const { tableId } = this.$route.params;
      this.updateAccessHistory({ type: 'table', id: tableId });
    },


  };
</script>

<style scoped lang="less">
  .StandardTableListRootDiv {
    width: 100%;
    overflow: auto;
  }
</style>
