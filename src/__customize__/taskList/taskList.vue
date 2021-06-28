/* eslint-disable vue/no-dupe-keys */
// 任务记录列表
<template>
  <div :class="classes">
    <div class="btn-area">
      <Button
        type="posdefault"
        @click="btnclick('search')"
      >
        查找
      </Button>
      <Button
        type="fcdefault"
        p
        @click="btnclick('reset')"
      >
        重置
      </Button>
    </div>
    <!-- <div class="form-area"> -->
    <FormItemComponent
      ref="FormItemComponent"
      :form-items-data="formItems"
      :form-item-lists="formItemsLists"
      :default-column="4"
      :default-spread="false"
      :search-foldnum="7"
      @formDataChange="formDataChange"
    />
    <!-- </div> -->
    <div class="table-area">
      <Page
        ref="page"
        size="small"
        show-total
        show-sizer
        show-elevator
        transfer
        :current="page.current"
        :page-size="page.pageSize"
        :page-size-opts="page.pageSizeOpts"
        :total="page.total"
        @on-change="pageChange"
        @on-page-size-change="pageSizeChange"
      />
      <div class="table-wrap">
        <!-- <Table
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
        @on-sort-change="tableSortChange"-->
        <!-- /> -->
        <commonTable
          ref="commonTable"
          :datas="datas"
          :css-status="cssStatus"
          :error-arr="errorArr"
          :on-row-double-click="onRowDoubleClick"
          :on-sort-changed="onSortChanged"
          :on-selection-changed="onSelectionChanged"
          :on-single-cell-click="onSingleCellClick"
          :on-row-single-click="onRowSingleClick"
          @CustomizedDialog="customizedDialog"
        />
      </div>
    </div>
  </div>
