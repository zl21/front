<template>
  <div class="TableDetailCollection">
    <div class="detail-collection">
      <div class="detail-top">
        <div class="page-buttons">
          <Page
            :total="dataSource.totalRowCount"
            :page-size-opts="dataSource.selectrange"
            class="table-page"
            size="small"
            show-elevator
            show-sizer
            show-total
            @on-change="pageChangeEvent"
            @on-page-size-change="pageSizeChangeEvent"
          />
          <ul
            v-if="!isHorizontal"
            class="detail-buttons"
          >
            <a
              v-for="item in buttonGroups"
              :key="item.name"
              @click="buttonClick(item)"
            >
              【{{ item.name }}】
            </a>
          </ul>
        </div>
        <div
          v-if="filterList.length > 0"
          class="detail-search"
        >
          <Select
            v-model="searchCondition"
            clearable
            placeholder="查询条件"
            @on-clear="searchCondition=null"
          >
            <Option
              v-for="item in filterList"
              :key="item.colname"
              :label="item.name"
              :value="item.isfk ? item.inputname : item.colname"
            >
              {{ item.label }}
            </Option>
          </Select>
          <div class="detail-search-input">
            <Input
              v-model="searchInfo"
              search
              placeholder="请输入查询内容"
              @on-search="getTabelList"
            />
            <Button
              slot="prepend"
              @click="getTabelList"
            >
              搜索
            </Button>
            </Input>
          </div>
        </div>
      </div>
      <div class="table-outside">
        <Table
          ref="selection"
          class="table-in"
          :height="tableHeight? tableHeight :true"
          border
          :columns="columns"
          :data="data"
          :total-data="totalData"
          @on-selection-change="tableSelectedChange"
          @on-sort-change="tableSortChange"
        />
      </div>
      <div
        v-if="isHorizontal"
        class="queryCondition"
      >
        查询条件:{{ dataSource.queryDesc }}
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState, mapMutations, mapActions } from 'vuex';
  import regExp from '../constants/regExp';
  import { Version } from '../constants/global';
  import buttonmap from '../assets/js/buttonmap';
  import Dialog from './ComplexsDialog'; // emit 选中的行

  import router from '../__config__/router.config';

  const {
    fkQueryList, fkFuzzyquerybyak, fkGetMultiQuery, itemTableDelete
  // eslint-disable-next-line import/no-dynamic-require
  } = require(`../__config__/actions/version_${Version}/formHttpRequest/fkHttpRequest.js`);

  const EXCEPT_COLUMN_NAME = 'ID'; // 排除显示列（ID）
  const COLLECTION_INDEX = 'COLLECTION_INDEX'; // 序号
  const pageType = {
    Horizontal: 'horizontal',
    Vertical: 'vertical'
  };
  const TABLE_BEFORE_DATA = 'tableBeforeData'; // emit beforedata
  const TABLE_DATA_CHANGE = 'tableDataChange'; // emit 修改数据
  const TABLE_VERIFY_MESSAGE = 'tableVerifyMessage'; // emit 修改数据
  const TABLE_SELECTED_ROW = 'tableSelectedRow';

  export default {
    name: 'TableDetailCollection',
    components: {

    },
    data() {
      return {
        tableRowSelectedIds: [], // 表格选中的ID
        // columns: [],
        // data: [],
        searchInfo: '', // 输入框搜索内容
        searchCondition: null, // 查询条件
        pageInfo: { // 列表的分页
          currentPageIndex: (this.dataSource.start / this.dataSource.defaultrange) || 1, // 当前页码
          pageSize: this.dataSource.defaultrange || 10 // 显示条数
        },
        fkData: ({ totalRowCount: 0 }), // // 外键下拉选择（drp mrp） 的数据
        fkDropPageInfo: { // 外键下拉选择（drp mrp） 的分页
          currentPageIndex: 1, // 当前页码
          pageSize: 10 // 显示条数
        },
        fkAutoData: [], // 外键关联下拉 模糊搜索数据
        popFilterData: {}, // mop气泡的特殊数据
        popFilterDataList: [{
                              value: '更多筛选',
                              lable: 0
                            },
                            {
                              value: '导入',
                              lable: 2
                            }],
        currentOrderList: [], // 当前排序的内容
        DISPLAY_ENUM: {
          text: { tag: 'Input', event: this.inputRender },
          check: { tag: 'Checkbox', event: this.checkboxRender },
          select: { tag: 'Select', event: this.selectRender },
          drp: { tag: 'DropDownSelectFilter', event: this.dropDownSelectFilterRender },
          mrp: { tag: 'DropDownSelectFilter', event: this.dropDownSelectFilterRender },
          mop: { tag: 'AttachFilter', event: this.attachFilterRender },
          OBJ_DATENUMBER: { tag: 'DatePicker', event: this.datePickertRender },
          OBJ_DATE: { tag: 'DatePicker', event: this.datePickertRender },
          OBJ_TIME: { tag: 'TimePicker', event: this.timePickerRender },
          image: { tag: 'Poptip', event: this.imageRender }
        }, // 标签映射
        beforeSendData: {}, // 之前的数据
        afterSendData: {}, // 改后的数据
      };
    },
    props: {
      dataSource: {
        // 总数据源
        type: Object,
        default: () => ({})
      },
      readonly: {
        // 能否编辑
        type: Boolean,
        default: true
      },
      tableHeight: {
        // 表格高度 默认300px
        type: Number,
        default: 0
      },
      tableName: {
        type: String,
        default: ''
      }, // 表名
      type: {
        type: String,
        default: pageType.Vertical
      },
    },
    computed: {
      ...mapState('global', {
      // collapseHistoryAndFavorite: ({ collapseHistoryAndFavorite }) => collapseHistoryAndFavorite,
      // menuLists: ({ menuLists }) => menuLists
      }),
      filterList() {
        return this.columns.filter(
          ele => ele.name !== EXCEPT_COLUMN_NAME && ele.isfilter
        );
      },
      data() {
        this.filterBeforeData();
        return this.filterData(this.dataSource.row); // 每列的数据
      },
      copyDataSource() {
        return JSON.parse(JSON.stringify(this.dataSource));
      },
      columns() {
        return this.filterColumns(this.dataSource.tabth); // 每列的属性
      },
      isFullRangeSubTotalEnabled() { // 是否显示总计
        return this.dataSource.isFullRangeSubTotalEnabled;
      },
      isSubTotalEnabled() { // 是否显示合计
        return this.dataSource.isSubTotalEnabled;
      },
      totalData() {
        const total = [];
        if (this.isHorizontal) {
          if (this.dataSource.isFullRangeSubTotalEnabled) {
            // 总计
            const cell = {
              COLLECTION_INDEX: '总计',
            };
            if (this.dataSource.fullRangeSubTotalRow) {
              for (const key in this.dataSource.fullRangeSubTotalRow) {
                if (Object.prototype.hasOwnProperty.call(this.dataSource.fullRangeSubTotalRow, key)) {
                  const element = this.dataSource.fullRangeSubTotalRow[key];
                  cell[key] = element.val;
                }
              }
            }
            total.push(cell);
          }
          if (this.dataSource.isSubTotalEnabled) {
            const cell = {
              COLLECTION_INDEX: '合计'
            };
            const needSubtotalList = this.columns.filter(ele => ele.issubtotal);
            needSubtotalList.map((ele) => {
              const needSubtotalDatas = [];
              this.data.reduce((a, c) => needSubtotalDatas.push(c[ele.colname]), []); //
              const totalNumber = needSubtotalDatas.reduce((a, c) => Number(a) + Number(c), []);
              cell[ele.colname] = `${totalNumber}`;
              return ele;
            });
            total.push(cell);
          }
        }
        return total;
      },
      isHorizontal() { // 是否是左右结构
        return this.type === pageType.Horizontal;
      },
      buttonGroups() { // 按钮组的数据组合
        const { tabcmd } = this.tabPanel[this.tabCurrentIndex].componentAttribute.buttonsData.data;
        if (!tabcmd) {
          return [];
        }
        const buttonGroupShow = [];
        if (tabcmd.cmds) {
          tabcmd.cmds.map((item, index) => {
            if (tabcmd.prem[index]) {
              const type = item.split('action');
              const str = `CMD_${type[1].toUpperCase()}`;
              if (str !== 'CMD_MODIFY') { // 保存不显示
                let buttonConfigInfo = buttonmap[str];
                if (str === 'CMD_DELETE') { // 删除 -> 删除明细
                  buttonConfigInfo = buttonmap.CMD_REF_DELETE;
                }
                if (tabcmd.paths) {
                  buttonConfigInfo.requestUrlPath = tabcmd.paths[index];
                }
                buttonConfigInfo.eName = item;
                buttonGroupShow.push(
                  buttonConfigInfo
                );
              }
            }
            return item;
          });
        }
        buttonGroupShow.push(buttonmap.CMD_EXPORT_LIST); // 默认有导出
        return buttonGroupShow;
      },
      isMainTableReadonly() {
        if (this.type === pageType.Vertical) {
          if (this.mainFormInfo.buttonsData) {
            return this.mainFormInfo.buttonsData.data.objreadonly;
          }
        }
        return false;
      },


    },
    watch: {
      beforeSendData(val) {
        this.$emit(TABLE_BEFORE_DATA, val);
      }
    },
    methods: {

      //   ...mapMutations('global', ['doCollapseHistoryAndFavorite']),
      //   ...mapActions('global', ['getMenuLists']),

      buttonClick(obj) {
        switch (obj.eName) {
        case 'actionEXPORT': // 导出
          this.objectEXPORT();
          break;
        case 'actionDELETE': // 删除
          this.objectTryDelete(obj);
          break;
        default:
          break;
        }
      },
      objectTryDelete(obj) { // 按钮删除方法
        // console.log('🍓', this.type);
        if (this.type === 'vertical') {
          this.mainFormInfo.buttonsData.data.tabcmd.map((item, index) => {
            // item[index]=
          });
        } else {
          const { tableName, itemId } = router.currentRoute.params;
          const params = {
            delMTable: false,
            objId: itemId,
            tabItem: { DL_B_PUR_ITEM: this.tableRowSelectedIds },
            table: tableName
          };
        
          itemTableDelete({
            params,
            success: (res) => {
              const deleteMessage = res.data.message;
              this.$Message.success(`删除${deleteMessage}`);
            } 
          });
        }
      },
      filterColumns(data) {
        if (!data) {
          return [];
        }
        // 整合表头数据
        const columns = data
          .filter(ele => ele.name !== EXCEPT_COLUMN_NAME)
          .map((ele) => {
            const param = {
              title: ele.name,
              key: ele.colname
            };
            if (ele.isorder) {
              param.sortable = 'custom';
            }
            if (this.dataSource.ordids && this.dataSource.ordids.length > 0) {
              this.dataSource.ordids.map((order) => {
                if (ele.colname === order.colname) {
                  param.sortType = order.ordasc ? 'asc' : 'desc';
                }
                return order;
              });
            }
            const item = Object.assign(ele, param);
            return item;
          });
        const renderColumns = this.renderData(columns);
        // 复选框 + 序号
        const headColumn = [
          {
            type: 'selection',
            width: 40,
            align: 'center'
          },
          {
            title: '序号',
            width: 60,
            key: COLLECTION_INDEX
          }
        ];
        return headColumn.concat(renderColumns);
      },
      filterData(rows) {
        if (!rows) {
          return [];
        }
        // 整合数据源
        const data = rows.map((ele, index) => {
          const item = {
            COLLECTION_INDEX: Number(this.dataSource.start) + index + 1
          };
          for (const key in ele) {
            if (Object.prototype.hasOwnProperty.call(ele, key)) {
              item[key] = ele[key].val;
            }
          }
          return item;
        });
        return data;
      },
      filterBeforeData() {
        // 组装beforeData
        if ((!this.dataSource.row || this.dataSource.row.length === 0) && !this.beforeSendData[this.tableName]) {
          return;
        }
        const copyDataSoucre = this.deepClone(this.dataSource);
        const beforeData = {};
        beforeData[this.tableName] = [];
        copyDataSoucre.row.map((ele) => {
          const param = {
            EXCEPT_COLUMN_NAME: ele[EXCEPT_COLUMN_NAME].val
          };
          const tabth = copyDataSoucre.tabth.filter(item => item.colname !== EXCEPT_COLUMN_NAME);
          tabth.map((tab) => {
            let val = ele[tab.colname].val;
            switch (tab.display) {
            case 'check':
              {
                const currentCheck = tab.combobox.filter(box => box.limitdesc === ele[tab.colname].val);
                const limitval = currentCheck.length > 0 ? currentCheck[0].limitval : null;
                val = limitval;
              }
              break;
            case 'OBJ_DATENUMBER':
              val = ele[tab.colname].val.replace(/\-/g, '');
              break;
            default:
              break;
            }
            if (tab.isfk) {
              switch (tab.fkdisplay) {
              case 'drp':
                val = ele[tab.colname].refobjid;
                break;
              case 'mrp':
                val = ele[tab.colname].refobjid; // mrp快鱼之前是存的val
                break;
              case 'mop':
                val = ele[tab.colname].refobjid;
                break;
              default:
                break;
              }
            }
            param[tab.colname] = val;
            return tab;
          });
          beforeData[this.tableName].push(param);
          return ele;
        });
        this.beforeSendData = beforeData;
      },
      renderData(columns) {
        const renderColumns = columns.map((ele, index) => {
          ele.render = this.collectionCellRender(ele, index);
          return ele;
        });
        return renderColumns;
      },
      collectionCellRender(cellData, index) {
        // 给cell赋render
        if (!cellData.ismodify || this.readonly || this.isMainTableReadonly) {
          // 不可编辑状态 显示label
          if (cellData.isfk) {
            // 如果是外键关联 显示 别针icon
            return this.fkIconRender(cellData);
          }
          if (cellData.display === 'image') {
            // 不可编辑话 图片也是能照常render出来的
            return this.imageRender(cellData, this.DISPLAY_ENUM[cellData.display].tag);
          }
          return null;
        }
        if (cellData.isfk && cellData.fkdisplay) {
          if (!this.DISPLAY_ENUM[cellData.fkdisplay]) {
            return null;
          }
          return this.DISPLAY_ENUM[cellData.fkdisplay].event(cellData, this.DISPLAY_ENUM[cellData.fkdisplay].tag);
        }
        if (!this.DISPLAY_ENUM[cellData.display]) {
          return null;
        }
        return this.DISPLAY_ENUM[cellData.display].event(cellData, this.DISPLAY_ENUM[cellData.display].tag);
      },
      inputRender(cellData, tag) {
        // 输入框
        return (h, params) => h('div', [
          h(tag, {
            style: {
              width: '100px'
            },
            props: {
              value: params.row[cellData.colname],
              regx: this.inputRegx(cellData),
              maxlength: cellData.length
            },
            nativeOn: {
              click: (e) => {
                e.stopPropagation();
              }
            },
            on: {
              'on-change': (event, data) => {
                this.putDataFromCell(event.target.value, data.value, cellData.colname, this.dataSource.row[params.index][EXCEPT_COLUMN_NAME].val);
              }
              // 'on-focus': (event) => {
              //   event.stopPropagation();
              //   event.preventDefault();
              // }
            }
          })
        ]);
      },
      checkboxRender(cellData, tag) {
        // 复选框
        return (h, params) => h('div', [
          h(tag, {
            style: {
              width: '40px'
            },
            props: {
              value: cellData.combobox.filter(
                ele => ele.limitdesc === params.row[cellData.colname]
              ).length > 0 ? cellData.combobox.filter(
                ele => ele.limitdesc === params.row[cellData.colname]
              )[0].limitdis : null
            },
            nativeOn: {
              click: (e) => {
                e.stopPropagation();
              }
            },
            on: {
              'on-change': (currentValue, data) => {
                const currentCheck = cellData.combobox.filter(ele => ele.limitdis === currentValue);
                const limitval = currentCheck.length > 0 ? currentCheck[0].limitval : null;

                const oldcurrentCheck = cellData.combobox.filter(ele => ele.limitdis === data.value);
                const oldLimitval = oldcurrentCheck.length > 0 ? oldcurrentCheck[0].limitval : null;

                this.putDataFromCell(limitval, oldLimitval, cellData.colname, this.dataSource.row[params.index][EXCEPT_COLUMN_NAME].val);
              }
            }
          })
        ]);
      },
      selectRender(cellData, tag) {
        // 下拉框
        return (h, params) => h('div', [
          h(tag, {
              style: {
                width: '100px'
              },
              props: {
                transfer: true,
                value: this.getSelectValue(params, cellData)
              },
              nativeOn: {
                click: (e) => {
                  e.stopPropagation();
                }
              },
              on: {
                'on-change': (event, data) => {
                  this.putDataFromCell(event, data.value, cellData.colname, this.dataSource.row[params.index][EXCEPT_COLUMN_NAME].val);
                }
              }
            },
            this.getSelectValueCombobox(h, cellData))
        ]);
      },

      dropDownSelectFilterRender(cellData, tag) { // 外键关联下拉选择(drp mrp)
        return (h, params) => h('div', [
          h(tag, {
            style: {
              width: '100px'
            },
            props: {
              defaultSelected: this.dropDefaultSelectedData(params, cellData),
              single: cellData.fkdisplay === 'drp',
              pageSize: this.fkDropPageInfo.pageSize,
              totalRowCount: this.fkData.totalRowCount,
              data: this.fkData,
              transfer: true,
              AutoData: this.fkAutoData,
              hidecolumns: ['id', 'value']
            },
            // nativeOn: {
            //   click: (e) => {
            //     e.stopPropagation();
            //   }
            // },
            on: {
              'on-popper-show': () => {
                this.fkDropPageInfo.currentPageIndex = 1;
                this.fkAutoData = [];
                this.getFKList(params, cellData);
              },
              'on-page-change': (value) => {
                // debugger;
                this.fkDropPageInfo.currentPageIndex = value;
                this.getFKList(params, cellData);
              },
              'on-input-value-change': (data, value) => {
                if (!value.inputValue) {
                  value.transferDefaultSelected = [];
                }
                this.fkAutoData = [];
                fkFuzzyquerybyak({
                  searchObject: {
                    ak: data,
                    colid: this.dataSource.row[params.index][cellData.colname].colid,
                    fixedcolumns: {
                      whereKeys: this.getMainRefobjid(params, cellData)
                    }
                  },
                  success: (res) => {
                    this.fkAutoData = res.data.data;
                    const autoData = this.fkAutoData.filter(ele => (value.inputValue && ele.value.toUpperCase().indexOf(value.inputValue.toUpperCase()) > -1));
                    if (autoData.length === 0) {
                      // autodata中没有 清空输入框
                      value.notAutoData = true;
                    } else {
                      delete value.notAutoData;
                    }
                  }
                });
              },
              'on-blur': (event, value) => {
                if (value.notAutoData) {
                  // autodata中没有 清空输入框 及上次选中的值
                  value.inputValue = '';
                  delete value.notAutoData;
                } else if (this.fkAutoData.length > 0) {
                  // 当选择模糊搜索结果的时候
                  const autoData = this.fkAutoData.filter(ele => (value.inputValue && ele.value.toUpperCase().indexOf(value.inputValue.toUpperCase()) > -1));
                  value.inputValue = autoData[0].value;
                  value.transferDefaultSelected = [{
                    ID: autoData[0].id,
                    Label: autoData[0].value
                  }];
                }
                this.fkAutoData = [];
                let ids = null;
                if (value.transferDefaultSelected.length > 0) {
                  ids = value.transferDefaultSelected.reduce((acc, cur) => (typeof acc !== 'object' ? `${acc},${cur.ID}` : cur.ID), []);
                }
                this.putDataFromCell(ids, value.defaultSelected && value.defaultSelected.length > 0 ? value.defaultSelected[0].ID : null, cellData.colname, this.dataSource.row[params.index][EXCEPT_COLUMN_NAME].val);
              },
              'on-fkrp-selected': (data, value) => {
                this.fkAutoData = [];
                let ids = null;
                if (value.transferDefaultSelected.length > 0) {
                  ids = value.transferDefaultSelected.reduce((acc, cur) => (typeof acc !== 'object' ? `${acc},${cur.ID}` : cur.ID), []);
                }
                this.putDataFromCell(ids, value.defaultSelected && value.defaultSelected.length > 0 ? value.defaultSelected[0].ID : null, cellData.colname, this.dataSource.row[params.index][EXCEPT_COLUMN_NAME].val);
              },
              'on-clear': (value) => {
                this.fkAutoData = [];
                this.putDataFromCell(null, value.defaultSelected && value.defaultSelected.length > 0 ? value.defaultSelected[0].ID : null, cellData.colname, this.dataSource.row[params.index][EXCEPT_COLUMN_NAME].val);
              }
            }
          })
        ]);
      },
      attachFilterRender(cellData, tag) {
        return (h, params) => h('div', [
          h(tag, {
            style: {
              width: '130px'
            },
            props: {
              value: this.copyDataSource.row[params.index][cellData.colname].val,
              // Selected: typeof this.copyDataSource.row[params.index][cellData.colname].refobjid === 'string' ? this.dataSource.row[params.index][cellData.colname].refobjid.split(',') : [this.dataSource.row[params.index][cellData.colname].refobjid], // 组件暂无该props
              optionTip: true,
              // 是否显示输入完成后是否禁用 true、false
              show: true,
              // 是否显示筛选提示弹窗 true、false
              filterTip: true,
              // 是否选中后禁止编辑 true、false
              disabled: false,
              // 默认提示框
              placeholder: null,
              // 定义选中展示的文字的key
              hideColumnsKey: ['id'],
              // 配置弹窗的配置项 model
              dialog: {
                model: {
                  title: '弹窗多选',
                  mask: true,
                  draggable: true,
                  scrollable: true
                }
              },
              datalist: this.popFilterDataList,
              ...cellData,
              // 模糊查询的文字信息，支持多列
              AuotData: this.fkAutoData
            },
            nativeOn: {
              click: (e) => {
                e.stopPropagation();
              }
            },
            // scopedSlots: {
            //   daigo: props => h('div', [
            //     h(Dialog, {
            //       props: {
            //         fkobj: {
            //           refobjid: cellData.refobjid,
            //           reftable: cellData.reftable,
            //           reftableid: cellData.reftableid
            //         },
            //         filter: this.popFilterData
            //       }
            //     })
            //   ])
            // },
            on: {
              'on-show': (value, item) => { // 当气泡拉展开时去请求数据
                console.log(item);
                this.popFilterDataList = [{
                                            value: '更多筛选',
                                            lable: 0
                                          },
                                          {
                                            value: '导入',
                                            lable: 2
                                          }];
                fkGetMultiQuery({
                  searchObject: {
                    tableid: cellData.reftableid
                  },
                  success: (res) => {
                    this.freshDropDownPopFilterData(res, cellData);
                  }
                });
                this.copyDataSource.row[params.index][cellData.colname].inputComponent = item;
              },
              'on-ok': ($this) => {
                if ($this._data.IN.length > 0) {
                  const value = `已经选中${$this._data.IN.length}条数据`;
                  this.copyDataSource.row[params.index][cellData.colname].val = value;
                  this.copyDataSource.row[params.index][cellData.colname].Selected = $this._data.IN;
                  this.copyDataSource.row[params.index][cellData.colname].inputComponent.InputVale = value;
                } else {
                  this.copyDataSource.row[params.index][cellData.colname].val = '';
                  this.copyDataSource.row[params.index][cellData.colname].Selected = [];
                }
                let ids = null;
                if (this.copyDataSource.row[params.index][cellData.colname].Selected && this.copyDataSource.row[params.index][cellData.colname].Selected.length > 0) {
                  ids = this.copyDataSource.row[params.index][cellData.colname].Selected.reduce((acc, cur) => (typeof acc !== 'object' ? `${acc},${cur}` : cur), []);
                }
                this.putDataFromCell(ids, params.row[cellData.colname], cellData.colname, this.dataSource.row[params.index][EXCEPT_COLUMN_NAME].val);
              },
              'on-clear': (a, b, $this) => {
                this.copyDataSource.row[params.index][cellData.colname].val = '';
                this.copyDataSource.row[params.index][cellData.colname].Selected = [];
                this.putDataFromCell(null, params.row[cellData.colname], cellData.colname, this.dataSource.row[params.index][EXCEPT_COLUMN_NAME].val);
              },
              'on-popclick': (event, row, targName, $this) => {
                if (targName !== 'I' && event !== 1) {
                  // 打开弹窗
                  $this.showModal = true;
                  if (event !== 0) {
                    this.popFilterData = JSON.parse(row.label);
                  }
                }
              },
              'on-change': (data, data2, value) => {
                this.fkAutoData = [];
                if (!data) {
                  this.copyDataSource.row[params.index][cellData.colname].val = '';
                  this.copyDataSource.row[params.index][cellData.colname].Selected = [];
                  return;
                }
                fkFuzzyquerybyak({
                  searchObject: {
                    ak: data,
                    colid: this.copyDataSource.row[params.index][cellData.colname].colid,
                    fixedcolumns: {
                      whereKeys: this.getMainRefobjid(params, cellData)
                    }
                  },
                  success: (res) => {
                    this.fkAutoData = res.data.data;
                    const autoData = this.fkAutoData.filter(ele => (data && ele.value.toUpperCase().indexOf(data.toUpperCase()) > -1));
                    if (autoData.length === 0) {
                      // autodata中没有 清空输入框
                      value.notAutoData = true;
                    } else {
                      delete value.notAutoData;
                    }
                  }
                });
              },
              'on-blur': (data, event, value) => {
                if (value.notAutoData) {
                  // autodata中没有 清空输入框 及上次选中的值
                  value.InputVale = '';
                  delete value.notAutoData;
                } else if (this.fkAutoData.length > 0) {
                  // 当选择模糊搜索结果的时候
                  const autoData = this.fkAutoData.filter(ele => (data && ele.value.toUpperCase().indexOf(data.toUpperCase()) > -1));
                  this.copyDataSource.row[params.index][cellData.colname].val = autoData[0].value;
                  this.copyDataSource.row[params.index][cellData.colname].Selected = [autoData[0].id];
                }
                this.fkAutoData = [];
                let ids = null;
                if (this.copyDataSource.row[params.index][cellData.colname].Selected && this.copyDataSource.row[params.index][cellData.colname].Selected.length > 0) {
                  ids = this.copyDataSource.row[params.index][cellData.colname].Selected.reduce((acc, cur) => (typeof acc !== 'object' ? `${acc},${cur}` : cur), []);
                }
                this.putDataFromCell(ids, params.row[cellData.colname], cellData.colname, this.dataSource.row[params.index][EXCEPT_COLUMN_NAME].val);
              },
              'on-select': (data, value) => {
                this.fkAutoData = [];
                this.copyDataSource.row[params.index][cellData.colname].val = data.label;
                this.copyDataSource.row[params.index][cellData.colname].Selected = [data.value];
                this.putDataFromCell(data.value, params.row[cellData.colname], cellData.colname, this.dataSource.row[params.index][EXCEPT_COLUMN_NAME].val);
              }
            }
          }, [
            h('div', {
                slot: 'daigo',
              },
              [
                h(Dialog, {
                  props: {
                    fkobj: {
                      refobjid: cellData.refobjid,
                      reftable: cellData.reftable,
                      reftableid: cellData.reftableid
                    },
                    filter: this.popFilterData
                  }
                })
              ]),
          ])
        ]);
      },
      datePickertRender(cellData, tag) { // 日期选择
        return (h, params) => h('div', [
          h(tag, {
            style: {
              width: cellData.display === 'OBJ_DATENUMBER' ? '110px' : '160px'
            },
            props: {
              value: params.row[cellData.colname],
              type: cellData.display === 'OBJ_DATENUMBER' ? 'date' : 'datetime',
              transfer: true
            },
            nativeOn: {
              click: (e) => {
                e.stopPropagation();
              }
            },
            on: {
              'on-change': (event, dateType, data) => {
                let value = event;
                if (cellData.display === 'OBJ_DATENUMBER') {
                  //  YYYYmmdd
                  if (value) {
                    value = value.replace(/\-/g, '');
                  }
                }
                this.putDataFromCell(value, data.value, cellData.colname, this.dataSource.row[params.index][EXCEPT_COLUMN_NAME].val);
              }
            }
          })
        ]);
      },
      timePickerRender(cellData, tag) { // 时间选择
        return (h, params) => h('div', [
          h(tag, {
            style: {
              width: '100px'
            },
            props: {
              value: params.row[cellData.colname],
              type: 'time',
              // value: new Date(Date.parse(`${new Date().getFullYear()} - ${params.row[cellData.colname]}`.replace(/-/g, '/'))),
              transfer: true
            },
            nativeOn: {
              click: (e) => {
                e.stopPropagation();
              }
            },
            on: {
              'on-change': (event, dateType, data) => {
                this.putDataFromCell(event, data.value, cellData.colname, this.dataSource.row[params.index][EXCEPT_COLUMN_NAME].val);
              }
            }
          })
        ]);
      },
      fkIconRender(cellData) {
        // 外键关联到icon
        return (h, params) => h('div', {
          domProps: {
            innerHTML: `<i class="iconfont" data-target-tag="fkIcon" style="color: #0f8ee9; cursor: pointer; font-size: 12px" >&#xe625;</i>${params.row[cellData.colname]}`
          },
          on: {
            click: (event) => {
              // TODO 外键关联跳转
              event.stopPropagation();
            }
          }
        });
      },
      imageRender(cellData, tag) {
        return (h, params) => {
          if (!params.row[cellData.colname]) {
            return null;
          }
          return h('div', [
            h(tag, {
              style: {
                width: '40px'
              },
              props: {
                trigger: 'hover',
                transfer: true,
                content: 'content'
              },
              scopedSlots: {
                default: () => h('img', {
                  style: {
                    height: '20px'
                  },
                  domProps: {
                    src: params.row[cellData.colname] && this.isJsonString(params.row[cellData.colname]) ? JSON.parse(params.row[cellData.colname])[0].URL : params.row[cellData.colname]
                  }
                }),
                content: () => h('img', {
                  style: {
                    width: '150px',
                    'vertical-align': 'middle',
                    padding: '8px 0px'
                  },
                  domProps: {
                    src: params.row[cellData.colname] && this.isJsonString(params.row[cellData.colname]) ? JSON.parse(params.row[cellData.colname])[0].URL : params.row[cellData.colname]
                  }
                }),
              },
              nativeOn: {
                click: (e) => {
                  e.stopPropagation();
                }
              },
              // on: {
              //   'on-change': (event, dateType, data) => {
              //     this.putDataFromCell(event, data.value, cellData.colname, this.dataSource.row[params.index][EXCEPT_COLUMN_NAME].val);
              //   }
              // }
            })
          ]);
        };
      },
      dropDefaultSelectedData(params, cellData) {
        // drp mrp 初始数据赋值
        const defaultData = [];
        if (cellData.fkdisplay === 'drp') {
          if (this.dataSource.row[params.index][cellData.colname]) {
            const data = {
              ID: this.dataSource.row[params.index][cellData.colname].refobjid,
              Label: params.row[cellData.colname]
            };
            defaultData.push(data);
          }
        } else if (this.dataSource.row[params.index][cellData.colname]) {
          let ids = [];
          const refobjid = this.dataSource.row[params.index][cellData.colname].refobjid;
          const val = this.dataSource.row[params.index][cellData.colname].val;
          if (typeof refobjid === 'string') {
            ids = refobjid.split(',');
          }
          if (ids.length > 0) {
            ids.map((ele, index) => {
              val.split(',').map((item, ind) => {
                if (index === ind) {
                  defaultData.push({
                    ID: ele,
                    Label: item
                  });
                }
                return item;
              });
              return ele;
            });
          }
        }
        return defaultData;
      },
      freshDropDownPopFilterData(res, cellData) {
        // mop 气泡点击事件
        if (res.length > 0) {
          res.forEach((item) => {
            item.label = item.value;
            item.value = item.key;
            item.delete = true;
          });
          // let item = [];
          // if (cellData.formIndex !== 'inpubobj') {
          //   item = this.$refs[`FormComponent_${cellData.formIndex}`][0].newFormItemLists;
          // } else {
          //   item = this.$refs[`FormComponent_0`].newFormItemLists;
          // }
          this.popFilterDataList = this.popFilterDataList.concat(res);
        }
      },
      tableSelectedChange(data) {
        const param = {};
        const datas = data.reduce((acc, cur) => {
          acc.push({ ID: cur[EXCEPT_COLUMN_NAME] });
          return acc;
        }, []);
        this.tableRowSelectedIds = datas;
        param[this.tableName] = datas;

        this.$emit(TABLE_SELECTED_ROW, param);
      },
      inputRegx(cellData) {
        // 输入框正则
        if (cellData.type === 'NUMBER' && cellData.scale && cellData.scale > 0) {
          return new RegExp(`^[\\-\\+]?\\d+(\\.[0-9]{0,${cellData.scale}})?$`);
        } if (cellData.type === 'NUMBER') {
          return new RegExp('^[\\-\\+]?\\d+(\\.[0-9]{0,2)?$');
        } if (cellData.type === 'STRING' && cellData.isuppercase) { // 大写
          return regExp.Capital;
        }
        return null;
      },
      putDataFromCell(currentValue, oldValue, colname, IDValue) {
        // 组装数据 存入store
        if (this.afterSendData[this.tableName]) {
          const rowDatas = this.afterSendData[this.tableName].filter(ele => ele[EXCEPT_COLUMN_NAME] === IDValue);
          if (rowDatas.length > 0) {
            rowDatas[0][colname] = currentValue;
          } else {
            const param = {};
            param[EXCEPT_COLUMN_NAME] = IDValue;
            param[colname] = currentValue;
            this.afterSendData[this.tableName].push(param);
          }
        } else {
          this.afterSendData[this.tableName] = [];
          const param = {};
          param[EXCEPT_COLUMN_NAME] = IDValue;
          param[colname] = currentValue;
          this.afterSendData[this.tableName].push(param);
        }
        // console.log(currentValue, oldValue);
        // if (this.beforeSendData[this.tableName]) {
        //   const rowDatas = this.beforeSendData[this.tableName].filter(ele => ele[EXCEPT_COLUMN_NAME] === IDValue);
        //   if (rowDatas.length > 0) {
        //     rowDatas[0][colname] = oldValue;
        //   } else {
        //     const param = {};
        //     param[EXCEPT_COLUMN_NAME] = IDValue;
        //     param[colname] = oldValue;
        //     this.beforeSendData[this.tableName].push(param);
        //   }
        // } else {
        //   this.beforeSendData[this.tableName] = [];
        //   const param = {};
        //   param[EXCEPT_COLUMN_NAME] = IDValue;
        //   param[colname] = oldValue;
        //   this.beforeSendData[this.tableName].push(param);
        // }
        this.$emit(TABLE_DATA_CHANGE, this.afterSendData);
        // 表单验证
        this.verifyMessage();
      },
      getTabelList() {
        // 搜索事件
        const fixedcolumns = {};
        if (this.searchCondition) {
          fixedcolumns[this.searchCondition] = this.searchInfo;
        }
        const { itemId } = this.$route.params;
        // table, objid, refcolid, startindex, range, fixedcolumns
        const params = {
          table: this.tableName,
          objid: itemId,
          refcolid: this.tabPanel[this.tabCurrentIndex].refcolid,
          searchdata: {
            column_include_uicontroller: true,
            startindex: (Number(this.pageInfo.currentPageIndex) - 1) * Number(this.pageInfo.pageSize),
            range: this.pageInfo.pageSize,
            fixedcolumns
          }
        };
        this.getObjectTableItemForTableData(params);
        this.searchInfo = '';
      },
      getFKList(params, cellData) {
        // 获取外键关联的数据  TODO 2019/4/23 发现点击分页弹框自动消失，必须要注释初始化数据的代码才不会关闭弹框
        // this.fkData.totalRowCount = 0;
        // this.fkData = ({});
        const searchdata = {
          isdroplistsearch: true,
          refcolid: this.dataSource.row[params.index][cellData.colname].colid, // TODO
          fixedcolumns: this.getMainRefobjid(params, cellData),
          startindex: (this.fkDropPageInfo.currentPageIndex - 1) * this.fkDropPageInfo.pageSize,
          range: this.fkDropPageInfo.pageSize
        };
        fkQueryList({
          searchObject: searchdata,
          success: (res) => {
            this.fkData = res.data.data;
          }
        });
      },
      getMainRefobjid(params, cellData) {
        // 外键关联的情况下 取行colid
        const fixedcolumns = {};
        const row = this.dataSource.row[params.index][cellData.colname];
        if (cellData.refcolval) {
          if (this.type === pageType.Horizontal) {
            // 左右结构取行内的colid
            fixedcolumns[cellData.refcolval.fixcolumn] = row.colid;
          } else {
            // 先判断主表是否有关联字段  没有则取行的colid
            const express = cellData.refcolval.expre === 'equal' ? '=' : '';
            if (cellData.refcolval.maintable) {
              // 需要从主表取
              const mainTablePanelData = this.$store.state[this.moduleComponentName].updateData[this.mainFormInfo.tablename];
              const defaultValue = mainTablePanelData.default;
              const modifyValue = mainTablePanelData.modify;
              // 先从修改里找 如果修改的里面没有 就从默认值里取
              if (modifyValue[cellData.refcolval.srccol] && modifyValue[cellData.refcolval.srccol].length > 0) {
                const colname = modifyValue[this.mainFormInfo.tablename][cellData.refcolval.srccol];
                if (colname) {
                  fixedcolumns[cellData.refcolval.fixcolumn] = `${express}${colname}`;
                }
              } else {
                // 默认值取
                const colname = defaultValue[this.mainFormInfo.tablename][cellData.refcolval.srccol];
                if (colname) {
                  fixedcolumns[cellData.refcolval.fixcolumn] = `${express}${colname}`;
                }
              }
              const colname = mainTablePanelData[cellData.refcolval.srccol];
              if (colname && mainTablePanelData.isfk) {
                fixedcolumns[cellData.refcolval.fixcolumn] = `${express}${mainTablePanelData.refobjid}`;
              }
            } else {
              fixedcolumns[cellData.refcolval.fixcolumn] = `${express}${row.refobjid}`;
            }
          }
        }
        return fixedcolumns;
      },
      verifyMessage() {
        // 表单验证
        const verifyData = [];
        const data = this.afterSendData[this.tableName];
        data.map((ele) => {
          Reflect.ownKeys(ele).forEach((key) => {
            const value = ele[key];
            if (value === null || value === undefined || value === '') {
              const titleArray = this.dataSource.tabth.filter(col => col.colname === key && col.isnotnull && col.colname !== EXCEPT_COLUMN_NAME);
              if (titleArray.length > 0) {
                verifyData.push(`请输入${titleArray[0].name}`);
              }
            }
          });
          return ele;
        });
        this.$emit(TABLE_VERIFY_MESSAGE, verifyData);
      },
      tableSortChange(value) {
        const tableName = this.tableName;
        let flag = this.currentOrderList.some((ele) => {
          if (`${tableName}.${value.key}` === ele.column) {
            ele.asc = value.order === 'asc';
            return true;
          }
        });
        if (value.order === 'normal') {
          this.currentOrderList = this.currentOrderList.filter(ele => `${tableName}.${value.key}` !== ele.column);
          flag = true;
        }
        if (!flag) {
          this.currentOrderList.push({
            column: `${tableName}.${value.key}`,
            asc: value.order === 'asc'
          });
        }
        const fixedcolumns = {};
        if (this.searchCondition) {
          fixedcolumns[this.searchCondition] = this.searchInfo;
        }
        const { itemId } = this.$route.params;
        // table, objid, refcolid, startindex, range, fixedcolumns
        const params = {
          table: this.tableName,
          objid: itemId,
          refcolid: this.tabPanel[this.tabCurrentIndex].refcolid,
          searchdata: {
            column_include_uicontroller: true,
            startindex: (Number(this.pageInfo.currentPageIndex) - 1) * Number(this.pageInfo.pageSize),
            range: this.pageInfo.pageSize,
            fixedcolumns
          }
        };
        if (this.currentOrderList.length > 0) {
          // 如果没有排序则不传该参数
          params.searchdata.orderby = this.currentOrderList;
        }
        this.getObjectTableItemForTableData(params);
      },
      pageChangeEvent(index) {
        // 分页 页码改变的回调
        if (index === this.pageInfo.currentPageIndex) {
          return;
        }
        this.pageInfo.currentPageIndex = index;
        this.getTabelList();
      },
      pageSizeChangeEvent(index) {
        // 分页 切换每页条数时的回调
        if (index === this.pageInfo.pageSize) {
          return;
        }
        this.pageInfo.pageSize = index;
        this.getTabelList();
      },
      isJsonString(str) {
        if (typeof JSON.parse(str) === 'object') {
          return true;
        }
        return false;
      },
      // 深拷贝
      deepClone(source) {
        if (!source || typeof source !== 'object') {
          return source;
        }
        const targetObj = source.constructor === Array ? [] : {};
        for (const keys in source) {
          if (Object.prototype.hasOwnProperty.call(source, keys)) {
            if (source[keys] && typeof source[keys] === 'object') {
              targetObj[keys] = source[keys].constructor === Array ? [] : {};
              targetObj[keys] = this.deepClone(source[keys]);
            } else {
              targetObj[keys] = source[keys];
            }
          }
        }
        return targetObj;
      },
      getSelectValueCombobox(h, cellData) { // 做SelectValueCombobox 判空处理
        if (cellData.combobox) {
          return cellData.combobox.map(item => h('Option', {
            props: {
              value: item.limitval,
              label: item.limitdesc
            }
          }));
        }
        return [];
      },
      getSelectValue(params, cellData) { // 做SelectValueCombobox 判空处理
        if (cellData.combobox) {
          return params.row[cellData.colname]
            ? cellData.combobox.filter(
              ele => ele.limitdesc === params.row[cellData.colname]
            )[0].limitval
            : null;
        } 
        return null;
      }
       
    },
    mounted() {
    },
  };
