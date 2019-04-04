<template>
  <div class="TableDetailCollection">
    <div class="detail-collection">
      <div class="detail-top">
        <div class="page-buttons">
          <Page
            :total="dataSource.totalRowCount"
            :page-size-opts="dataSource.selectrange"
            size="small"
            show-elevator
            show-sizer
            show-total
            @on-change="pageChangeEvent"
            @on-page-size-change="pageSizeChangeEvent"
          />
          <ul class="detail-buttons">
            <a
              v-for="item in buttonGroups"
              :key="item.name"
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
            >
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
          :height="tableHeight"
          border
          :columns="columns"
          :data="data"
          :total-data="totalData"
        />
        <span v-if="isHorizontal">查询条件:{{ dataSource.queryDesc }}</span>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState, mapMutations, mapActions } from 'vuex';
  import { Capital } from '../constants/regExp';
  import {
    fkQueryList, fkFuzzyquerybyak, fkGetMultiQuery, fkDelMultiQuery
  } from '../constants/fkHttpRequest';
  import buttonmap from '../assets/js/buttonmap';

  const EXCEPT_COLUMN_NAME = 'ID'; // 排除显示列（ID）
  const COLLECTION_INDEX = 'COLLECTION_INDEX'; // 序号
  const pageType = {
    Horizontal: 'horizontal',
    Vertical: 'vertical'
  };
  

  export default {
    name: 'TableDetailCollection',
    components: {
   
    },
    data() {
      return {
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
        DISPLAY_ENUM: {
          text: { tag: 'Input', event: this.inputRender },
          check: { tag: 'Checkbox', event: this.checkboxRender },
          select: { tag: 'Select', event: this.selectRender },
          drp: { tag: 'DropDownSelectFilter', event: this.dropDownSelectFilterRender },
          mrp: { tag: 'DropDownSelectFilter', event: this.dropDownSelectFilterRender },
          OBJ_DATENUMBER: { tag: 'DatePicker', event: this.datePickertRender },
          OBJ_DATE: { tag: 'DatePicker', event: this.datePickertRender },
          OBJ_TIME: { tag: 'TimePicker', event: this.timePickerRender },
        } // 标签映射
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
        // 表哥高度 默认300px
        type: Number,
        default: 300
      },
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
        return this.filterData(this.dataSource.row); // 每列的数据
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
              COLLECTION_INDEX: '合计',
              FILTER: '123'
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
                buttonConfigInfo.requestUrlPath = tabcmd.paths[index];
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
        return this.mainFormInfo.buttonsData.data.objreadonly;
      }
    
    },
    methods: {
    
      //   ...mapMutations('global', ['doCollapseHistoryAndFavorite']),
      //   ...mapActions('global', ['getMenuLists']),


      filterColumns(data) {
        if (!data) {
          return [];
        }
        // 整合表头数据
        const columns = data
          .filter(ele => ele.name !== EXCEPT_COLUMN_NAME)
          .map((ele) => {
            const item = Object.assign(ele, {
              title: ele.name,
              key: ele.colname
            });
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
          
          return null;
        }
        if (cellData.isfk && cellData.fkdisplay) {
          return this.DISPLAY_ENUM[cellData.fkdisplay].event(cellData, this.DISPLAY_ENUM[cellData.fkdisplay].tag);
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
            on: {
              'on-change': (event, data) => {
                this.putDataFromCell(event.target.value, data.value, cellData.colname, this.dataSource.row[params.index][EXCEPT_COLUMN_NAME].val);
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
                value: params.row[cellData.colname]
                  ? cellData.combobox.filter(
                    ele => ele.limitdesc === params.row[cellData.colname]
                  )[0].limitval
                  : null
              },
              on: {
                'on-change': (event, data) => {
                  this.putDataFromCell(event, data.value, cellData.colname, this.dataSource.row[params.index][EXCEPT_COLUMN_NAME].val);
                }
              }
            },
            cellData.combobox.map(item => h('Option', {
              props: {
                value: item.limitval,
                label: item.limitdesc
              }
            })))
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
            on: {
              'on-popper-show': () => {
                this.fkDropPageInfo.currentPageIndex = 1;
                this.fkAutoData = [];
                this.getFKList();
                // debugger;
              },
              'on-page-change': (value) => {
                this.fkDropPageInfo.currentPageIndex = value;
                this.getFKList();
              },
              'on-input-value-change': (data, value) => {
                this.fkAutoData = [];
                fkFuzzyquerybyak({
                  searchObject: {
                    ak: data,
                    colid: this.dataSource.row[params.index][cellData.colname].colid,  
                    fixedcolumns: {}
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
                  const autoData = this.fkAutoData.filter(ele => (value.inputValue && ele.value.toUpperCase().indexOf(value.inputValue.toUpperCase()) > -1));
                  value.inputValue = autoData[0].value;
                }
                this.fkAutoData = [];
                let ids = null;
                if (value.transferDefaultSelected) {
                  ids = value.transferDefaultSelected.reduce((acc, cur) => (typeof acc !== 'object' ? `${acc},${cur.ID}` : cur.ID), []);
                }
                console.log(ids);
                this.putDataFromCell(value.transferDefaultSelected ? value.transferDefaultSelected[0].ID : null, value.defaultSelected && value.defaultSelected.length > 0 ? value.defaultSelected[0].ID : null, cellData.colname, this.dataSource.row[params.index][EXCEPT_COLUMN_NAME].val);
              },
              'on-fkrp-selected': (data, value) => {
                this.fkAutoData = [];
                let ids = null;
                if (value.transferDefaultSelected) {
                  ids = value.transferDefaultSelected.reduce((acc, cur) => (typeof acc !== 'object' ? `${acc},${cur.ID}` : cur.ID), []);
                }
                console.log(ids);
                this.putDataFromCell(value.transferDefaultSelected ? value.transferDefaultSelected[0].ID : null, value.defaultSelected && value.defaultSelected.length > 0 ? value.defaultSelected[0].ID : null, cellData.colname, this.dataSource.row[params.index][EXCEPT_COLUMN_NAME].val);
              }
            }
          })
        ]);
      },
      datePickertRender(cellData, tag) { // 日趋选择
        return (h, params) => h('div', [
          h(tag, {
            style: {
              width: cellData.display === 'OBJ_DATENUMBER' ? '100px' : '150px'
            },
            props: {
              value: params.row[cellData.colname],
              type: cellData.display === 'OBJ_DATENUMBER' ? 'date' : 'datetime',
              transfer: true
            },
            on: {
              'on-change': (event, dateType, data) => {
                this.putDataFromCell(event, data.value, cellData.colname, this.dataSource.row[params.index][EXCEPT_COLUMN_NAME].val);
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
              // value: new Date(Date.parse(`${new Date().getFullYear()} - ${params.row[cellData.colname]}`.replace(/-/g, '/'))),
              transfer: true
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
            innerHTML: `<i class="iconfont" data-target-tag="fkIcon" style="color: #0f8ee9; cursor: pointer" >&#xe625;</i>${params.row[cellData.colname]}`
          },
          on: {
            click: (event) => {
              // TODO 外键关联跳转
              
            }
          }
        });
      },
      dropDefaultSelectedData(params, cellData) {
        // drp mrp 初始数据赋值
        const defaultData = [];
        if (this.dataSource.row[params.index][cellData.colname]) {
          const data = {
            ID: this.dataSource.row[params.index][cellData.colname].colid,
            Label: params.row[cellData.colname]
          };
          defaultData.push(data);
        }
        return defaultData;
      },
      inputRegx(cellData) {
        // 输入框正则
        if (cellData.type === 'NUMBER' && cellData.scale && cellData.scale > 0) {
          return new RegExp(`^[\\-\\+]?\\d+(\\.[0-9]{0,${cellData.scale}})?$`);
        } if (cellData.type === 'NUMBER') {
          return new RegExp('^[\\-\\+]?\\d+(\\.[0-9]{0,2)?$');
        } if (cellData.type === 'STRING' && cellData.isuppercase) { // 大写
          return Capital;
        }
        return null;
      },
      putDataFromCell(currentValue, oldValue, colname, IDValue) {
        // 组装数据 存入store
        console.log(currentValue, oldValue, colname, IDValue);
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
          startindex: (Number(this.pageInfo.currentPageIndex) - 1) * Number(this.pageInfo.pageSize),
          range: this.pageInfo.pageSize,
          table: this.tabPanel[this.tabCurrentIndex].tablename,
          objid: itemId,
          refcolid: this.tabPanel[this.tabCurrentIndex].refcolid,
          fixedcolumns
        };
        this.getObjectTableItemForTableData(params);
        this.searchInfo = '';
      },
      getFKList() {
        // 获取外键关联的数据
        this.fkData.totalRowCount = 0;
        this.fkData = ({});
        const searchdata = {
          isdroplistsearch: true, 
          refcolid: 165316, // TODO
          fixedcolumns: { PS_C_BRAND_ID: '=7' }, // TODO
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
      }
    },
    mounted() {
    //   this.getMenuLists();
    },
  };
</script>

<style scoped lang="less">
.TableDetailCollection {
  .detail-collection {
    .detail-top {
      margin-bottom: 10px;
      display: flex;
      justify-content: space-between;
      .page-buttons {
        display: flex;
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
              height: 25px;
              line-height: 2px;
            }
          }
        }
      }
    }
    .table-outside {
    }
  }
}
</style>
