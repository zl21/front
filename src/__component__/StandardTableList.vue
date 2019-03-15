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
  import buttonmap from '../assets/js/buttonmap';
  import ChineseDictionary from '../assets/js/ChineseDictionary';
  import urlParse from '../__utils__/urlParse';

  export default {
    components: {
      buttonGroup,
      AgTable,
      FormItemComponent
    },
    data() {
      return {
        buttonMap: '', // 按钮字典
        dataArray: {
          printValue: false,
          waListButtonsConfig: {
            waListButtons: []
          },
          buttonGroupShowConfig: {
            buttonGroupShow: []
          },
          btnclick: (type, item) => {
            this.AddDetail(type, item);
          }
        },
        searchData: {
          table: this.$route.params.tableName,
          startIndex: 0,
          range: 10
        },
        lists: [
          {
            row: 1,
            col: 1,
            component: itemComponent,
            item: {
              // item 类型
              type: 'input', // 必填!
              // label名称
              title: '商品名称', // 必填!
              // 字段名称
              field: 'goods_name', // 必填!
              // input值
              value: '1',
              props: {},
              event: {},
              // 校验规则  默认onchage
              validate: {
                // 动态计算key
                dynamicforcompute: {
                  // 逻辑运算key
                  refcolumns: ['is_postage', 'cate_id'],
                  // 被计算字段（目标）
                  computecolumn: 'goods_name',
                  // 中间函数
                  express: 'is_postage + cate_id'
                },
                // 提示信息
                tip: '',
                // 触发方法
                trigger: ''
              }
            }
          },
          {
            row: 1,
            col: 1,
            // 字段名称
            component: itemComponent,
            item: {
              // item 类型
              type: 'checkbox', // 必填!
              // label名称
              title: '是否包邮', // 必填!
              // 字段名称
              field: 'is_postage', // 必填!
              // input值
              value: false,
              props: {},
              validate: {
                hidecolumn: {
                  refcolumn: 'cate_name',
                  refval: '2'
                }
              }
            }
          },
          {
            row: 1,
            col: 1,
            component: itemComponent,
            item: {
              // item 类型
              type: 'select', // 必填!

              // label名称
              title: '产品分类', // 必填!
              // 字段名称
              field: 'cate_id', // 必填!
              // input值
              value: '',
              options: [
                { value: '104', label: '生态蔬菜', disabled: false },
                { value: '105', label: '新鲜水果', disabled: false }
              ],
              props: {
                type: 'datetimerange'
              },
              validate: [
              // 校验规则  默认onchage
              ]
            }
          },
          {
            row: 1,
            col: 1,
            component: itemComponent,
            item: {
              // item 类型
              type: 'DropDownSelectFilter', // 必填!
              // label名称
              title: '产品name', // 必填!
              // 字段名称
              field: 'cate_name', // 必填!
              // input值
              value: '',
              props: {},
              validate: {
              // // 隐藏字段
              // hidecolumn: {
              //   // 逻辑运算key
              //   refcolumn: ['cate_name'],
              //   // 隐藏条件 value值
              //   refval: '2'
              // }
              }
            }
          }
        ],

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
    computed: {},
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
      formDataChange(data) {
        this.updateFormData(data);
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
                this.dataArray.printValue = true;
              } else {
                const buttonConfigInfo = this.buttonMap[str];
                buttonConfigInfo.requestUrlPath = tabcmdData.paths[index];
                this.dataArray.buttonGroupShowConfig.buttonGroupShow.push(
                  buttonConfigInfo
                );
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
        this.dataArray.waListButtonsConfig.waListButtons = this.buttons.waListButtons;
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
