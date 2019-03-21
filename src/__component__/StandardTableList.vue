<template>
  <div class="StandardTableListRootDiv">
    <ButtonGroup
      :data-array=" buttons.dataArray"
      @buttonClick="buttonClick"
    />
    <FormItemComponent
      ref="FormItemComponent"
      :form-item-lists="formItemsLists"
      :default-column="4"
      :search-foldnum="formItems.searchFoldnum"
      @formDataChange="formDataChange"
    />
    <AgTable
      ref="agTableElement"
      :page-attribute="pageAttribute"
      :datas="ag.datas"
      :on-page-change="onPageChange"
      :on-page-size-change="onPageSizeChange"
      :on-selection-changed="onSelectionChanged"
    />
  </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex';
  import ButtonGroup from './ButtonComponent';
  import AgTable from './StandardTable';
  import FormItemComponent from './FormItemComponent';
  import ItemComponent from './ItemComponent';
  import { STANDARD_TABLE_COMPONENT_PREFIX } from '../constants/global';
  import buttonmap from '../assets/js/buttonmap';
  import ChineseDictionary from '../assets/js/ChineseDictionary';
  import urlParse from '../__utils__/urlParse';
  import { fkQueryList, fkFuzzyquerybyak } from '../constants/fkHttpRequest';
  import { Capital } from '../constants/regExp';

  export default {
    components: {
      ButtonGroup,
      AgTable,
      FormItemComponent
    },
    data() {
      return {
        searchData: {
          table: this.$route.params.tableName,
          startIndex: 0,
          range: 10
        },
        formItemsLists: [],

      };
    },
    computed: {
      ...mapState('global', {
        favorite: ({ favorite }) => favorite
      }),
      formLists() {
        // 对获取的数据进行处理
        let items = [];
        items = JSON.parse(JSON.stringify(this.formItems.defaultFormItemsLists)).reduce((array, current, itemIndex) => {
          const obj = {};
          // 判断采用那种表现方式
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
            if (item.display === 'OBJ_DATENUMBER') {
              str = 'DatePicker';
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
            inputname: current.inputname,
            props: {},
            event: {
              keydown: (event) => { // 输入框的keydown event, $this
                if (event.keyCode === 13) { // enter回车查询
                  this.searchClickData();
                }
              },
              'popper-show': ($this) => { // 当外键下拉站开始去请求数据
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
              },
              'on-show': ($this) => { // 当外键下拉站开始去请求数据
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
              },
              inputValueChange: (value) => {
                fkFuzzyquerybyak({
                  searchObject: {
                    ak: value,
                    colid: current.colid,
                    fixedcolumns: {}
                  },
                  success: (res) => {
                    this.freshDropDownSelectFilterAutoData(res, itemIndex);
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
          // 多状态合并的select
          if (current.conds && current.conds.length > 0) {
            let sumArray = [];
            current.conds.map((item) => {
              sumArray = sumArray.concat(item.combobox.reduce((sum, temp) => {
                sum.push({
                  label: temp.limitdesc,
                  value: `${item.colname}|${temp.limitval}`
                });
                return sum;
              }, []));
              return item;
            });
            obj.item.options = sumArray;
          }

          // 属性isuppercase控制
          if (current.isuppercase) {
            obj.item.props.regx = Capital;
            obj.item.event.regxCheck = (value, $this, errorValue) => {
              this.lowercaseToUppercase(errorValue, itemIndex);
            };
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
          temp.item.props = this.formLists[index].item.props;
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
        this.searchClickData();
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
        if (JSON.stringify(this.formItems.data) !== JSON.stringify(data)) {
          this.updateFormData(data);
        }
      },
      freshDropDownSelectFilterData(res, index) { // 外键下拉时，更新下拉数据
        this.formItemsLists[index].item.props.data = res.data.data;
        this.formItemsLists = this.formItemsLists.concat([]);
      },
      freshDropDownSelectFilterAutoData(res, index) { // 外键的模糊搜索数据更新
        this.formItemsLists[index].item.props.hidecolumns = ['id', 'value'];
        this.formItemsLists[index].item.props.AutoData = res.data.data;
        this.formItemsLists = this.formItemsLists.concat([]);
      },
      lowercaseToUppercase(errorValue, index) { // 将字符串转化为大写
        this.formItemsLists[index].item.value = errorValue.toUpperCase();
        this.formItemsLists = this.formItemsLists.concat([]);
      },

      // 按钮组操作
      getbuttonGroupdata() {
        const tabcmdData = this.buttons.tabcmd;
        if (tabcmdData.cmds) {
          const buttonGroupShow = [];
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
                buttonGroupShow.push(
                  buttonConfigInfo
                );
              }
            }
          });
          this.updateDefaultButtonGroupData(buttonGroupShow);
        }
      },
      onSelectionChanged(rowIdArray, rowArray) {
        this.onSelectionChangedAssignment({ rowIdArray, rowArray });
      },
      buttonClick(type, obj) {
        if (type === 'fix') {
          this.AddDetailClick(obj);
        } else if (type === 'custom') {
          this.webactionClick(type, obj);
        } else if (type === 'Collection') {
          this.clickButtonsCollect();
        } else {
          this.searchClickData();
        }
      },
      webactionClick(type, obj) { // 点击自定义按钮 创建table
        clearTimeout(window.timer);
        window.timer = setTimeout(() => {
          this.setActiveTabActionValue(obj);
          // if (obj.vuedisplay === 'native') { // 有url地址
          //   location.href = obj.action;
          //   return;
          // }
          if (obj.vuedisplay === 'slient') { // 静默程序            if(obj.confirm){  //有提示
            if (obj.confirm) { // 有提示
              if (obj.confirm.indexOf('{') >= 0) {
                if (JSON.parse(obj.confirm).isselect) {
                  if (this.selectIdArr.length === 0) {
                    const data = {
                      message: JSON.parse(obj.confirm).nodesc,
                    };
                    console.log(data);

                    this.errorData = data;
                    this.errorDialog = true;
                    this.errorDialogClass = 'warning';
                    this.errorDialogTitle = this.ChineseDictionary.WARNING;
                    this.errorDialogBack = true;
                  } else if (JSON.parse(obj.confirm).isradio && this.selectIdArr.length !== 1) {
                    const data = {
                      message: JSON.parse(obj.confirm).radiodesc,
                    };
                    console.log(data);

                    this.errorData = data;
                    this.errorDialog = true;
                    this.errorDialogClass = 'warning';
                    this.errorDialogTitle = this.ChineseDictionary.WARNING;
                    this.errorDialogBack = true;
                  } else if (JSON.parse(obj.confirm).desc) {
                    const data = {
                      message: JSON.parse(obj.confirm).desc,
                    };
                    console.log(data);

                    this.errorData = data;
                    this.errorDialog = true;
                    this.errorDialogClass = 'warning';
                    this.errorDialogTitle = this.ChineseDictionary.WARNING;
                    this.errorDialogBack = true;
                  } else {
                    // 参数都不存在,直接执行
                    this.webActionSlient(obj);
                  }
                }
              } else {
                const data = {
                  message: obj.confirm,
                };
                console.log(data);

                this.errorData = data;
                this.errorDialog = true;
                this.errorDialogClass = 'warning';
                this.errorDialogTitle = this.ChineseDictionary.WARNING;
                this.errorDialogBack = true;
              }
            } else {
              this.webActionSlient(obj);
            }
          } else if (obj.vuedisplay === 'navbar') {
            if (!obj.confirm || !JSON.parse(obj.confirm).isselect) {
              this.objTabActionNavbar(obj); // 新标签跳转
            } else { // 动作定义根据列表是否选值
              const confirm = JSON.parse(obj.confirm);
              if (this.selectIdArr.length > 0) {
                if (confirm.isradio && this.selectIdArr.length != 1) {
                  const data = {
                    message: confirm.radiodesc,
                  };
                  console.log(data);

                  this.errorData = data;
                  this.errorDialog = true;
                  this.errorDialogClass = 'warning';
                  this.errorDialogTitle = this.ChineseDictionary.WARNING;
                  this.errorDialogBack = true;
                } else if (confirm.desc) {
                  const data = {
                    message: confirm.desc.replace('{isselect}', this.selectIdArr.length),
                  };
                  console.log(data);

                  this.errorData = data;
                  this.errorDialog = true;
                  this.errorDialogClass = 'warning';
                  this.errorDialogTitle = this.ChineseDictionary.WARNING;
                  this.errorDialogBack = true;
                } else {
                  this.objTabActionNavbar(obj); // 新标签跳转
                }
              } else if (confirm.nodesc) {
                const data = {
                  message: confirm.nodesc,
                };
                console.log(data);

                this.errorData = data;
                this.errorDialog = true;
                this.errorDialogClass = 'warning';
                this.errorDialogTitle = this.ChineseDictionary.WARNING;
                this.errorDialogBack = true;
              } else {
                this.objTabActionNavbar(obj); // 新标签跳转
              }
            }
          } else if (!obj.confirm || !JSON.parse(obj.confirm).isselect) {
            this.actionDialog.queryString = obj.action.split('?')[1];
            this.actionDialog.show = true;
            this.actionDialog.title = obj.webdesc;
            const componentName = obj.action.split('?')[0].replace(/\//g, '_');
            // Vue.component(componentName, Vue.extend(_import_custom(obj.action.split('?')[0])));
            this.dialogComponent = componentName;
          } else if (JSON.parse(obj.confirm).isselect) { // 是否是必选列表项, 动作定义根据列表是否选值
            const confirm = JSON.parse(obj.confirm);
            if (this.selectIdArr.length > 0) {
              if (confirm.isradio && this.selectIdArr.length != 1) {
                const data = {
                  message: confirm.radiodesc,
                };
                console.log(data);
                this.errorData = data;
                this.errorDialog = true;
                this.errorDialogClass = 'warning';
                this.errorDialogTitle = this.ChineseDictionary.WARNING;
                this.errorDialogBack = true;
              } else if (confirm.desc) {
                const data = {
                  message: confirm.desc.replace('{isselect}', this.selectIdArr.length),
                };
                console.log(data);

                this.errorData = data;
                this.errorDialog = true;
                this.errorDialogClass = 'warning';
                this.errorDialogTitle = this.ChineseDictionary.WARNING;
                this.errorDialogBack = true;
              } else {
                this.actionDialog.queryString = obj.action.split('?')[1];
                this.actionDialog.show = true;
                this.actionDialog.title = obj.webdesc;
                const componentName = obj.action.split('?')[0].replace(/\//g, '_');

                // Vue.component(componentName, Vue.extend(_import_custom(obj.action.split('?')[0])));
                this.dialogComponent = componentName;
              }
            } else if (confirm.nodesc) {
              const data = {
                message: confirm.nodesc,
              };
              console.log(data);

              this.errorData = data;
              this.errorDialog = true;
              this.errorDialogClass = 'warning';
              this.errorDialogTitle = this.ChineseDictionary.WARNING;
              this.errorDialogBack = true;
            } else {
              this.actionDialog.queryString = obj.action.split('?')[1];
              this.actionDialog.show = true;
              this.actionDialog.title = obj.webdesc;
              const componentName = obj.action.split('?')[0].replace(/\//g, '_');

              // Vue.component(componentName, Vue.extend(_import_custom(obj.action.split('?')[0])));
              this.dialogComponent = componentName;
            }
          } else {
            const message = obj.confirm.indexOf('{') >= 0 ? JSON.parse(obj.confirm).nodesc : obj.confirm;
            const data = {
              message,
            };
            console.log(data);
            this.errorData = data;
            this.errorDialog = true;
            this.errorDialogClass = 'warning';
            this.errorDialogTitle = this.ChineseDictionary.WARNING;
            this.errorDialogBack = true;
          }
        }, 300);
      },
      webActionSlient(item) {
        const self = this;
        self.actionLoading = true;
        const obj = {
          tableid: this.buttons.tableId,
          ids: this.buttons.selectIdArr,
          menu: this.buttons.tabledesc,
        };
        this.getExeActionDataForButtons({ item, obj });
        let successAction = null;
        let errorAction = null;
        let refParam = null;
        const getActionData = this.buttons.getActionData;

        const exeActionData = this.buttons.exeActionData;
        if (exeActionData) {
          // 如果返回了id和tablename;
          refParam = exeActionData;
        }
        if (this.buttons.activeTabAction.cuscomponent) {
          const nextOperate = JSON.parse(this.buttons.activeTabAction.cuscomponent);
          if (nextOperate.success) successAction = nextOperate.success;
          if (nextOperate.failure) errorAction = nextOperate.failure;
        }
        if (exeActionData.code === 0) {
          if (successAction) {
            this.getActionDataForButtons(successAction);
            if (getActionData.code === 0) {
              const tab = getActionData.data;
              if (refParam) {
                // for (const key of Object.keys(refParam)) {
                //   tab.action = tab.action.replace(`\${${key}}`, refParam[key]);
                // }
              }
              self.webactionClick(tab);
            }
          }
        } else if (getActionData.code === -1 && !getActionData.message && errorAction) {
          this.getActionDataForButtons(errorAction);
          if (getActionData.code === 0) {
            const tab = getActionData.data;
            if (refParam) {
              // for (const key of Object.keys(refParam)) {
              //   tab.action = tab.action.replace(`\${${key}}`, refParam[key]);
              // }
            }
            self.webactionClick(tab);
          }
        } else {
          self.actionLoading = false;
          self.errorTable = {};
          if (getActionData.data) {
            getActionData.data.forEach(() => {
              const objs = {};
              objs.flag = true;
              objs.message = item.message;
              self.$set(self.errorTable, item.objid, objs);
            });
            // self.searchData('fresh');
          }
        }
        // this.buttons.activeTabAction = null;
      },
      searchClickData() { // 按钮查找
        const hasValueSearchData = {};
        const ormItemsData = this.formItems.data;
        for (const value in ormItemsData) {
          if (ormItemsData[value] !== undefined) {
            hasValueSearchData[`${value}`] = `${ormItemsData[value]}`;
          }
        }
        this.searchData.fixedcolumns = hasValueSearchData;
        this.getQueryListForAg(this.searchData);
      },
      AddDetailClick(obj) {
        const { tableName, tableId } = this.$route.params;
        // 双击条状判断
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
            if (this.buttons.selectIdArr.length > 0) {
              const data = {
                message: `确认执行${obj.name}?`
              };
              // console.log(data);
              this.deleteTableList(obj);
              // this.getQueryList();
              // this.errorData = data;
              // this.errorDialog = true;
              // this.errorDialogClass = 'warning';
              // this.errorDialogTitle = this.ChineseDictionary.WARNING;
              // this.errorDialogBack = true;
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
            if (this.buttons.selectIdArr.length > 0) {
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
            if (this.buttons.selectIdArr.length > 0) {
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
            if (this.buttons.selectIdArr.length > 0) {
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
            if (this.buttons.selectIdArr.length == 0) {
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
            this.batchExport();
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
            if (this.buttons.selectIdArr.length > 0) {
              this.dataConShow.dataConShow = true;
              this.dataConShow.title = this.$store.state.activeTab.label;
              this.dataConShow.tabConfig = {
                tabledesc: this.$store.state.activeTab.label,
                tablename: this.param.tablename,
                tableid: this.buttons.tableId,
                tabrelation: '1:1',
                objid: this.buttons.selectIdArr
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
      },
      batchExport() {
        const { tableName } = this.$route.params;
        // 导出
        const searchData = {
          table: tableName,
          column_include_uicontroller: true,
          fixedcolumns: { ID: this.buttons.selectIdArr },
          range: 10,
          startindex: 0,
        };
        const OBJ = {
          searchdata: searchData,
          filename: tableName,
          filetype: '.xlsx',
          showColumnName: true,
          menu: tableName,
        };
        if (this.buttons.selectIdArr.length === 0) {
          delete this.formObj.fixedcolumns.ID;
          searchData.reffixedcolumns = this.treeObj.fixedcolumns;
        }
        this.getExportQueryForButtons(OBJ);
      },
      deleteTableList(obj) {
        const { tableName } = this.$route.params;
        this.buttons.dynamicRequestUrl.delete = obj.requestUrlPath;
        const objQuery = {
          tableName,
          ids: this.buttons.selectIdArr.map(d => parseInt(d))
        };
        this.getBatchDeleteForButtons(objQuery);
      },
      clickButtonsCollect() { // 收藏
        const params = {
          id: this.buttons.tableId,
          type: this.buttons.tableName
        };
        if (this.buttons.dataArray.collectiImg) {
          // 取消收藏
          this.getRemoveFavoriteDataForButtons(params);
        } else {
          // 添加收藏
          this.getToFavoriteDataForButtons(params);
        }
      },

    },
    mounted() {
      // 记录模块名
      const { tableName, tableId } = this.$route.params;
      this.moduleStateName = `${STANDARD_TABLE_COMPONENT_PREFIX}.${tableName}.${tableId}`;
      this.getTableQuery();

      let t;
      clearTimeout(t);
      t = setTimeout(() => { // 初始化按钮组数据
        this.getbuttonGroupdata();
        this.getQueryList();
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
