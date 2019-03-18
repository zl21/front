<template>
  <div class="StandardTableListRootDiv">
    <buttonGroup :data-array=" buttons.dataArray" />
    <FormItemComponent
      ref="FormItemComponent"
      :form-item-lists="formItemsLists"
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
  import ItemComponent from './ItemComponent';
  import { STANDARD_TABLE_COMPONENT_PREFIX } from '../constants/global';
  import buttonmap from '../assets/js/buttonmap';
  import ChineseDictionary from '../assets/js/ChineseDictionary';
  import urlParse from '../__utils__/urlParse';
  import fkQueryList from '../constants/fkHttpRequest';

  export default {
    components: {
      buttonGroup,
      AgTable,
      FormItemComponent
    },
    data() {
      return {
        buttonMap: '', // 按钮字典
        searchData: {
          table: this.$route.params.tableName,
          startIndex: 0,
          range: 10
        },
        formItemsLists: [],
        param: {
          id: '',
          tablename: ''
        },
        // 按钮
        detailState: true, // 是否可以双击查看或点击序号查看
        dynamicRequestUrl: {}, // 用于记录某个按钮点击后，如果将会产生请求，维护请求路径path
        selectIdArr: [], // 保存选中的数据id
        dataConShow: {// 批量修改
          dataConShow: false,
          title: '',
          tabConfig: {},
          fixedcolumns: {},
          reffixedcolumns: {},
        },
        formObj: {
          table: '',
          column_include_uicontroller: true,
          fixedcolumns: {},
          multiple: [],
        }, // 查询条件
        treeObj: {
          table: '',
          column_include_uicontroller: true,
          fixedcolumns: {},
          operator: 2,
        }, // 查询条件
        exportQuery: {
          searchdata: '',
          filename: '',
          filetype: '.xlsx',
          showColumnName: true,
          menu: ''
        }
      };
    },
    computed: {
      formLists() {
        // 对获取的数据进行处理
        let items = [];
        items = JSON.parse(JSON.stringify(this.formItems.defaultFormItemsLists)).reduce((array, current, itemIndex) => {
          const obj = {};
          function checkDisplay(item) {
            let str = '';
            if (!item.display || item.display === 'text') {
              str = 'input';
            }
            if (item.display === 'OBJ_SELECT') {
              str = 'select';
            }
            if (item.display === 'OBJ_FK') {
              switch (item.fkobj.searchmodel) {
              case 'drp':
                str = 'DropDownSelectFilter';
                break;
              case 'mrp':
                str = 'DropDownSelectFilter';
                break;
              case 'pop':
                str = 'AttachFilter';
                break;
              case 'mop':
                str = 'AttachFilter';
                break;
              default: break;
              }
            }

            return str;
          }
          
          obj.row = current.row ? current.row : 1;
          obj.col = current.col ? current.col : 1;
          obj.component = ItemComponent;
          obj.item = {
            type: checkDisplay(current),
            title: current.coldesc,
            field: current.colname,
            value: current.default,
            props: {},
            event: {
              keydown: (event, $this) => {
                console.log(event, $this);
              },
              'popper-show': ($this) => {
                fkQueryList({
                  searchObject: {
                    isdroplistsearch: true, 
                    refcolid: current.colid, 
                    startindex: 0, 
                    range: $this.pageSize
                  },
                  success: (res) => {
                    this.freshDropDownSelectFilterData(res, itemIndex);
                  }
                });
              }
            },
            validate: {}
          };
          // 带有combobox的添加到options属性中

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
          temp.item.event = this.formLists[index].item.event;
          return temp;
        });
        this.formItemsLists = arr;
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
      getTableQuery() { // 获取列表的查询字段
        this.getTableQueryForForm(this.searchData);
      },
      formDataChange(data) { // 表单数据修改
        this.updateFormData(data);
      },
      freshDropDownSelectFilterData(res, index) { // 外键下拉时，更新下拉数据
        this.formItemsLists[index].item.props.data = res.data.data;
        this.formItemsLists = this.formItemsLists.concat([]);
      },

      // 按钮组操作
      getbuttonGroupdata() {
        const tabcmdData = this.buttons.tabcmd;
        if (tabcmdData.cmds) {
          tabcmdData.cmds.forEach((item, index) => {
            if (item === 'actionView') {
              this.detailState = tabcmdData.prem[index];
            } else if (tabcmdData.prem[index]) {
              const type = item.split('action');
              const str = `CMD_${type[1].toUpperCase()}`;
              if (str === 'CMD_PRINT') {
                this.buttons.dataArray.printValue = true;
              } else {
                const buttonConfigInfo = this.buttonMap[str];
                buttonConfigInfo.requestUrlPath = tabcmdData.paths[index];
                this.updateDefaultButtonGroupData(buttonConfigInfo);
              }
            }
          });
        }
      },
      AddDetail(type, obj) {
        const { tableName, tableId } = this.$route.params;
        // 双击条状判断
        if (type === 'fix') {
          const objTableUrl = this.ag.datas.tableurl;
          clearTimeout(window.timer);
          window.timer = setTimeout(() => {
            this.errorData = [];
            if (obj.name === this.buttonMap.CMD_ADD.name) {
              // 新增
              const ptype = this.$route.path.split('/')[2];
              if (objTableUrl) {
                // 跳转的是单对象
                console.log('跳转的是单对象');
                const name = objTableUrl.split('?')[0].split('/')[3];
                const query = urlParse(objTableUrl);
                this.$store.commit('global/TabOpen', {
                  id: -1,
                  type: 'action',
                  name,
                  label: `${obj.webdesc}编辑`,
                  query: Object.assign(
                    {
                      id: -1,
                      tableName,
                      pid: tableId,
                      ptype,
                      ptitle: obj.webdesc,
                      tabTitle: `${obj.webdesc}编辑`
                    },
                    query
                  )
                });
              } else if (this.objdistype === 'tabpanle') {
                console.log('跳转的是tabpanle');

                this.$store.commit('global/TabHref', {
                  id: -1,
                  type: 'singleObject',
                  name: tableName,
                  label: `${obj.webdesc}编辑`,
                  query: {
                    id: -1,
                    tableName,
                    pid: tableId,
                    ptype,
                    ptitle: obj.webdesc,
                    tabTitle: `${obj.webdesc}编辑`
                  }
                });
              } else {
                console.log('其他的', obj);

                this.TabHref({
                  id: -1,
                  type: 'singleView',
                  name: tableName,
                  label: `${obj.name}编辑`,
                  query: {
                    id: -1,
                    tableName,
                    pid: tableId,
                    ptype,
                    ptitle: obj.name,
                    tabTitle: `${obj.name}编辑`
                  }
                });
              }
            }

            if (obj.name === this.buttonMap.CMD_DELETE.name) {
              // 删除动作  对用网络请求
              this.dynamicRequestUrl.delete = obj.requestUrlPath;

              if (this.selectIdArr.length > 0) {
                const data = {
                  message: `确认执行${obj.name}?`
                };
                this.errorData = data;
                this.errorDialog = true;
                this.errorDialogClass = 'warning';
                this.errorDialogTitle = this.ChineseDictionary.WARNING;
                this.errorDialogBack = true;
              } else {
                const data = {
                  message: `请先选择需要${obj.name}的记录！`
                };
                console.log(data);

                this.errorData = data;
                this.errorDialog = true;
                this.errorDialogClass = 'warning';
                this.errorDialogTitle = this.ChineseDictionary.WARNING;
                this.errorDialogBack = false;
              }
            }

            if (obj.name === this.buttonMap.CMD_SUBMIT.name) {
              // 批量提交
              this.dynamicRequestUrl.submit = obj.requestUrlPath;
              if (this.selectIdArr.length > 0) {
                const data = {
                  message: `确认执行${obj.name}?`
                };
                this.errorData = data;
                this.errorDialog = true;
                this.errorDialogClass = 'warning';
                this.errorDialogTitle = this.ChineseDictionary.WARNING;
                this.errorDialogBack = true;
              } else {
                const data = {
                  message: `请先选择需要${obj.name}的记录！`
                };
                console.log(data);

                this.errorData = data;
                this.errorDialog = true;
                this.errorDialogClass = 'warning';
                this.errorDialogTitle = this.ChineseDictionary.WARNING;
                this.errorDialogBack = false;
              }
            }

            if (obj.name === this.buttonMap.CMD_VOID.name) {
              // 批量作废
              if (this.selectIdArr.length > 0) {
                // this.errorTable = {}
                const data = {
                  message: `确认执行${obj.name}?`
                };
                this.errorData = data;
                this.errorDialog = true;
                this.errorDialogClass = 'warning';
                this.errorDialogTitle = this.ChineseDictionary.WARNING;
                this.errorDialogBack = true;
              } else {
                const data = {
                  message: `请先选择需要${obj.name}的记录！`
                };
                console.log(data);

                this.errorData = data;
                this.errorDialog = true;
                this.errorDialogClass = 'warning';
                this.errorDialogTitle = this.ChineseDictionary.WARNING;
                this.errorDialogBack = false;
              }
            }

            if (obj.name === this.buttonMap.CMD_UNSUBMIT.name) {
              // 批量反提交
              if (this.selectIdArr.length > 0) {
                // this.errorTable = {}

                const data = {
                  message: `确认执行${obj.name}?`
                };
                this.errorData = data;
                this.errorDialog = true;
                this.errorDialogClass = 'warning';
                this.errorDialogTitle = this.ChineseDictionary.WARNING;
                this.errorDialogBack = true;
              } else {
                const data = {
                  message: `请先选择需要${obj.name}的记录！`
                };
                console.log(data);

                this.errorData = data;
                this.errorDialog = true;
                this.errorDialogClass = 'warning';
                this.errorDialogTitle = this.ChineseDictionary.WARNING;
                this.errorDialogBack = false;
              }
            }

            if (obj.name === this.buttonMap.CMD_EXPORT.name) {
              // 导出
              if (this.selectIdArr.length == 0) {
                //  searchdata.fixedcolumns = {}
                const data = {
                  message:
                    '当前的操作会执行全量导出，导出时间可能会比较慢！是否继续导出？'
                };
                console.log(data);
                this.batchExport();
                this.errorData = data;
                this.errorDialog = true;
                this.errorDialogClass = 'warning';
                this.errorDialogTitle = this.ChineseDictionary.WARNING;
                this.errorDialogBack = true;

                return;
              }
            }

            if (obj.name === this.buttonMap.CMD_IMPORT.name) {
              // 导入
              this.importData.importDialog = true;
              this.importData.importDialogTitle = this.$store.state.activeTab.label;
            }

            if (obj.name === this.buttonMap.CMD_GROUPMODIFY.name) {
              // 批量修改
              this.dataConShow.fixedcolumns = this.getJson();
              this.dataConShow.reffixedcolumns = this.treeObj.fixedcolumns;
              if (this.selectIdArr.length > 0) {
                this.dataConShow.dataConShow = true;
                this.dataConShow.title = this.$store.state.activeTab.label;
                this.dataConShow.tabConfig = {
                  tabledesc: this.$store.state.activeTab.label,
                  tablename: this.param.tablename,
                  tableid: formObj_tableid,
                  tabrelation: '1:1',
                  objid: this.selectIdArr
                };
              } else {
                const data = {
                  message: `未勾选记录,将批量更新所有查询结果(共计${
                    this.totalRowCount
                  }行),是否确定继续操作?`
                };
                console.log(data);

                this.errorData = data;
                this.errorDialog = true;
                this.errorDialogClass = 'warning';
                this.errorDialogTitle = this.ChineseDictionary.WARNING;
                this.errorDialogBack = true;
              }
            }
          }, 300);
        } else {
          console.log(0);
        }
      },
      batchExport() {
        const { tableName } = this.$route.params;
        // 导出
        const searchdata = {
          table: tableName,
          column_include_uicontroller: true,
          fixedcolumns: { ID: this.selectIdArr },
          range: 10,
          startIndex: 0
        };
        if (this.selectIdArr.length === 0) {
          delete this.formObj.fixedcolumns.ID;
          searchdata.reffixedcolumns = this.treeObj.fixedcolumns;
        }
        this.getExportQueryForButtons(this.searchdata);
      }
    },
    mounted() {
      // 记录模块名
      const { tableName, tableId } = this.$route.params;
      this.moduleStateName = `${STANDARD_TABLE_COMPONENT_PREFIX}.${tableName}.${tableId}`;
      this.getTableQuery();
      this.getQueryList();
      let t;
      clearTimeout(t);
      t = setTimeout(() => {
        // 初始化按钮组数据
        this.getbuttonGroupdata();
      }, 1000);
    },

    activated() {
      const { tableId } = this.$route.params;
      this.updateAccessHistory({ type: 'table', id: tableId });
    },
    created() {
      this.buttonMap = buttonmap;
      this.ChineseDictionary = ChineseDictionary;
    }
  };
</script>

<style scoped lang="less">
.StandardTableListRootDiv {
  width: 100%;
  overflow: auto;
}
</style>
