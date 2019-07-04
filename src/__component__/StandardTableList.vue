
<!--suppress ALL -->
<template>
  <div class="StandardTableListRootDiv">
    <ButtonGroup
      :data-array="buttons.dataArray"
      @buttonClick="buttonClick"
    />
    <FormItemComponent
      ref="FormItemComponent"
      :form-items-data="formItems.data"
      :form-item-lists="formItemsLists"
      :default-column="4"
      :search-foldnum="formItems.searchFoldnum"
      @formDataChange="formDataChange"
    />
    <AgTable
      ref="agTableElement"
      :style="agTableElementStyles"
      :page-attribute="pageAttribute"
      :datas="ag.datas"
      :css-status="ag.status4css"
      :legend="ag.status4css"
      :user-config-for-ag-table="userConfigForAgTable"
      :on-page-change="onPageChange"
      :on-page-size-change="onPageSizeChange"
      :on-selection-changed="onSelectionChanged"
      :on-row-double-click="onRowDoubleClick"
      :on-sort-changed="onSortChange"
      :on-column-moved="onColumnMoved"
      :on-column-pinned="onColumnPinned"
      :on-column-visible-changed="onColumnVisibleChanged"
      :on-cell-single-click="onCellSingleClick"
    />
    <!-- <Modal/>//动作定义弹框，已将动作定义弹框和提示弹框整合，此弹框暂时弃用
      v-if="buttons.actionDialog.show"
      v-model="actionModal"
      :mask="true"
      :title="buttons.actionDialog.title"
    >
      <keep-alive
        include
        exclude
      >
        <component :is="dialogComponent" />
      </keep-alive>
    </Modal> -->
    <!-- 导入弹框 -->
    <ImportDialog
      v-if="buttons.importData.importDialog"
      :name="buttons.importData.importDialog"
      :visible="buttons.importData.importDialog"
      :show-close="true"
      :title="buttons.importData.importDialogTitle"
      :tablename="buttons.tableName"
      :main-id="buttons.tableId"
      @confirmImport="searchClickData"
      @closeDialog="closeDialog"
    />
    <ErrorModal
      ref="dialogRefs"
      :mask="buttons.dialogConfig.mask"
      :title="buttons.dialogConfig.title"
      :content-text="buttons.dialogConfig.contentText"
      :footer-hide="buttons.dialogConfig.footerHide"
      :confirm="buttons.dialogConfig.confirm"
      @confirmDialog="errorconfirmDialog()"
    />
    <dialogComponent
      ref="dialogRef"
      :title="dialogComponentNameConfig.title"
      :mask="dialogComponentNameConfig.mask"
      :content-text="dialogComponentNameConfig.contentText"
      :footer-hide="dialogComponentNameConfig.footerHide"
      :confirm="dialogComponentNameConfig.confirm"
      :dialog-component-name="dialogComponentName"
      @dialogComponentSaveSuccess="dialogComponentSaveSuccess"
    />
    <!-- 批量 -->
    <modifyDialog
      v-if="modifyDialogshow"
      ref="dialogmodify"
      :title="activeTab.label"
      @on-oncancle-success="onCancleSuccess"
      @on-save-success="onSaveSuccess"
    />
  </div>
</template>