</script>

<style scoped lang="less">
.TableDetailCollection {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: hidden;
  margin: 10px 5px 10px 5px;
  .detail-collection {
    display: flex;
    flex: 1;
    flex-direction: column;
    overflow-y: hidden;
    .detail-top {
      margin-bottom: 6px;
      display: flex;
      justify-content: space-between;
      .page-buttons {
        display: flex;
        flex-wrap: wrap;
      }
      .table-page {
        white-space: nowrap;
      }
      .detail-buttons {
        margin-left: 10px;
        a {
          line-height: 26px;
          vertical-align: middle;
        }
      }
      .detail-search {
        display: inline-block;
        display: flex;
        // justify-content: space-around;
        // align-content: stretch;
        .burgeon-select {
          width: 120px;
        }
        .detail-search-input {
          margin-left: 10px;
          .burgeon-input-group-with-prepend {
            width: 190px;
          }
          .burgeon-input-group-prepend {
            .burgeon-btn {
              display: flex;
              align-items: center;
              span {
                bottom: 2px;
                position: relative;
              }
            }
          }
        }
      }
    }
    .table-outside {
      flex: 1;
      overflow-y: hidden;
      display: flex;
      .table-in {
        flex: 1;
      }
    }
    .queryCondition {
      margin-top: 5px;
    }
  }
}
</style>
