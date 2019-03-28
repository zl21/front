<template>
  <div class="StandardTableListRootDiv">
    <ButtonGroup
      :data-array="buttons.dataArray"
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
    <ImportDialog
      v-if="buttons.importData.importDialog"
      :visible.sync="buttons.importData.importDialog"
      :name="buttons.importData.importDialog"
      :show-close="true"
      :title="buttons.importData.importDialogTitle"
      :tablename="buttons.tableName"
      :main-table="buttons.tabledesc"
      :main-id="buttons.importData.mainId"
      @confirmImport="searchData('fresh')"
    />
    
    <ErrorModal
      v-if="buttons.errorDialog"
      :error-message="buttons.errorData"
      :dialog-class="buttons.errorDialogClass"
      :error-dialog="buttons.errorDialog"
      :title="buttons.errorDialogTitle"
      @closeDialog="errorDialogClose"
      @confirmDialog="errorconfirmDialog"
    />
  </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex';
  import ButtonGroup from './ButtonComponent';
  import AgTable from './AgTable';
  import FormItemComponent from './FormItemComponent';
  import ItemComponent from './ItemComponent';
  import buttonmap from '../assets/js/buttonmap';
  import ChineseDictionary from '../assets/js/ChineseDictionary';
  import urlParse from '../__utils__/urlParse';
  import ImportDialog from './ImportDialog';
  import ErrorModal from './ErrorModal';
  import { fkQueryList, fkFuzzyquerybyak } from '../constants/fkHttpRequest';
  import { Capital } from '../constants/regExp';

  export default {
    components: {
      ButtonGroup,
      AgTable,
      FormItemComponent,
      ImportDialog,
      ErrorModal
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
        return this.refactoringData(this.formItems.defaultFormItemsLists.concat([]));
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
        if (JSON.stringify(arr) !== JSON.stringify(this.formItemsLists)) {
          this.formItemsLists = arr;
        }
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
      refactoringData(defaultFormItemsLists) { // 对获取的数据进行处理
        let items = [];
        if (this.formItemsLists.length > 0) {
          return this.formItemsLists;
        }
        items = JSON.parse(JSON.stringify(defaultFormItemsLists)).reduce((array, current, itemIndex) => {
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
            if (item.display === 'OBJ_DATENUMBER' || item.display === 'OBJ_DATE') {
              str = 'DatePicker';
            }

            if (item.display === 'OBJ_TIME') {
              str = 'TimePicker';
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
            value: this.defaultValue(current),
            inputname: current.inputname,
            props: {},
            event: {
              keydown: (event) => { // 输入框的keydown event, $this
                if (event.keyCode === 13) { // enter回车查询
                  this.searchClickData();
                }
              },
              'popper-show': ($this) => { // 当外键下拉展开时去请求数据
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
              inputValueChange: (value) => { // 外键的模糊搜索
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
              },
              pageChange: (currentPage, $this) => { // 外键的分页查询
                fkQueryList({
                  searchObject: {
                    isdroplistsearch: true,
                    refcolid: current.colid,
                    startindex: 10 * ($this.currentPage - 1),
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

          // 日期控件属性控制
          if (current.display === 'OBJ_DATENUMBER') {
            obj.item.props.type = 'daterange';
          }
          if (current.display === 'OBJ_DATE') {
            obj.item.props.type = 'datetimerange';
          }
          if (current.display === 'OBJ_TIME') {
            obj.item.props.type = 'timerange';
          }

          // 属性isuppercase控制
          if (current.isuppercase) {
            obj.item.props.regx = Capital;
            obj.item.event.regxCheck = (value, $this, errorValue) => {
              this.lowercaseToUppercase(errorValue, itemIndex);
            };
          }

          // 外键的单选多选判断
          if (current.display === 'OBJ_FK') {
            switch (current.fkobj.searchmodel) {
            case 'drp':
              obj.item.props.single = true;
              obj.item.props.defaultSelected = this.defaultValue(current);
              break;
            case 'mrp':
              obj.item.props.single = false;
              obj.item.props.defaultSelected = this.defaultValue(current);
              break;
            case 'pop':
              break;
            case 'mop':
              break;
            default: break;
            }
          }

          array.push(obj);
          return array;
        }, []);

        if (Object.keys(this.formItems.data).length === 0) {
          this.formDataChange(items.reduce((obj, current) => {
            obj[current.item.field] = current.item.value;
            return obj;
          }, {}));
        }

        return items;
      },
      defaultValue(item) { // 设置表单的默认值
        if (item.display === 'OBJ_DATENUMBER') { // 日期控件
          const timeRange = [new Date().toIsoDateString(), new Date().minusDays(Number(item.daterange)).toIsoDateString()];
          return timeRange;
        }
        if (item.display === 'OBJ_DATE') {
          const timeRange = [`${new Date().minusDays(Number(item.daterange)).toIsoDateString()} 00:00:00`, `${new Date().toIsoDateString()} 23:59:59`];
          return timeRange;
        }

        if (item.display === 'OBJ_SELECT' && item.default) { // 处理select的默认值
          const arr = [];
          arr.push(item.default);
          return arr;
        }
        
        if (item.display === 'OBJ_FK' && item.default) { // 外键默认值
          const arr = [];
          arr.push({
            ID: item.refobjid,
            Label: item.default
          });
          return arr;
        }

        return item.default;
      },
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
        this.formItemsLists[index].item.props.totalRowCount = res.data.data.totalRowCount;
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
      getbuttonGroupdata() { // 获取按钮数据
        const tabcmdData = this.buttons.tabcmd;
        if (tabcmdData.cmds) {
          const buttonGroupShow = [];
          tabcmdData.cmds.forEach((item, index) => {
            if (item === 'actionView') {
              this.buttons.detailState = tabcmdData.prem[index];
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
      onSelectionChanged(rowIdArray, rowArray) { // 获取表格选中明细
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
          if (obj.vuedisplay === 'native') { // 接口返回有url地址
            location.href = obj.action;
            return;
          }
          if (obj.vuedisplay === 'slient') { // 静默程序            if(obj.confirm){  //有提示
            if (obj.confirm) { // 有提示
              if (obj.confirm.indexOf('{') >= 0) {
                if (JSON.parse(obj.confirm).isselect) {
                  if (this.selectIdArr.length === 0) {
                    const data = {
                      message: JSON.parse(obj.confirm).nodesc,
                    };
                    console.log(data);

                    this.buttons.errorData = data;
                    this.buttons.errorDialog = true;
                    this.buttons.errorDialogClass = 'warning';
                    this.buttons.errorDialogTitle = this.ChineseDictionary.WARNING;
                    this.buttons.errorDialogBack = true;
                  } else if (JSON.parse(obj.confirm).isradio && this.selectIdArr.length !== 1) {
                    const data = {
                      message: JSON.parse(obj.confirm).radiodesc,
                    };
                    console.log(data);

                    this.buttons.errorData = data;
                    this.buttons.errorDialog = true;
                    this.buttons.errorDialogClass = 'warning';
                    this.buttons.errorDialogTitle = this.ChineseDictionary.WARNING;
                    this.buttons.errorDialogBack = true;
                  } else if (JSON.parse(obj.confirm).desc) {
                    const data = {
                      message: JSON.parse(obj.confirm).desc,
                    };
                    console.log(data);

                    this.buttons.errorData = data;
                    this.buttons.errorDialog = true;
                    this.buttons.errorDialogClass = 'warning';
                    this.buttons.errorDialogTitle = this.ChineseDictionary.WARNING;
                    this.buttons.errorDialogBack = true;
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

                this.buttons.errorData = data;
                this.buttons.errorDialog = true;
                this.buttons.errorDialogClass = 'warning';
                this.buttons.errorDialogTitle = this.ChineseDictionary.WARNING;
                this.buttons.errorDialogBack = true;
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

                  this.buttons.errorData = data;
                  this.buttons.errorDialog = true;
                  this.buttons.errorDialogClass = 'warning';
                  this.buttons.errorDialogTitle = this.ChineseDictionary.WARNING;
                  this.buttons.errorDialogBack = true;
                } else if (confirm.desc) {
                  const data = {
                    message: confirm.desc.replace('{isselect}', this.selectIdArr.length),
                  };
                  console.log(data);

                  this.buttons.errorData = data;
                  this.buttons.errorDialog = true;
                  this.buttons.errorDialogClass = 'warning';
                  this.buttons.errorDialogTitle = this.ChineseDictionary.WARNING;
                  this.buttons.errorDialogBack = true;
                } else {
                  this.objTabActionNavbar(obj); // 新标签跳转
                }
              } else if (confirm.nodesc) {
                const data = {
                  message: confirm.nodesc,
                };
                console.log(data);

                this.buttons.errorData = data;
                this.buttons.errorDialog = true;
                this.buttons.errorDialogClass = 'warning';
                this.buttons.errorDialogTitle = this.ChineseDictionary.WARNING;
                this.buttons.errorDialogBack = true;
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
                this.buttons.errorData = data;
                this.buttons.errorDialog = true;
                this.buttons.errorDialogClass = 'warning';
                this.buttons.errorDialogTitle = this.ChineseDictionary.WARNING;
                this.buttons.errorDialogBack = true;
              } else if (confirm.desc) {
                const data = {
                  message: confirm.desc.replace('{isselect}', this.selectIdArr.length),
                };
                console.log(data);

                this.buttons.errorData = data;
                this.buttons.errorDialog = true;
                this.buttons.errorDialogClass = 'warning';
                this.buttons.errorDialogTitle = this.ChineseDictionary.WARNING;
                this.buttons.errorDialogBack = true;
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

              this.buttons.errorData = data;
              this.buttons.errorDialog = true;
              this.buttons.errorDialogClass = 'warning';
              this.buttons.errorDialogTitle = this.ChineseDictionary.WARNING;
              this.buttons.errorDialogBack = true;
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
            this.buttons.errorData = data;
            this.buttons.errorDialog = true;
            this.buttons.errorDialogClass = 'warning';
            this.buttons.errorDialogTitle = this.ChineseDictionary.WARNING;
            this.buttons.errorDialogBack = true;
          }
        }, 300);
      },
      webActionSlient(item) {
        // this.actionLoading = true;
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
          if (successAction) { // 如果有静默后需要执行的操作
            this.getActionDataForButtons(successAction);
            if (getActionData.code === 0) {
              const tab = getActionData.data;
              if (refParam) {
                for (const key of Object.keys(refParam)) {
                  tab.action = tab.action.replace(`\${${key}}`, refParam[key]);
                }
              }
              this.webactionClick(tab);
            }
          }
        } else if (getActionData.code === -1 && !getActionData.message && errorAction) {
          this.getActionDataForButtons(errorAction);
          if (getActionData.code === 0) {
            const tab = getActionData.data;
            if (refParam) {
              for (const key of Object.keys(refParam)) {
                tab.action = tab.action.replace(`\${${key}}`, refParam[key]);
              }
            }
            this.webactionClick(tab);
          }
        } else {
          this.actionLoading = false;
          this.errorTable = {};
          if (getActionData.data) {
            getActionData.data.forEach(() => {
              const objs = {};
              objs.flag = true;
              objs.message = item.message;
              this.$set(this.errorTable, item.objid, objs);
            });
            // this.searchData('fresh');
          }
        }
        // this.buttons.activeTabAction = null;
      },
      dataProcessing() { // 查询数据处理
        const jsonData = Object.keys(this.formItems.data).reduce((obj, item) => {
          if (this.formItems.data[item]) {
            obj[item] = this.formItems.data[item];
          }
          return obj;
        }, {});

        return Object.keys(jsonData).reduce((obj, item) => {
          let value = '';
          this.formItemsLists.every((temp) => {
            if (temp.item.field === item) { // 等于当前节点，判断节点类型
              if (temp.item.type === 'DatePicker' && (temp.item.props.type === 'datetimerange' || temp.item.props.type === 'daterange') && (jsonData[item][0] && jsonData[item][1])) { // 当为日期控件时，数据处理
                value = jsonData[item].join('~');
                return false;
              }

              if (temp.item.type === 'TimePicker' && temp.item.props.type === 'timerange' && (jsonData[item][0] && jsonData[item][1])) { // 时分秒的时间段处理
                value = jsonData[item].join('~');
                return false;
              }
              if (temp.item.type === 'select') { // 处理select，分为单个字段select和合并型select
                value = jsonData[item].map(option => `=${option}`);
                return false;
              }

              value = jsonData[item];
              return false;
            }

            if (!temp.item.field && temp.item.type === 'select' && item.indexOf(':ENAME') < 0) { // 处理合并型select
              value = jsonData[item].map(option => `=${option}`);
              return false;
            }

            if (!temp.item.field && temp.item.type === 'select' && item.indexOf(':ENAME') < 0) { // 处理合并型select
              value = jsonData[item].map(option => `=${option}`);
              return false;
            } // 外键查询输入情况
            value = jsonData[item];
            return true;
          });
          if (value) {
            obj[item] = value;
          }
          
          return obj;
        }, {});
      },
      searchClickData() { // 按钮查找
        this.searchData.fixedcolumns = this.dataProcessing();
        this.getQueryListForAg(this.searchData);
      },
      AddDetailClick(obj) {
        const { tableName, tableId } = this.$route.params;
        // 双击条状判断
        const objTableUrl = this.ag.datas.tableurl;
        const objdistype = this.ag.datas.objdistype;
        clearTimeout(window.timer);
        window.timer = setTimeout(() => {
          // this.buttons.errorData = [];
          if (obj.name === this.buttonMap.CMD_ADD.name) {
            // 新增
            const ptype = this.$route.path.split('/')[2];
            if (objTableUrl) {
              // 跳转的是单对象
              const name = objTableUrl.split('?')[0].split('/')[3];
              // const query = urlParse(objTableUrl);
              this.$store.commit('global/TabOpen', {
                id: -1,
                type: 'action',
                name,
                label: `${obj.name}编辑`,
                query: Object.assign(
                  {
                    id: -1,
                    tableName,
                    pid: tableId,
                    ptype,
                    ptitle: obj.name,
                    tabTitle: `${obj.name}编辑`
                  },
                 
                )
              });
            } else if (objdistype === 'tabpanle') {
              this.$store.commit('global/TabHref', {
                id: -1,
                type: 'singleObject',
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
            } else {
              this.$store.commit('global/TabHref', {
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
                content: `确认执行${obj.name}?`,
              };
              const errorDialogTitle = this.ChineseDictionary.WARNING;
              const errorDialogvalue = true;
              this.setErrorModalValue({ data, errorDialogTitle, errorDialogvalue });
            }
          }

          if (obj.name === this.buttonMap.CMD_SUBMIT.name) {
            // 批量提交
            this.buttons.dynamicRequestUrl.submit = obj.requestUrlPath;
            this.batchSubmit();
            // if (this.buttons.selectIdArr.length > 0) {
            //   const data = {
            //     title: '警告',
            //     content: `确认执行${obj.name}?`
            //   };
            //   this.$Modal.fcWarning(data);
            // } else {
            //   const data = {
            //     title: '警告',
            //     content: `请先选择需要${obj.name}的记录！`
            //   };
            //   this.$Modal.fcWarning(data);
            // }
          }

          if (obj.name === this.buttonMap.CMD_VOID.name) {
            // 批量作废
            if (this.buttons.selectIdArr.length > 0) {
              const data = {
                title: '警告',
                content: `确认执行${obj.name}?`
              };
              const errorDialogTitle = this.ChineseDictionary.WARNING;
              const errorDialogvalue = true;
              this.setErrorModalValue({ data, errorDialogTitle, errorDialogvalue });
            } else {
              const data = {
                title: '警告',
                content: `请先选择需要${obj.name}的记录！`
              };
              this.$Modal.fcWarning(data);
            }
          }

          if (obj.name === this.buttonMap.CMD_UNSUBMIT.name) {
            // 批量反提交
            if (this.buttons.selectIdArr.length > 0) {
              // this.errorTable = {}
              const data = {
                title: '警告',
                content: `确认执行${obj.name}?`
              };
              this.$Modal.fcWarning(data);
            } else {
              const data = {
                title: '警告',
                content: `请先选择需要${obj.name}的记录！`
              };
              this.$Modal.fcWarning(data);
            }
          }

          if (obj.name === this.buttonMap.CMD_EXPORT.name) {
            // 导出
            if (this.buttons.selectIdArr.length === 0) {
              //  searchdata.fixedcolumns = {}
              const data = {
                title: '警告',
                content: '当前的操作会执行全量导出，导出时间可能会比较慢！是否继续导出？'
              };
              this.$Modal.fcWarning(data);
              this.batchExport();
              return;
            }
            this.batchExport();
          }

          if (obj.name === this.buttonMap.CMD_IMPORT.name) {
            // 导入
            this.setImportDialogTitle();
            this.importGetUploadParametersForButtons();// 调用导入参数接口
          }
          if (obj.name === this.buttonMap.CMD_GROUPMODIFY.name) {
            // 批量修改
            this.dataConShow.fixedcolumns = this.getJson();
            this.dataConShow.reffixedcolumns = this.treeObj.fixedcolumns;
            if (this.buttons.selectIdArr.length > 0) {
              this.dataConShow.dataConShow = true;
              this.dataConShow.title = this.buttons.tabledesc;
              this.dataConShow.tabConfig = {
                tabledesc: this.buttons.tabledesc,
                tablename: this.buttons.tableName,
                tableid: this.buttons.tableId,
                tabrelation: '1:1',
                objid: this.buttons.selectIdArr
              };
            } else {
              const data = {
                title: '警告',
                content: `未勾选记录,将批量更新所有查询结果(共计${
                  this.totalRowCount
                }行),是否确定继续操作?`
              };
              this.$Modal.fcWarning(data);
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
      deleteTableList() {
        const objQuery = {
          tableName: this.buttons.tableName,
          ids: this.buttons.selectIdArr.map(d => parseInt(d))
        };
        this.getBatchDeleteForButtons(objQuery);
        this.getQueryListForAg(this.searchData);
      },
      batchVoid() {
        const searchdata = {
          table: this.buttons.tableName,
          ids: this.buttons.selectIdArr.map(d => parseInt(d))
        };
          
        this.batchVoidForButtons(searchdata);
      },
      batchSubmit() {
        // constthis = this;
        const url = this.buttons.dynamicRequestUrl.submit;
        const tableName = this.buttons.tableName;
        const ids = this.buttons.selectIdArr.map(d => parseInt(d));
       
        this.batchSubmitForButtons({ url, tableName, ids });
        if (this.buttons.batchSubmitData.code === 0) {
           
        }
        // request({
        //   method: 'post',
        //   url: this.buttons.dynamicRequestUrl.submit || '/p/cs/batchSubmit',
        //   data: obj,
        //   contentType: 'application/json'
        // }).then((res) => {
        //   this.actionLoading = false;

        //   res = res.data;

        //   if (res.code == 0) {
        //     this.errorTable = {};
        //     this.selectSysment.forEach((item, index) => {
        //       const obj = {};
        //       obj.flag = true;
        //       obj.message = `数据为系统保留字段，不允许${_self.buttonMap.CMD_SUBMIT.name}`;
        //       this.$set(_self.errorTable, item, obj);
        //     });

        //     const data = {
        //       message: res.message,
        //     };
        //     this.errorData = data;
        //     this.errorDialog = true;
        //     this.errorDialogClass = 'success';
        //     this.errorDialogTitle = this.ChineseDictionary.PROMPT;
        //     this.errorDialogBack = false;

        //     if ($('.main-content').find('.myTree').length > 0) {
        //       const destroyTab = vm.$children[0].$children[0].$children[3].$children[0].$children;
        //       const thisComponent = `${'action' + '_'}${_self.param.tablename}_${_self.$route.query.id}`;
        //       vm.$nextTick(() => {
        //         for (let i = 0; i < destroyTab.length; i++) {
        //           const element = destroyTab[i];
        //           if (element.$vnode.data.ref == thisComponent) {
        //             if (thisComponent.indexOf('action') > -1) {
        //               element.getTableWay(true);
        //             }
        //             return;
        //           }
        //         }
        //       });
        //     } else {
        //       this.searchData('backfresh');
        //     }
        //   } else if (res.message) {
        //     if ($('.main-content').find('.myTree').length > 0) {
        //       const destroyTab = vm.$children[0].$children[0].$children[3].$children[0].$children;
        //       const thisComponent = `${'action' + '_'}${_self.param.tablename}_${_self.formObj_tableid}`;
        //       vm.$nextTick(() => {
        //         for (let i = 0; i < destroyTab.length; i++) {
        //           const element = destroyTab[i];
        //           if (element.$vnode.data.ref == thisComponent) {
        //             if (thisComponent.indexOf('action') > -1) {
        //               element.getTableWay(false);
        //             }
        //           }
        //         }
        //       });
        //     }
        //     this.selectSysment.forEach((item, index) => {
        //       const obj = {};
        //       obj.flag = true;
        //       obj.message = `数据为系统保留字段，不允许${_self.buttonMap.CMD_SUBMIT.name}`;
        //       this.$set(_self.errorTable, item, obj);
        //     });
        //     res.data.forEach((item, index) => {
        //       const obj = {};
        //       obj.flag = true;
        //       obj.message = item.message;
        //       this.$set(_self.errorTable, item.objid, obj);
        //     });
        //     this.searchData('backfresh');
        //   } else if (res.data) {
        //     let refParam;
        //     if (typeof res.data === 'string') refParam = JSON.parse(res.data);
        //     else refParam = res.data;
        //     if (refParam.actionname) {
        //       axios({
        //         method: 'post',
        //         url: '/p/cs/getAction',
        //         data: {
        //           actionid: 0,
        //           webaction: refParam.actionname,
        //         },
        //       }).then((res) => {
        //         this.actionLoading = false;
        //         if (res.data.code === 0) {
        //           const tab = res.data.data;
        //           if (refParam) {
        //             for (const key of Object.keys(refParam)) {
        //               tab.action = tab.action.replace(`\${${key}}`, refParam[key]);
        //             }
        //           }
        //           this.webaction(tab);
        //         }
        //       });
        //     } else {
        //       this.searchData('backfresh');
        //     }
        //   } else {
        //     this.searchData('backfresh');
        //   }
        // }).catch((error) => {
        //   this.actionLoading = false;
        //   this.searchData('backfresh');
        // });
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
      errorconfirmDialog() {
        const arr = [];

        this.buttons.selectIdArr.forEach((item, index) => {
          if (this.buttons.sysmentArr.indexOf(item) >= 0) {
            this.buttons.selectSysment.push(item);
          } else {
            arr.push(item);
          }
        });
        this.onSelectionChangedAssignment({ arr, rowArray });
        // this.buttons.selectIdArr = arr;
        if (this.buttons.selectIdArr.length === 0) {
          this.buttons.selectSysment.forEach((item, index) => {
            const obj = {};
            obj.flag = true;
            obj.message = `数据为系统保留字段，不允许${this.buttonMap.CMD_DELETE.name}`;
            this.$set(this.errorTable, item, obj);
          });
        }
        this.$nextTick(() => {
          if (this.buttons.selectIdArr.length > 0) {
            if (this.buttons.errorData.content.indexOf(this.buttonMap.CMD_UNSUBMIT.name) >= 0) {
              this.batchUnSubmit();
              this.selectIdArr = [];
              this.selectArr = [];
              return;
            } if (this.buttons.errorData.content.indexOf(this.buttonMap.CMD_SUBMIT.name) >= 0) {
              this.batchSubmit();
              this.selectIdArr = [];
              this.selectArr = [];
              return;
            } if (this.buttons.errorData.content.indexOf(this.buttonMap.CMD_DELETE.name) >= 0) {
              this.deleteTableList();// 按钮删除动作
              return;
            } if (this.buttons.errorData.content.indexOf(this.buttonMap.CMD_VOID.name) >= 0) {
              this.batchVoid();// 按钮作废动作
              this.selectIdArr = [];
              this.selectArr = [];
              return;
            }
          }
          if (this.activeTabAction) {
            if (this.activeTabAction.vuedisplay === 'slient' && option && this.errorDialogClass === 'warning') {
              if (this.activeTabAction.confirm.indexOf('{') >= 0) {
                if (JSON.parse(this.activeTabAction.confirm).isselect) {
                  if (JSON.parse(this.activeTabAction.confirm).isradio) {
                    // 单选
                    if (this.selectIdArr.length === 1) {
                      this.webActionSlient(this.activeTabAction); // 静默执行
                    }
                  } else if (this.selectIdArr.length > 0) {
                    this.webActionSlient(this.activeTabAction);
                  }
                } else {
                  this.webActionSlient(this.activeTabAction);
                }
              } else {
                this.webActionSlient(this.activeTabAction);
              }
              return;
            }
            if (this.activeTabAction.vuedisplay === 'navbar' && option && this.errorDialogClass === 'warning') {
              if (this.activeTabAction.confirm.indexOf('{') >= 0) {
                if (JSON.parse(this.activeTabAction.confirm).isselect) {
                  if (JSON.parse(this.activeTabAction.confirm).isradio) {
                    // 单选
                    if (this.selectIdArr.length === 1) {
                      this.objTabActionNavbar(this.activeTabAction); // 新标签跳转
                    }
                  } else if (this.selectIdArr.length > 0) {
                    this.objTabActionNavbar(this.activeTabAction);
                  }
                } else {
                  this.objTabActionNavbar(this.activeTabAction);
                }
              } else {
                this.objTabActionNavbar(this.activeTabAction);
              }
              return;
            }
            if (option && this.activeTabAction.vuedisplay === 'dialog' && this.errorDialogClass === 'warning') { // 弹窗动作定义提示后操作
              if (this.activeTabAction.confirm.indexOf('{') >= 0) {
                if (JSON.parse(this.activeTabAction.confirm).isselect) {
                  if (JSON.parse(this.activeTabAction.confirm).isradio) {
                    // 单选
                    if (this.selectIdArr.length === 1) {
                      const obj = this.activeTabAction;
                      this.actionDialog.queryString = obj.action.split('?')[1];
                      this.actionDialog.show = true;
                      this.actionDialog.title = obj.webdesc;
                      const componentName = obj.action.split('?')[0].replace(/\//g, '_');
                      Vue.component(componentName, Vue.extend(_import_custom(obj.action.split('?')[0])));
                      this.dialogComponent = componentName;
                    }
                  } else if (this.selectIdArr.length > 0) {
                    const obj = this.activeTabAction;
                    this.actionDialog.queryString = obj.action.split('?')[1];
                    this.actionDialog.show = true;
                    this.actionDialog.title = obj.webdesc;
                    const componentName = obj.action.split('?')[0].replace(/\//g, '_');
                    Vue.component(componentName, Vue.extend(_import_custom(obj.action.split('?')[0])));
                    this.dialogComponent = componentName;
                  } else {
                    // this.webActionSlient(this.activeTabAction)
                  }
                } else {
                  const obj = this.activeTabAction;
                  this.actionDialog.queryString = obj.action.split('?')[1];
                  this.actionDialog.show = true;
                  this.actionDialog.title = obj.webdesc;
                  const componentName = obj.action.split('?')[0].replace(/\//g, '_');
                  Vue.component(componentName, Vue.extend(_import_custom(obj.action.split('?')[0])));
                  this.dialogComponent = componentName;
                }
              } else {
                const obj = this.activeTabAction;
                this.actionDialog.queryString = obj.action.split('?')[1];
                this.actionDialog.show = true;
                this.actionDialog.title = obj.webdesc;
                const componentName = obj.action.split('?')[0].replace(/\//g, '_');
                Vue.component(componentName, Vue.extend(_import_custom(obj.action.split('?')[0])));
                this.dialogComponent = componentName;
              }
            }
          }
          if (this.errorData.message.indexOf('批量更新') >= 0) {
            this.dataConShow.dataConShow = true;
            this.dataConShow.title = this.$store.state.activeTab.label;
            this.dataConShow.tabConfig = {
              tabledesc: this.$store.state.activeTab.label,
              tablename: this.param.tablename,
              tableid: this.formObj_tableid,
              tabrelation: '1:1',
              objid: this.selectIdArr,
            };
            this.dataConShow.fixedcolumns = this.getJson();
            this.dataConShow.reffixedcolumns = this.treeObj.fixedcolumns;
          } else if (this.errorData.message.indexOf('操作会执行全量导出') >= 0) {
            this.batchExport();
          } else if (this.selectSysment.length > 0) {
            this.searchData('backfresh');
          }
        });
      },
      errorDialogClose() {
        const errorDialogvalue = false;
        this.setErrorModalValue({ errorDialogvalue });
      }
     
    },
    mounted() {
      this.getTableQuery();
      this.getQueryListForAg(this.searchData);
      clearTimeout(window.timer);
      window.timer = setTimeout(() => {
        this.getbuttonGroupdata();
      }, 1000);
      
      // 临时处理方案
      setTimeout(() => {
        this.searchClickData();
      }, 500);
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