<script>
  import Vue from 'vue';
  import { mapActions, mapState, mapMutations } from 'vuex';
  import ButtonGroup from './ButtonComponent';
  import AgTable from './AgTable';
  import FormItemComponent from './FormItemComponent';
  import ItemComponent from './ItemComponent';
  import buttonmap from '../assets/js/buttonmap';
  import dialogComponent from './Dialog.vue';
  import ChineseDictionary from '../assets/js/ChineseDictionary';
  import ImportDialog from './ImportDialog';
  import ErrorModal from './ErrorModal';
  import modifyDialog from './ModifyModal';
  import { Version } from '../constants/global';
  import { getGateway } from '../__utils__/network';
  import CustomizeModule from '../__config__/customizeDialog.config';

  const {
    fkQueryList, fkFuzzyquerybyak, fkGetMultiQuery, fkDelMultiQuery 
  // eslint-disable-next-line import/no-dynamic-require
  } = require(`../__config__/actions/version_${Version}/formHttpRequest/fkHttpRequest.js`);

  export default {
    components: {
      ButtonGroup,
      AgTable,
      FormItemComponent,
      ImportDialog,
      ErrorModal,
      modifyDialog,
      dialogComponent
    },
    data() {
      return {
        actionModal: false,
        dialogComponent: null,
        searchData: {
          table: this.$route.params.tableName,
          startIndex: 0,
          range: 10,
          orderby: undefined
        },
        formItemsLists: [],
        modifyDialogshow: false, // 批量修改弹窗
        formDefaultComplete: false,
        dialogComponentName: null,
        dialogComponentNameConfig: {
          title: '提示',
          mask: true,
          footerHide: false,
          contentText: '',
          confirm: () => {
          }
        }, // 弹框配置信息
      };
    },
    computed: {
      ...mapState('global', {
        favorite: ({ favorite }) => favorite,
        activeTab: ({ activeTab }) => activeTab,
        serviceIdMap: ({ serviceIdMap }) => serviceIdMap,
        keepAliveLabelMaps: ({ keepAliveLabelMaps }) => keepAliveLabelMaps
      }),
      formLists() {
        return this.refactoringData(
          this.formItems.defaultFormItemsLists.concat([])
        );
      },
      agTableElementStyles() {
        if (this.formItemsLists.length === 0) {
          return {
            paddingTop: 0
          };
        }
        return {};
      }
    },
    watch: {
      formLists() {
        const arr = JSON.parse(JSON.stringify(this.formLists));
        arr.map((temp, index) => {
          temp.component = this.formLists[index].component;
          temp.item.event = this.formLists[index].item.event;
          temp.item.props = this.formLists[index].item.props;
          temp.labelWidth = 90;
          return temp;
        });
        if (JSON.stringify(arr) !== JSON.stringify(this.formItemsLists)) {
          this.formItemsLists = arr;
        }
      },
      $route() {
        setTimeout(() => {
          // 当路由变化，且观测到是返回动作的时候，延迟执行查询动作。
          if (this.$route.query.isBack && !this._inactive) {
            this.searchClickData();
          }
        }, 0);
      },
    },
    methods: {
      ...mapActions('global', ['updateAccessHistory']),
      ...mapMutations('global', ['tabHref', 'tabOpen']),
      dialogComponentSaveSuccess() { // 自定义弹框执行确定按钮操作
        if (this.buttons.isrefrsh) {
          this.searchClickData();
        }
      },
      closeDialog() {
        this.closeImportDialog();
      },
      onCancleSuccess() {
        this.modifyDialogshow = false;
      },
      onSaveSuccess() {
        // 重新请求
        this.modifyDialogshow = false;
        this.getQueryList();
      },
      getQueryList() {
        const { agTableElement } = this.$refs;
        agTableElement.showAgLoading();
        this.getQueryListForAg(this.searchData);
        this.onSelectionChangedAssignment({ rowIdArray: [], rowArray: [] });// 查询成功后清除表格选中项
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
      onRowDoubleClick(colDef, row) {
        const { tableName, tableId } = this.$route.params;
        const id = row.ID.val;
        const label = `${this.activeTab.label}编辑`;
        if (this.ag.datas.objdistype === 'tabpanle') {
          // 单对象左右结构
          const type = 'tableDetailHorizontal';
          const tab = {
            type,
            tableName,
            tableId,
            label,
            id
          };
          this.tabHref(tab);
        } else {
          // 单对象上下结构
          const type = 'tableDetailVertical';
          const tab = {
            type,
            tableName,
            tableId,
            label,
            id
          };
          this.tabHref(tab);
        }
      }, // ag表格行双击回调
      onSortChange(sortArr) {
        const { tableName } = this.$route.params;
        this.searchData.orderby = sortArr.map(d => ({
          column: `${tableName}.${d.colId || 'COMUMN_NOT_EXIST'}`,
          asc: d.sort === 'asc'
        }));
        this.getQueryList();
      },
      onColumnMoved(cols) {
        const { tableId } = this.$route.params;
        this.setColPosition({
          tableid: tableId,
          colposition: cols
        });
        this.updateAgConfig({ key: 'colPosition', value: cols });
      },
      onColumnPinned(pinnedCols) {
        const { tableId } = this.$route.params;
        this.setColPin({
          tableid: tableId,
          fixedcolumn: pinnedCols
        });
        this.updateAgConfig({ key: 'fixedColumn', value: pinnedCols });
      },
      onColumnVisibleChanged(hideCols) {
        const { tableId } = this.$route.params;
        this.setColHide({
          tableid: tableId,
          hidecolumns: hideCols
        });
        this.updateAgConfig({ key: 'hideColumn', value: hideCols });
      },
      onCellSingleClick(colDef, rowData, target) {
        if (target.getAttribute('data-target-tag') === 'fkIcon') {
          const { reftableid, reftablename, refobjid } = rowData[colDef.colId];
          this.tabHref({
            id: refobjid,
            tableName: reftablename,
            tableId: reftableid,
            type: 'tableDetailVertical'
          });
        }
      },
      // 表单操作
      refactoringData(defaultFormItemsLists) {
        // 对获取的数据进行处理
        let items = [];
        if (this.formItemsLists.length > 0) {
          return this.formItemsLists;
        }
        items = JSON.parse(JSON.stringify(defaultFormItemsLists)).reduce(
          (array, current, itemIndex) => {
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
                default:
                  break;
                }
              }

              if (
                item.display === 'OBJ_DATENUMBER'
                || item.display === 'OBJ_DATE'
              ) {
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
                keydown: (event) => {
                  // 输入框的keydown event, $this
                  if (event.keyCode === 13) {
                    // enter回车查询
                    this.searchClickData();
                  }
                },
                change: () => {
                  if (current.isuppercase) {
                    setTimeout(() => {
                      this.lowercaseToUppercase(itemIndex);
                    }, 50);
                  }
                },
                'on-delete': ($this, item, key, index) => {
                  fkDelMultiQuery({
                    searchObject: {
                      tableid: item.props.fkobj.reftableid,
                      modelname: key
                    },
                    serviceId: current.fkobj.serviceId,
                    success: () => {
                      fkGetMultiQuery({
                        searchObject: {
                          tableid: item.props.fkobj.reftableid
                        },
                        serviceId: current.fkobj.serviceId,
                        success: (res) => {
                          this.freshDropDownPopFilterData(res, index);
                        }
                      });
                    }
                  });
                },
                'popper-value': ($this, value, Selected) => {
                  // 当外键下拉展开时去请求数据
                  this.formItemsLists[itemIndex].item.value = value;
                  this.formItemsLists[itemIndex].item.props.Selected = Selected;
                  this.formItemsLists = this.formItemsLists.concat([]);
                },
                'popper-show': ($this, item, index) => {
                  // 当气泡拉展开时去请求数据
                  fkGetMultiQuery({
                    searchObject: {
                      tableid: item.props.fkobj.reftableid
                    },
                    serviceId: current.fkobj.serviceId,
                    success: (res) => {
                      this.freshDropDownPopFilterData(res, index);
                    }
                  });
                },
                'on-popper-hide': ($this) => {
                  // 初始化清空数据
                  this.formItemsLists[itemIndex].item.props.data = {};
                  this.formItemsLists = this.formItemsLists.concat([]);
                },
                'on-show': ($this) => {
                  // 当外键下拉站开始去请求数据
                  fkQueryList({
                    searchObject: {
                      isdroplistsearch: true,
                      refcolid: current.colid,
                      startindex: 0,
                      range: $this.pageSize
                    },
                    serviceId: current.fkobj.serviceId,
                    success: (res) => {
                      this.freshDropDownSelectFilterData(res, itemIndex);
                    }
                  });
                },
                inputValueChange: (value) => {
                  // 外键的模糊搜索
                  if (!value) {
                    // this.freshDropDownSelectFilterAutoData({}, itemIndex, 'empty');
                    return false;
                  }
                  fkFuzzyquerybyak({
                    searchObject: {
                      ak: value,
                      colid: current.colid,
                      fixedcolumns: {}
                    },
                    serviceId: current.fkobj.serviceId,
                    success: (res) => {
                      this.freshDropDownSelectFilterAutoData(res, itemIndex);
                    }
                  });
                },
                pageChange: (currentPage, $this) => {
                  // 外键的分页查询
                  fkQueryList({
                    searchObject: {
                      isdroplistsearch: true,
                      refcolid: current.colid,
                      startindex: $this.data.defaultrange * ($this.currentPage - 1),
                      range: $this.pageSize
                    },
                    serviceId: current.fkobj.serviceId,
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
                sumArray = sumArray.concat(
                  item.combobox.reduce((sum, temp) => {
                    sum.push({
                      label: temp.limitdesc,
                      value: `${item.colname}|${temp.limitval}`
                    });
                    return sum;
                  }, [])
                );
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
              // obj.item.props.regx = regExp.Capital;
              // obj.item.event.regxCheck = (value, $this, errorValue) => {
              //   this.lowercaseToUppercase(errorValue, itemIndex);
              // };
            }

            // 外键的单选多选判断

            if (current.display === 'OBJ_FK') {
              switch (current.fkobj.searchmodel) {
              case 'drp':
                obj.item.props.single = true;
                obj.item.props.fkobj = current.fkobj;
                obj.item.props.defaultSelected = this.defaultValue(current) || [];
                break;
              case 'mrp':
                obj.item.props.single = false;
                obj.item.props.fkobj = current.fkobj;
                obj.item.props.defaultSelected = this.defaultValue(current) || [];
                break;
              case 'pop':
                obj.item.props.fkobj = current.fkobj;
                obj.item.props.fkobj.colid = current.colid;
                obj.item.props.Selected = [];
                break;
              case 'mop':
                obj.item.props.fkobj = current.fkobj;
                obj.item.props.fkobj.colid = current.colid;
                obj.item.props.fkobj.url = `/${obj.item.props.fkobj.serviceId}/p/cs/menuimport`;
                obj.item.props.datalist = [];
                obj.item.props.Selected = [];
                obj.item.props.filterDate = {};

                break;
              default:
                break;
              }
            }

            array.push(obj);
            return array;
          },
          []
        );

        // 处理默认数据，然后进行查询
        if (defaultFormItemsLists.length === 0 && !this.formDefaultComplete) {
          this.formDefaultComplete = true;
          this.searchClickData();
        }
        if (Object.keys(this.formItems.data).length === 0 && defaultFormItemsLists.length !== 0) {
          this.formDataChange(
            items.reduce((obj, current) => {
              obj[current.item.field] = current.item.value;
              return obj;
            }, {})
          );

          setTimeout(() => {
            this.searchClickData();
          }, 200);
        }
        return items;
      },
      defaultValue(item) {
        // 设置表单的默认值


        if (item.display === 'OBJ_DATENUMBER') {
          // 日期控件
          if (item.default === '-1') {
            return '';
          } if (item.default !== '-1' && item.default) {
            return Date().minusDays(item.default).toIsoDateString();
          }
          const timeRange = [
            new Date().toIsoDateString(),
            new Date().minusDays(Number(item.daterange)).toIsoDateString()
          ];
          return timeRange;
        }
        if (item.display === 'OBJ_DATE') {
          const timeRange = [
            `${new Date()
              .minusDays(Number(item.daterange))
              .toIsoDateString()} 00:00:00`,
            `${new Date().toIsoDateString()} 23:59:59`
          ];
          return timeRange;
        }

        if (item.display === 'OBJ_SELECT' && item.default) {
          // 处理select的默认值
          const arr = [];
          arr.push(item.default);
          return arr;
        }

        if (item.display === 'OBJ_FK' && item.default) {
          // 外键默认值
          const arr = [];
          arr.push({
            ID: item.refobjid,
            Label: item.default
          });
          return arr;
        }
        // if(item.display === 'OBJ_FK' && item.fkobj){
        //     return '';
        // }
        return item.default;
      },
      getTableQuery() {
        // 获取列表的查询字段
        this.getTableQueryForForm(this.searchData);
      },
      formDataChange(data, item, index) { // 表单数据修改
        if (JSON.stringify(this.formItems.data) !== JSON.stringify(data)) {
          if (this.formItemsLists.length > 0) {
            this.formItemsLists[index].item.value = item.item.value;
          }

          this.updateFormData(data);
        }
      },
      freshDropDownPopFilterData(res, index) {
        // 外键下拉时，更新下拉数据
        // this.formItemsLists[index].item.props.datalist = res.data.data;
        if (res.length > 0) {
          res.forEach((item) => {
            item.label = item.value;
            item.value = item.key;
            item.delete = true;
          });
          this.formItemsLists[index].item.props.datalist = res;
        } else {
          this.formItemsLists[index].item.props.datalist = res;
        }
      },
      freshDropDownSelectFilterData(res, index) {
        // 外键下拉时，更新下拉数据
        this.formItemsLists[index].item.props.data = Object.assign({}, res.data.data);
        this.formItemsLists[index].item.props.totalRowCount = res.data.data.totalRowCount;
        this.formItemsLists[index].item.props.pageSize = res.data.data.defaultrange;
        this.formItemsLists = this.formItemsLists.concat([]);
      },
      freshDropDownSelectFilterAutoData(res, index, type) {
        // 外键的模糊搜索数据更新
        this.formItemsLists[index].item.props.hidecolumns = ['id', 'value'];
        console.log(this.formItemsLists[index].item);
        if (type === 'empty') {
          this.formItemsLists[index].item.props.defaultSelected = [];

          // this.formItemsLists[index].item.props.AutoData = [];
          console.log(this.formItemsLists[index].item.props);
        } else {
          this.formItemsLists[index].item.props.AutoData = res.data.data;
        }
        this.formItemsLists = this.formItemsLists.concat([]);
      },
      lowercaseToUppercase(index) {
        // 将字符串转化为大写
        const UppercaseValue = this.formItemsLists[index].item.value ? this.formItemsLists[index].item.value.toUpperCase() : '';
        this.formItemsLists[index].item.value = UppercaseValue;
        this.formItemsLists = this.formItemsLists.concat([]);
      },

      // 按钮组操作
      getbuttonGroupdata() {
        // 获取按钮数据
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
                if (tabcmdData.paths) {
                  buttonConfigInfo.requestUrlPath = tabcmdData.paths[index];
                }
                buttonGroupShow.push(buttonConfigInfo);
              }
            }
          });
          this.updateDefaultButtonGroupData(buttonGroupShow);
          this.collectTablelist();
        }
      },
      onSelectionChanged(rowIdArray, rowArray) {
        // 获取表格选中明细
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
      objTabActionDialog(tab) { // 动作定义弹出框
        this.$refs.dialogRef.open();
        const title = `${tab.webdesc}`;
        this.dialogComponentNameConfig = {
          title,
        };
        this.dialogComponentNameConfig.footerHide = true;
        // this.actionDialog.show = true;
        // this.actionDialog.title = tab.webdesc;
        if (tab.action.indexOf('?') >= 0) {
          this.dialogComponent = this.getCustomizeComponent(tab.action.split('/')[0]);
        } else {
          const url = tab.action;
          const index = url.lastIndexOf('\/');
          const filePath = url.substring(index + 1, url.length);
          Vue.component(filePath, CustomizeModule[filePath].component);
          this.dialogComponentName = filePath;
        }
      },
      webactionClick(type, obj) {
        // 点击自定义按钮 创建table
        this.setActiveTabActionValue(obj);
        if (obj.vuedisplay === 'native') {
          // 接口返回有url地址
          // eslint-disable-next-line no-restricted-globals
          location.href = obj.action;
          return;
        }
        if (obj.vuedisplay === 'slient') {
          // 静默程序            if(obj.confirm){  //有提示
          if (obj.confirm) {
            // 有提示
            if (obj.confirm.indexOf('{') >= 0) {
              if (obj.confirm || JSON.parse(obj.confirm).isselect) {
                if (this.buttons.selectIdArr && this.buttons.selectIdArr.length === 0) {
                  const title = this.ChineseDictionary.WARNING;
                  const contentText = `${JSON.parse(obj.confirm).nodesc}`;
                  this.dialogMessage(title, contentText);
                } else if (
                  JSON.parse(obj.confirm).isradio
                  && this.buttons.selectIdArr.length !== 1
                ) {
                  const title = this.ChineseDictionary.WARNING;
                  const contentText = `${JSON.parse(obj.confirm).radiodesc}`;
                  this.dialogMessage(title, contentText);
                } else if (JSON.parse(obj.confirm).desc) {
                  const title = this.ChineseDictionary.WARNING;
                  const contentText = `${JSON.parse(obj.confirm).desc}`;
                  this.dialogMessage(title, contentText);
                } else {
                  // 参数都不存在,直接执行
                  this.webActionSlient(obj);
                }
              }
            } else {
              const title = this.ChineseDictionary.WARNING;
              const contentText = `${obj.confirm}`;
              this.dialogMessage(title, contentText);
            }
          } else {
            this.webActionSlient(obj);
          }
        } else if (obj.vuedisplay === 'navbar') {
          // !JSON.parse(obj.confirm.isselect)
          if (!obj.confirm || !JSON.parse(obj.confirm).isselect) {
            this.objTabActionNavbar(obj); // 新标签跳转
          } else {
            // 动作定义根据列表是否选值
            const confirm = JSON.parse(obj.confirm);
            if (this.buttons.selectIdArr.length > 0) {
              if (confirm.isradio && this.buttons.selectIdArr.length !== 1) {
                const title = this.ChineseDictionary.WARNING;
                const contentText = `${confirm.radiodesc}`;
                this.dialogMessage(title, contentText);
              } else if (confirm.desc) {
                const title = this.ChineseDictionary.WARNING;
                const contentText = `${confirm.desc}`;
                this.dialogMessage(title, contentText);
              } else {
                this.objTabActionNavbar(obj); // 新标签跳转
              }
            } else if (confirm.nodesc) {
              const title = this.ChineseDictionary.WARNING;
              const contentText = `${confirm.nodesc}`;
              this.dialogMessage(title, contentText);
            } else {
              this.objTabActionNavbar(obj); // 新标签跳转
            }
          }
        } else if (!obj.confirm || !JSON.parse(obj.confirm).isselect) {
          this.objTabActionDialog(obj);
          // this.setActionDialog(obj);
          // const componentName = obj.action.split('?')[0].replace(/\//g, '/');
          // Vue.component(
          //   componentName,
          //   Vue.extend(importCustom(obj.action.split('?')[0]))
          // );
        } else if (JSON.parse(obj.confirm).isselect) {
          // 是否是必选列表项, 动作定义根据列表是否选值
          const confirm = JSON.parse(obj.confirm);
          if (this.buttons.selectIdArr.length > 0) {
            if (confirm.isradio && this.buttons.selectIdArr.length !== 1) {
              const title = this.ChineseDictionary.WARNING;
              const contentText = `${confirm.radiodesc}`;
              this.dialogMessage(title, contentText);
            } else if (confirm.desc) {
              const title = this.ChineseDictionary.WARNING;
              const contentText = `${confirm.desc.replace(
                '{isselect}',
                this.buttons.selectIdArr.length
              )}`;
              this.dialogMessage(title, contentText);
            } else {
              // this.setActionDialog(obj);
              // const componentName = obj.action
              //   .split('?')[0]
              //   .replace(/\//g, '_');
              // Vue.component(
              //   componentName,
              //   Vue.extend(importCustom(obj.action.split('?')[0]))
              // );
              // this.dialogComponent = componentName;
              this.objTabActionDialog(obj);
            }
          } else if (confirm.nodesc) {
            const title = this.ChineseDictionary.WARNING;
            const contentText = `${confirm.nodesc}`;
            this.dialogMessage(title, contentText);
          } else {
            // this.setActionDialog(obj);

            // const componentName = obj.action.split('?')[0].replace(/\//g, '_');

            // Vue.component(
            //   componentName,
            //   Vue.extend(importCustom(obj.action.split('?')[0]))
            // );
            // this.dialogComponent = componentName;
            this.objTabActionDialog(obj);
          }
        } else {
          const message = obj.confirm.indexOf('{') >= 0
            ? JSON.parse(obj.confirm).nodesc
            : obj.confirm;
          const title = this.ChineseDictionary.WARNING;
          const contentText = `${message}`;
          this.dialogMessage(title, contentText);
        }
      },
      webActionSlient(item) {
        const obj = {
          tableid: this.buttons.tableId,
          ids: this.buttons.selectIdArr,
          menu: this.buttons.tabledesc
        };
        let promise = new Promise((resolve, reject) => {
          this.$loading.show();
          this.getExeActionDataForButtons({
            item, obj, resolve, reject 
          });
        });
        if (this.buttons.activeTabAction.cuscomponent) { // 如果接口cuscomponent有值，逻辑为自定义调自定义
          const nextOperate = JSON.parse(// 配置信息
            this.buttons.activeTabAction.cuscomponent
          );
          promise.then(() => {
            this.$loading.hide();
            if (nextOperate.success) {
              let successAction = null;
              let successActionParam = {};
              successAction = nextOperate.success;
              successActionParam = {
                actionid: 0,
                webaction: successAction
              };
              promise = new Promise((resolve) => {
                this.getActionDataForButtons({ param: successActionParam, resolve });
              });
              promise.then(() => {
                const exeActionDataForComponent = this.buttons.ExeActionDataForComponent.data;
                const type = 'custom';
                this.webactionClick(type, exeActionDataForComponent);
              });
            } else {
              const message = this.buttons.ExeActionData;
              const data = {
                mask: true,
                title: '成功',
                content: `${message}`
              };
              this.$Modal.fcSuccess(data);
            }
          }, () => {
            this.$loading.hide();
            if (nextOperate.failure) {
              let errorAction = null;
              let errorActionParam = {};
              errorAction = nextOperate.failure;
              errorActionParam = {
                actionid: 0,
                webaction: errorAction
              };
              promise = new Promise((resolve) => {
                this.getActionDataForButtons({ param: errorActionParam, resolve });
              });
              promise.then(() => {
                const exeActionDataForComponent = this.buttons.ExeActionDataForComponent.data;
                const type = 'custom';
                this.webactionClick(type, exeActionDataForComponent);
              });
            }
          });
        } else { // 没有配置动作定义调动作定义逻辑
          promise.then(() => {
            this.$loading.hide();
            const message = this.buttons.ExeActionData;
            const data = {
              mask: true,
              title: '成功',
              content: `${message}`
            };
            this.$Modal.fcSuccess(data);
            if (this.buttons.isrefrsh) {
              this.searchClickData();
            }
          }, () => {
          });
        }
      },

      dataProcessing() { // 查询数据处理
        const jsonData = Object.keys(this.formItems.data).reduce((obj, item) => {
          if (this.formItems.data[item] && JSON.stringify(this.formItems.data[item]).indexOf('bSelect-all') < 0) {
            obj[item] = this.formItems.data[item];
          }
          return obj;
        }, {});
  
        return Object.keys(jsonData).reduce((obj, item) => {
          let value = '';

          this.formItemsLists.concat([]).every((temp) => {
            if (temp.item.field === item) { // 等于当前节点，判断节点类型
              if (temp.item.type === 'DatePicker' && (temp.item.props.type === 'datetimerange' || temp.item.props.type === 'daterange')) { // 当为日期控件时，数据处理
                if ((jsonData[item][0] && jsonData[item][1])) {
                  value = jsonData[item].join('~');
                } else {
                  value = '';
                }
                return false;
              }

              if (
                temp.item.type === 'TimePicker'
                && temp.item.props.type === 'timerange'
                && (jsonData[item][0] && jsonData[item][1])
              ) {
                // 时分秒的时间段处理
                value = jsonData[item].join('~');
                return false;
              }
              
              if (temp.item.type === 'select') {
                if (jsonData[item].length > 0) {
                  value = jsonData[item].map(option => `=${option}`);
                } else {
                  value = '';
                }
  
                // 处理select，分为单个字段select和合并型select
                return false;
              }
              value = jsonData[item];
              return false;
            }

            if (
              !temp.item.field
              && temp.item.type === 'select'
              && item.indexOf(':ENAME') < 0
            ) {
              // 处理合并型select
              value = jsonData[item].map(option => `=${option}`);
              return false;
            }
            if (temp.item.inputname === item) {
              value = jsonData[item];
            }
            

            return true;
          });
          if (value) {
            obj[item] = value;
          }

          return obj;
        }, {});
      },
      searchClickData() {
        // 按钮查找 查询第一页数据
        this.searchData.startIndex = 0;
        this.searchData.fixedcolumns = this.dataProcessing();
        this.getQueryListForAg(this.searchData);
        this.onSelectionChangedAssignment({ rowIdArray: [], rowArray: [] });// 查询成功后清除表格选中项
      },
      dialogMessage(title, contentText) {
        this.setErrorModalValue({
          title,
          contentText,
        });
        this.$refs.dialogRefs.open();
      },
      AddDetailClick(obj) {
        const { tableName, tableId } = this.$route.params;
        if (obj.name === this.buttonMap.CMD_ADD.name) {
          // 新增
          const id = 'New';
          const label = `${this.activeTab.label}新增`;
          if (this.ag.datas.objdistype === 'tabpanle') { // 单对象左右结构
            const type = 'tableDetailHorizontal';
            this.tabHref({
              type,
              tableName,
              tableId,
              label,
              id
            });
          } else {
            const type = 'tableDetailVertical'; // 左右结构的单对项页面
            this.tabHref({
              type,
              tableName,
              tableId,
              label,
              id
            });
          }
          return;
        }
        if (obj.name === this.buttonMap.CMD_DELETE.name) {
          // 删除动作  对用网络请求
          if (this.buttons.selectIdArr.length > 0) {
            const title = '警告';
            const contentText = `确认执行${obj.name}?`;
            this.dialogMessage(title, contentText);
          } else {
            const data = {
              mask: true,
              title: '警告',
              content: `请先选择需要${obj.name}的记录！`
            };
            this.$Modal.fcWarning(data);
          }
          return;
        }

        if (obj.name === this.buttonMap.CMD_SUBMIT.name) {
          // 批量提交
          this.buttons.dynamicRequestUrl.submit = obj.requestUrlPath;
          if (this.buttons.selectIdArr.length > 0) {
            const title = '警告';
            const contentText = `确认执行${obj.name}?`;
            this.dialogMessage(title, contentText);
          } else {
            const data = {
              title: '警告',
              content: `请先选择需要${obj.name}的记录！`
            };
            this.$Modal.fcWarning(data);
          }
          return;
        }

        if (obj.name === this.buttonMap.CMD_VOID.name) {
          // 批量作废
          if (this.buttons.selectIdArr.length > 0) {
            const title = '警告';
            const contentText = `确认执行${obj.name}?`;
            this.dialogMessage(title, contentText);
          } else {
            const data = {
              mask: true,
              title: '警告',
              content: `请先选择需要${obj.name}的记录！`
            };
            this.$Modal.fcWarning(data);
          }
          return;
        }

        if (obj.name === this.buttonMap.CMD_UNSUBMIT.name) {
          // 批量反提交
          if (this.buttons.selectIdArr.length > 0) {
            const title = '警告';
            const contentText = `确认执行${obj.name}?`;
            this.dialogMessage(title, contentText);  
          } else {
            const data = {
              title: '警告',
              content: `请先选择需要${obj.name}的记录！`
            };
            this.$Modal.fcWarning(data);
          }
          return;
        }

        if (obj.name === this.buttonMap.CMD_EXPORT.name) {
          // 导出
          if (this.buttons.selectIdArr.length === 0) {
            const title = '警告';
            const contentText = '当前的操作会执行全量导出，导出时间可能会比较慢！是否继续导出？';
            this.dialogMessage(title, contentText);
            return;
          }
          this.batchExport();
          return;
        }

        if (obj.name === this.buttonMap.CMD_IMPORT.name) {
          // 导入
          this.setImportDialogTitle();
          // this.importGetUploadParametersForButtons(); // 调用导入参数接口
          return;
        }
        if (obj.name === this.buttonMap.CMD_GROUPMODIFY.name) {
          // 批量修改
          if (this.buttons.selectIdArr.length > 0) {
            this.modifyDialogshow = true;
            setTimeout(() => {
              this.$refs.dialogmodify.open(
                this.$route.params, this.buttons.selectIdArr.length, this.searchData.fixedcolumns, this.buttons.selectIdArr
              );
            }, 200);
          } else {
            this.$Modal.confirm({
              mask: true,
              title: '警告',
              content: `未勾选记录,将批量更新所有查询结果(共计${
                this.ag.datas.totalRowCount
              }行),是否确定继续操作?`,
              showCancel: true,
              onOk: () => {
                this.modifyDialogshow = true;
                setTimeout(() => {
                  this.$refs.dialogmodify.open(
                    this.$route.params, this.ag.datas.totalRowCount, this.searchData.fixedcolumns, 'all'
                  );
                }, 200);
              },
              onCancel: () => {

              }

            });
          }
        }
      },
      batchExport() {
        let searchData = {};
        const { tableName } = this.$route.params;
        // 导出
        searchData = {
          table: tableName,
          column_include_uicontroller: true,
          fixedcolumns: { ID: this.buttons.selectIdArr },
          range: 10,
          startindex: 0
        };
        if (this.buttons.selectIdArr.length === 0) {
          searchData.fixedcolumns = this.dataProcessing();
        } 
        const OBJ = {
          searchdata: searchData,
          filename: this.activeTab.label,
          filetype: '.xlsx',
          showColumnName: true,
          menu: this.activeTab.label
        };
        const promise = new Promise((resolve, reject) => {
          this.getExportQueryForButtons({ OBJ, resolve, reject });
        });
        promise.then(() => {
          if (this.buttons.exportdata) {
            const eleLink = document.createElement('a');
            const path = getGateway(`/p/cs/download?filename=${this.buttons.exportdata}`);
            eleLink.setAttribute('href', path);
            eleLink.style.display = 'none';
            document.body.appendChild(eleLink);
            eleLink.click();
            document.body.removeChild(eleLink);
          }
        });
      },
      deleteTableList() { // 删除方法
        const tableName = this.buttons.tableName;
        const selectIdArr = this.buttons.selectIdArr;
        const promise = new Promise((resolve, reject) => {
          this.getBatchDeleteForButtons({
            tableName, selectIdArr, resolve, reject 
          });
        });
        promise.then(() => {
          const message = this.buttons.batchDeleteData.message;
          const data = {
            mask: true,
            title: '成功',
            content: `${message}`
          };
          this.$Modal.fcSuccess(data);
        }, () => {});
      },
      batchVoid() {
        const tableName = this.buttons.tableName;
        const ids = this.buttons.selectIdArr.map(d => parseInt(d));
        // this.$loading.show();
        const promise = new Promise((resolve, reject) => {
          this.batchVoidForButtons({
            tableName, ids, resolve, reject 
          });
        });
        promise.then(() => {
          // this.$loading.hide();
          const message = this.buttons.batchVoidForButtonsData.message;
          const data = {
            mask: true,
            title: '成功',
            content: `${message}`
          };
          this.$Modal.fcSuccess(data);
        }, () => {});
      },
      batchSubmit() {
        // 批量提交
        const url = this.buttons.dynamicRequestUrl.submit;
        const tableName = this.buttons.tableName;
        const ids = this.buttons.selectIdArr.map(d => parseInt(d));
        const promise = new Promise((resolve, reject) => {
          this.batchSubmitForButtons({
            url, tableName, ids, resolve, reject 
          });
        });
        promise.then(() => {
          const message = this.buttons.batchSubmitData.message;
          const data = {
            mask: true,
            title: '成功',
            content: `${message}`
          };
          this.$Modal.fcSuccess(data);
        }, () => {});
      },
      batchUnSubmit() {
        // 批量反提交
        this.actionLoading = true;
        const obj = {
          tableName: this.buttons.tableName,
          ids: this.buttons.selectIdArr.map(d => parseInt(d))
        };
        const promise = new Promise((resolve, reject) => {
          this.batchUnSubmitForButtons({ obj, resolve, reject });
        });
        promise.then(() => {
          const message = this.buttons.batchUnSubmitData;
          if (message) {
            const data = {
              mask: true,
              title: '成功',
              content: `${message}`
            };
            this.$Modal.fcSuccess(data);
            // this.getQueryListForAg(this.searchData);
          }
        }, () => {});
      },
      forAgTableErrorMessage(errorData) { // 操纵列表数据失败时ag显示错误提示的图标以及message
        this.setAgTableErrorMessage(errorData);
      },
      clickButtonsCollect() { // 收藏
        const params = {
          id: this.buttons.tableId,
          type: 'table'
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
        // this.$nextTick(() => {
        if (this.buttons.selectIdArr.length > 0) {
          if (
            this.buttons.dialogConfig.contentText.indexOf(// 按钮批量反提交动作
              this.buttonMap.CMD_UNSUBMIT.name
            ) >= 0
          ) {
            this.batchUnSubmit();// 按钮取消提交动作
            // this.searchClickData();
            return;
          }
          if (
            this.buttons.dialogConfig.contentText.indexOf(
              this.buttonMap.CMD_SUBMIT.name
            ) >= 0
          ) {
            this.batchSubmit();// 按钮提交动作
            // this.searchClickData();
            return;
          }
          if (
            this.buttons.dialogConfig.contentText.indexOf(
              this.buttonMap.CMD_DELETE.name
            ) >= 0
          ) {
            this.deleteTableList(); // 按钮删除动作
            // this.searchClickData();
            return;
          }
          if (
            this.buttons.dialogConfig.contentText.indexOf(
              this.buttonMap.CMD_VOID.name
            ) >= 0
          ) {
            this.batchVoid(); // 按钮作废动作
            return;
          }
        }
        if (this.buttons.activeTabAction) {
          if (this.buttons.activeTabAction.vuedisplay === 'slient') {
            // slient静默跳转页面类型按钮
            if (this.buttons.activeTabAction.confirm.indexOf('{') >= 0) {
              if (JSON.parse(this.buttons.activeTabAction.confirm).isselect) {
                if (
                  JSON.parse(this.buttons.activeTabAction.confirm).isradio
                ) {
                  // 单选
                  if (this.buttons.selectIdArr.length === 1) {
                    this.webActionSlient(this.buttons.activeTabAction); // 静默执行
                  }
                } else if (this.buttons.selectIdArr.length > 0) {
                  this.webActionSlient(this.buttons.activeTabAction);
                }
              } else {
                this.webActionSlient(this.buttons.activeTabAction);
              }
            } else {
              this.webActionSlient(this.buttons.activeTabAction);
            }
            return;
          }
          if (this.buttons.activeTabAction.vuedisplay === 'navbar') {
            if (this.buttons.activeTabAction.confirm.indexOf('{') >= 0) {
              if (JSON.parse(this.buttons.activeTabAction.confirm).isselect) {
                if (
                  JSON.parse(this.buttons.activeTabAction.confirm).isradio
                ) {
                  // 单选
                  if (this.buttons.selectIdArr.length === 1) {
                    this.objTabActionNavbar(this.buttons.activeTabAction); // 新标签跳转
                  }
                } else if (this.buttons.selectIdArr.length > 0) {
                  this.objTabActionNavbar(this.buttons.activeTabAction);
                }
              } else {
                this.objTabActionNavbar(this.buttons.activeTabAction);
              }
            } else {
              this.objTabActionNavbar(this.buttons.activeTabAction);
            }
            return;
          }
          if (this.buttons.activeTabAction.vuedisplay === 'dialog') {
            // 弹窗动作定义提示后操作
            if (this.buttons.activeTabAction.confirm.indexOf('{') >= 0) {
              if (JSON.parse(this.buttons.activeTabAction.confirm).isselect) {
                if (JSON.parse(this.buttons.activeTabAction.confirm).isradio) {
                  // 单选
                  if (this.buttons.selectIdArr.length === 1) {
                    this.objTabActionDialog(this.buttons.activeTabAction);
                  } 
                } else if (this.buttons.selectIdArr.length > 0) {
                  this.objTabActionDialog(this.buttons.activeTabAction);
                } 
              } else {
                this.objTabActionDialog(this.buttons.activeTabAction);
              }
            } else {
              this.objTabActionDialog(this.buttons.activeTabAction);
            }
          }
          if (this.buttons.dialogConfig.contentText.indexOf('批量更新') >= 0) {
            this.dataConShow.dataConShow = true;
            this.dataConShow.title = this.$store.state.activeTab.label;
            this.dataConShow.tabConfig = {
              tabledesc: this.$store.state.activeTab.label,
              tablename: this.param.tablename,
              tableid: this.formObj_tableid,
              tabrelation: '1:1',
              objid: this.buttons.selectIdArr
            };
          } else if (
            this.buttons.dialogConfig.contentText.indexOf('操作会执行全量导出') >= 0
          ) {
            this.batchExport();
          } else if (this.buttons.selectSysment.length > 0) {
            this.searchData('backfresh');
          }
        }
      },
      errorDialogClose() {
        const errorDialogvalue = false;
        this.setErrorModalValue({ errorDialogvalue });
      },
      objTabActionNavbar(tab) {
        // 判断跳转到哪个页面
        const url = tab.action;
        const index = url.lastIndexOf('\/');
        const customizedModuleName = url.substring(index + 1, url.length);
        const label = tab.webdesc;
        const type = 'tableDetailAction';
        const name = Object.keys(this.keepAliveLabelMaps);
        let customizedModuleId = '';
        name.forEach((item) => {
          if (item.includes(`${customizedModuleName.toUpperCase()}`)) {
            customizedModuleId = item.split(/\./)[2];
          }
        });
        if (tab.action) {
          this.tabOpen({
            type,
            customizedModuleName,
            customizedModuleId,
            label
          });
        }
      },
      
      // network 监听函数
      networkEventListener(event) {
        if (this._inactive) { return; }
        const { detail } = event;
        const { response } = detail;
        const urlArr = ['/p/cs/batchUnSubmit', '/p/cs/batchSubmit', '/p/cs/batchDelete', '/p/cs/batchVoid'];
        let merge = false;
        if (urlArr.indexOf(detail.url || '') > -1) {
          if (response && response.data && response.data.code === -1) {
            merge = true;
          }
          this.getQueryListForAg(Object.assign({}, this.searchData, { merge }));
          this.onSelectionChangedAssignment({ rowIdArray: [], rowArray: [] });// 查询成功后清除表格选中项
        }
      }
    },
    mounted() {
      window.addEventListener('network', this.networkEventListener);
      this.updateUserConfig({ type: 'table', id: this.$route.params.tableId });
      const promise = new Promise((resolve, reject) => {
        const searchData = this.searchData;
        this.getTableQueryForForm({ searchData, resolve, reject }); 
      });
      promise.then(() => {
        this.getbuttonGroupdata();
      });
    },
    activated() {
      const { tableId } = this.$route.params;
      this.updateAccessHistory({ type: 'table', id: tableId });
    },
    created() {
      this.buttonMap = buttonmap;
      this.ChineseDictionary = ChineseDictionary;
    },
    beforeDestroy() {
      window.removeEventListener('network', this.networkEventListener);
    }
  };
</script>

<style lang="less">
.StandardTableListRootDiv {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
</style>