</template>
<script>
  import { mapMutations } from 'vuex';
  import network, { urlSearchParams } from '../../__utils__/network';
  import FormItemComponent from '../../__component__/FormItemComponent';
  import ItemComponent from '../../__component__/ItemComponent';
  import commonTable from './tableSpecial';
  import { Version, custommizedRequestUrl, classFix } from '../../constants/global';


  const version = Version();
  const fkHttpRequest = () => require(`../../__config__/actions/version_${version}/formHttpRequest/fkHttpRequest.js`);
  export default {
    components: { FormItemComponent, commonTable },
    data() {
      return {
        searchData: {
          table: 'TASK_RECORD',
          startindex: 0,
          range: 10,
          fixedcolumns: {},
          column_include_uicontroller: true
        }, // 查询条件
        formItemsLists: [], // 表单配置数据
        formItems: {}, // 存放form数据
        // columns: [
        // ], // 表头
        tableData: [], // 表体数据
        page: {
          pageSize: 10,
          current: 1,
          pageSizeOpts: [],
          total: 0
        },
        datas: {}, // 表格数据
        cssStatus: [], // 表格样式数据
        errorArr: [] //
      };
    },
    computed: {
      classes: () => `${classFix}task-list-container`,
      tableTotalData() {
        return [];
      }
    },
    methods: {
      ...mapMutations('global', ['tabOpen']),
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
        this.$Modal.fcWarning({
          title: '警告',
          content: '确定重置?',
          showCancel: true,
          onOk: () => {
            this.formItemsLists = this.formItemsLists.map((item) => {
              item.item.value = '';
              return item;
            });
            this.formItems = this.$refs.FormItemComponent.dataProcessing(
              this.formItemsLists
            );
            this.searchData.fixedcolumns = Object.assign({}, this.formItems);
            this.searchClickData();
          },
          onCancel: () => {}
        });
      },
      getTableQuery() {
        return new Promise((resolve) => {
          network
            .post(
              '/p/cs/getTableQuery',
              urlSearchParams({
                table: 'TASK_RECORD',
                getcmd: 'y'
              })
            )
            .then((res) => {
              resolve();
              if (res.data.code === 0) {
                const data = res.data.data.datas;
                this.formItemsLists = this.getformformat(data.dataarry);
                this.cssStatus = data.status4css;
                this.formItems = this.$refs.FormItemComponent.dataProcessing(
                  this.formItemsLists
                );
              }
            });
        });
      }, // 获取查询条件的一些数据
      defaultValue(item) {
        // 设置表单的默认值
        if (item.display === 'OBJ_DATENUMBER') {
          // 日期控件
          if (item.default === '-1') {
            return '';
          }
          if (item.default !== '-1' && item.default) {
            const timeRange = [
              new Date().setNewFormt(
                new Date().minusDays(Number(item.default)).toIsoDateString(),
                '-',
                ''
              ),
              new Date().setNewFormt(new Date().toIsoDateString(), '-', '')
            ];
            return timeRange;
          }
        }
        if (item.display === 'OBJ_DATE') {
          if (item.default === '-1') {
            return '';
          }
          const timeRange = [
            `${new Date().setNewFormt(
              new Date().minusDays(Number(item.daterange)).toIsoDateString(),
              '-',
              '/'
            )} 00:00:00`,
            `${new Date().setNewFormt(
              new Date().toIsoDateString(),
              '-',
              '/'
            )} 23:59:59`
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
      setSeachObject(obj, current) {
        // precolnameslist
        if (current.precolnameslist) {
          if (Object.hasOwnProperty.call(obj, 'ak')) {
            obj.fixedcolumns.precolnameslist = current.precolnameslist;
          } else {
            obj.precolnameslist = current.precolnameslist;
          }
          return obj;
        }
        return obj;
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
        this.formItemsLists[index].item.props.data = Object.assign(
          {},
          res.data.data
        );
        this.formItemsLists[index].item.props.totalRowCount = res.data.data.totalRowCount;
        this.formItemsLists[index].item.props.pageSize = res.data.data.defaultrange;
        this.formItemsLists = this.formItemsLists.concat([]);
      },
      freshDropDownSelectFilterAutoData(res, index, type) {
        // 外键的模糊搜索数据更新
        this.formItemsLists[index].item.props.hidecolumns = ['id', 'value'];
        if (type === 'empty') {
          this.formItemsLists[index].item.props.defaultSelected = [];

        // this.formItemsLists[index].item.props.AutoData = [];
        } else {
          this.formItemsLists[index].item.props.AutoData = res.data.data;
        }
        // this.formItemsLists = this.formItemsLists.concat([]);
        if (this.$refs.FormItemComponent) {
          this.$refs.FormItemComponent.FormItemLists[index].item.props.AutoData = res.data.data;
        }
      },
      lowercaseToUppercase(index) {
        // 将字符串转化为大写
        const UppercaseValue = this.formItemsLists[index].item.value
          ? this.formItemsLists[index].item.value.toUpperCase()
          : '';
        this.formItemsLists[index].item.value = UppercaseValue;
        this.formItemsLists = this.formItemsLists.concat([]);
      },

      getformformat(defaultFormItemsLists) {
        const items = JSON.parse(JSON.stringify(defaultFormItemsLists)).reduce(
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
            // obj.show = true;
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
                fkrpSelected: (value) => {
                  this.formItemsLists[itemIndex].item.props.AutoData = [];
                  this.formItemsLists[itemIndex].item.value = value;
                  this.formItemsLists = this.formItemsLists.concat([]);
                },
                'on-delete': ($this, item, key, index) => {
                  fkHttpRequest().fkDelMultiQuery({
                    searchObject: {
                      tableid: item.props.fkobj.reftableid,
                      modelname: key
                    },
                    serviceId: current.fkobj.serviceId,
                    success: () => {
                      fkHttpRequest().fkGetMultiQuery({
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
                  fkHttpRequest().fkGetMultiQuery({
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
                  const searchObject = {
                    isdroplistsearch: true,
                    refcolid: current.colid,
                    startindex: 0,
                    range: $this.pageSize
                  };

                  fkHttpRequest().fkQueryList({
                    searchObject: this.setSeachObject(searchObject, current),
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
                  const searchObject = {
                    ak: value,
                    colid: current.colid,
                    fixedcolumns: {}
                  };

                  fkHttpRequest().fkFuzzyquerybyak({
                    searchObject: this.setSeachObject(searchObject, current),
                    serviceId: current.fkobj.serviceId,
                    success: (res) => {
                      this.freshDropDownSelectFilterAutoData(res, itemIndex);
                    }
                  });
                },
                pageChange: (currentPage, $this) => {
                  // 外键的分页查询
                  const searchObject = {
                    isdroplistsearch: true,
                    refcolid: current.colid,
                    startindex: $this.data.defaultrange * ($this.currentPage - 1),
                    range: $this.pageSize
                  };
                  fkHttpRequest().fkQueryList({
                    searchObject: this.setSeachObject(searchObject, current),
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
              obj.item.props.display = current.display;
              obj.item.props.format = 'yyyy/MM/dd';
            }
            if (current.display === 'OBJ_DATE') {
              obj.item.props.type = 'datetimerange';
              obj.item.props.format = 'yyyy/MM/dd HH:mm:ss';
            }
            if (current.display === 'OBJ_TIME') {
              obj.item.props.type = 'timerange';
              obj.item.props.format = 'yyyy/MM/dd HH:mm:ss';
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
                obj.item.props.fk_type = 'drp';
                obj.item.props.fkobj = current.fkobj;
                obj.item.props.defaultSelected = this.defaultValue(current) || [];
                break;
              case 'mrp':
                obj.item.props.single = false;
                obj.item.props.fk_type = 'mrp';
                obj.item.props.fkobj = current.fkobj;
                obj.item.props.defaultSelected = this.defaultValue(current) || [];
                break;
              case 'pop':
                obj.item.props.fkobj = current.fkobj;
                obj.item.props.blurType = false;

                obj.item.props.fkobj.colid = current.colid;
                obj.item.props.Selected = [];
                break;
              case 'mop':
                obj.item.props.fkobj = current.fkobj;
                obj.item.props.fkobj.colid = current.colid;
                obj.item.props.blurType = false;
                // obj.item.props.fkobj.saveType = 'object';
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
        // this.resetType = false;
        return items;
      }, // 对获取的form数据进行重组
      searchClickData(value) {
        // 按钮查找 查询第一页数据
        if (!value) {
          // 返回时查询之前页码
          this.searchData.startindex = 0;
        }
        this.searchData.fixedcolumns = this.dataProcessing();
        this.getQueryList(this.searchData);
      // this.onSelectionChangedAssignment({ rowIdArray: [], rowArray: [] }); // 查询成功后清除表格选中项
      },
      getQueryList(data) {
        const URL = custommizedRequestUrl()['/p/cs/taskrecord/query'];
        network
          .post(URL || '/p/cs/taskrecord/query', urlSearchParams({ searchdata: data }))
          .then((res) => {
            if (res.data.code === 0) {
              this.datas = res.data.data;
              this.page.pageSize = res.data.data.defaultrange;
              this.page.pageSizeOpts = res.data.data.selectrange;
              this.page.total = res.data.data.totalRowCount;
              this.page.current = res.data.data.start / res.data.data.defaultrange + 1;

            // this.tableDataFormat(res.data.data);
            }
          });
      }, // 请求表格数据
      // eslint-disable-next-line no-dupe-keys
      lowercaseToUppercase(index) {
        // 将字符串转化为大写
        const UppercaseValue = this.formItemsLists[index].item.value
          ? this.formItemsLists[index].item.value.toUpperCase()
          : '';
        this.formItemsLists[index].item.value = UppercaseValue;
        this.formItemsLists = this.formItemsLists.concat([]);
      },
      dataProcessing() {
        // 查询数据处理
        const jsonData = Object.keys(this.formItems).reduce((obj, item) => {
          if (
            this.formItems[item]
            && JSON.stringify(this.formItems[item]).indexOf('bSelect-all') < 0
          ) {
            obj[item] = this.formItems[item];
          }
          return obj;
        }, {});

        return Object.keys(jsonData).reduce((obj, item) => {
          let value = '';

          this.formItemsLists.concat([]).every((temp) => {
            if (temp.item.field === item) {
              // 等于当前节点，判断节点类型
              if (
                temp.item.type === 'DatePicker'
                && (temp.item.props.type === 'datetimerange'
                || temp.item.props.type === 'daterange')
              ) {
                // 当为日期控件时，数据处理
                if (jsonData[item][0] && jsonData[item][1]) {
                  value = jsonData[item].join('~');
                } else {
                  value = '';
                }
                return false;
              }

              if (
                temp.item.type === 'TimePicker'
                && temp.item.props.type === 'timerange'
                && jsonData[item][0]
                && jsonData[item][1]
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
      formDataChange(data, item, index) {
        // 表单数据修改
        if (JSON.stringify(this.formItems) !== JSON.stringify(data)) {
          if (this.formItemsLists.length > 0) {
            this.formItemsLists[index].item.value = item.item.value;
          }

          this.formItems = this.$refs.FormItemComponent.dataProcessing(
            this.formItemsLists
          );
        }
      },
      pageChange(val) {
        this.page.current = val;
        this.searchData.startindex = this.page.pageSize * (val - 1);
        this.searchClickData('1');
      }, // 页码变化
      pageSizeChange(val) {
        this.page.pageSize = val;
        this.searchData.startindex = 0;
        this.searchData.range = val;
        this.searchClickData('1');
      }, // 每页显示条数变化
      editTaskStatus(ID) {
        const URL = custommizedRequestUrl()['/p/cs/taskrecord/read'];

        network.post(URL || '/p/cs/taskrecord/read', { ID }).then((res) => {
          if (res.data.code === 0) {
          // this.$Modal.fcSuccess({
          //   mask: true,
          //   title: "成功",
          //   content: res.data.message
          // });
          }
        });
      },
      onRowDoubleClick(obj, row, e) {
        let type = '';
        if (row.OBJDISTYPE && row.OBJDISTYPE.val === 'object') {
          // 单对象上下结构
          type = 'tableDetailVertical';
        } else if (row.OBJDISTYPE && row.OBJDISTYPE.val === 'tabpanle') {
          // 左右结构
          type = 'tableDetailHorizontal';
        }
        const tab = {
          type,
          tableName: row.AD_TABLE_ID.val,
          tableId: row.AD_TABLE_ID.refobjid,
          // label: "任务记录编辑",
          id: row.OBJ_ID.val
        };
      // this.editTaskStatus(row.ID.val);
      // this.tabOpen(tab);
      }, // 双击行
      onSortChanged(arr) {}, // 排序事件触发回调
      onSelectionChanged(row, select) {}, // 表格行选中事件
      onRowSingleClick(obj, row, e) {}, // 单击行
      customizedDialog(params) {
      // this.$refs.dialogRef.open();
      // this.dialogComponentNameConfig.title = params.column.customerurl.reftabdesc;
      // this.dialogComponentNameConfig.footerHide = true;
      // this.dialogComponentName = params.column.customerurl.tableurl;
      }, // 表格弹框console.log();
      onSingleCellClick(row) {
        this.editTaskStatus(row.ID);
      } // 单击超链接
    },
    created() {
      this.getTableQuery().then(() => {
        this.searchClickData();
      });
    }
  };
</script>
