<template>
  <div class="TableDetailCollection">
    <div class="detail-collection">
      <div class="detail-top">
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
              @on-search="tableSearch"
              @on-enter="tableSearch"
            >
            <Button
              slot="prepend"
              @click="tableSearch"
            >
              搜索
            </Button>
            </Input>
          </div>
        </div>
      </div>
      <div class="table-outside">
        {{ totalData }}
        <Table
          ref="selection"
          :height="tableHeight"
          border
          :columns="columns"
          :data="data"
          :total-data="totalData"
        />
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState, mapMutations, mapActions } from 'vuex';
  import { Capital } from '../constants/regExp';

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
        pageInfo: {
          currentPageIndex: this.dataSource.start || 0, // 当前页码
          pageSize: this.dataSource.defaultrange || 10 // 显示条数
        },
        DISPLAY_ENUM: {
          text: { tag: 'Input', event: this.inputRender },
          check: { tag: 'Checkbox', event: this.checkboxRender },
          select: { tag: 'Select', event: this.selectRender },
          mop: { tag: 'DropDownSelectFilter', event: this.dropDownSelectFilterRender }
          // OBJ_DATENUMBER: ''
          // OBJ_DATE:
          // OBJ_TIME:
          // isfk
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
        default: pageType.vertical
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
        if (this.type === pageType.Horizontal) {
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
        if (!cellData.ismodify || !this.readonly) {
          // 不可编辑状态 显示label
          return (h, params) => h('div', [
            h('span', {
              domProps: {
                innerHTML: params.row[cellData.colname]
              }
            })
          ]);
        }
        if (
          typeof 
            this.DISPLAY_ENUM[cellData.display].event(cellData, this.DISPLAY_ENUM[cellData.display].tag) === 'function'
        ) {
          return this.DISPLAY_ENUM[cellData.display].event(cellData, this.DISPLAY_ENUM[cellData.display].tag);
        }
        return null;
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
            }
          })
        ]);
      },
      selectRender(cellData, tag) {
        // 下拉框
        return (h, params) => h('div', [
          h(
            tag,
            {
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
              }
            },
            cellData.combobox.map(item => h('Option', {
              props: {
                value: item.limitval,
                label: item.limitdesc
              }
            }))
          )
        ]);
      },
      inputRegx(cellData) {
        // 输入框正则
        if (cellData.type === 'NUMBER' && cellData.scale && cellData.scale > 0) {
          return new RegExp(`^[\\-\\+]?\\d+(\\.[0-9]{0,${cellData.scale}})?$`);
        } if (cellData.type === 'NUMBER') {
          return new RegExp('^[\\-\\+]?\\d+(\\.[0-9]{0,2)?$');
        } if (cellData.type === 'STRING' && cellData.isuppercase) {
          return Capital;
        }
        return null;
      },
      getTableListForRefTable() {
      // 获取列表数据
      },
      tableSearch() {
        // 搜索事件
        const fixedcolumns = {};
        if (this.searchCondition) {
          fixedcolumns[this.searchCondition] = this.searchInfo;
        }
        const params = {
          startindex: 0,
          range: 10,
          fixedcolumns
        };
        // this.getTableListForRefTable();
      
        this.$emit('tableSearch', params);
      },
      pageChangeEvent(index) {
        // 分页 页码改变的回调
        if (index === this.pageInfo.currentPageIndex) {
          return;
        }
        this.pageInfo.currentPageIndex = index;
        this.getTableListForRefTable();
      },
      pageSizeChangeEvent(index) {
        // 分页 切换每页条数时的回调
        if (index === this.pageInfo.pageSize) {
          return;
        }
        this.pageInfo.pageSize = index;
        this.getTableListForRefTable();
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
    margin: 5px;
    .detail-top {
      margin-bottom: 10px;
      display: flex;
      justify-content: space-between;
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
