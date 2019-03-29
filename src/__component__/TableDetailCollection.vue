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
        />
        <div class="detail-search">
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
            >{{ item.label }}</Option>
          </Select>
          <div class="detail-search-input">
            <Input
              v-model="searchInfo"
              search
              placeholder="请输入查询内容"
              @on-search="tabelSearch"
              @on-enter="tabelSearch"
            >
              <Button slot="prepend" @click="tabelSearch">搜索</Button>
            </Input>
          </div>
        </div>
      </div>
      <div class="table-outside">
        <Table ref="selection" :height="tableHeight" border :columns="columns" :data="data"/>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";

const EXCEPT_COLUMN_NAME = "ID"; // 排除显示列（ID）
const COLLECTION_INDEX = "COLLECTION_INDEX"; // 序号
const DISPLAY_ENUM = {
  text: { tag: "Input", eval: "inputRender" },
  check: { tag: "Checkbox", eval: "checkboxRender" },
  select: { tag: "Select", eval: "selectRender" },
  mop: { tag: "DropDownSelectFilter", eval: "dropDownSelectFilterRender" }
  // OBJ_DATENUMBER: ''
  // OBJ_DATE:
  // OBJ_TIME:
  // isfk
}; // 标签映射



//  jumpCurrentPage(val) {
//         // 分页初始化参数
//         this.reloadPage = true;
//         this.startIndex = (val - 1) * this.searchdata.range;
//         this.searchdata.startindex = (val - 1) * this.searchdata.range;
//         this.tableChooseList = [];
//         this.getObjectTableItem();
//       },
//       // 改变一页显示记录数
//       selectPageSizeChange(val) {
//         this.searchdata.range = val;
//         this.searchdata.startindex = 0;
//         this.getObjectTableItem();
//       },

export default {
  name: "TableDetailCollection",
  components: {
    // NavigatorPrimaryMenu
   
  },
  data() {
    return {
      // columns: [],
      // data: [],
      searchInfo: "", // 输入框搜索内容
      searchCondition: null // 查询条件
    };
  },
  props: {
    dataSource: {
      // 总数据源
      type: Object,
      default: () => ({})
    },
    canEidt: {
      // 能否编辑
      type: Boolean,
      default: true
    },
    tableHeight: {
      // 表哥高度 默认300px
      type: Number,
      default: 300
    }
  },
  computed: {
    ...mapState("global", {
      // collapseHistoryAndFavorite: ({ collapseHistoryAndFavorite }) => collapseHistoryAndFavorite,
      // menuLists: ({ menuLists }) => menuLists
    }),
    filterList() {
      return this.columns.filter(
        ele => ele.name !== EXCEPT_COLUMN_NAME && ele.isfilter
      );
    },
   data() {
     return this.filterData(this.dataSource.row);
   },
   columns() {
     return this.filterColumns(this.dataSource.tabth);
   }
    
  },
  methods: {
    
    //   ...mapMutations('global', ['doCollapseHistoryAndFavorite']),
    //   ...mapActions('global', ['getMenuLists']),

    // if (val.length) {
    //             if (val.scale === 0) {
    //               reg = new RegExp(`^[\\-\\+]?\\d{1,${val.length - val.scale}}(\\.\\d{1,2})?$`);
    //             } else {
    //               reg = new RegExp(`^[\\-\\+]?\\d{1,${val.length - val.scale}}(\\.\\d{0,${val.scale}})?$`); // 匹配小数点位数 /^\d+(\.\d{0,2})?$/
    //             }
    //           } else if (val.scale === 0) {
    //             reg = new RegExp('^[\\-\\+]?\\d+(\\.\\d{1,2})?$');
    //           } else {
    //             reg = new RegExp(`^[\\-\\+]?\\d+(\\.\\d{0,${val.scale}})?$`); // 匹配小数点位数 /^\d+(\.\d{0,2})?$/
    //           }
    //           if (!reg.test(val.valuedata) && val.type === 'NUMBER' && val.valuedata && val.valuedata !== '-') {
    //             if (isNaN(val.valuedata)) {
    //               val.valuedata = val.valuedata.length === 1 ? '' : oldVal.valuedata.substr(0, oldVal.valuedata.length - 1);
    //             } else if (val.scale === 0) {
    //               val.valuedata = val.valuedata.substring(0, val.valuedata.length - 1);
    //             } else {
    //               val.valuedata = val.valuedata.substring(0, val.valuedata.indexOf('.') === -1 ? val.valuedata.length - 1 : val.valuedata.indexOf('.') + val.scale - 0 + 1);
    //             }
    //           }

    filterColumns(data) {
      if (!data) {
        return;
      }
      // 整合表头数据
      const columns = data
        .filter(ele => ele.name !== EXCEPT_COLUMN_NAME)
        .map(ele => {
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
          type: "selection",
          width: 40,
          align: "center"
        },
        {
          title: "序号",
          key: COLLECTION_INDEX
        }
      ];
      return headColumn.concat(renderColumns);
    },
    filterData(rows) {
      if (!rows) {
        return;
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
      if (!cellData.ismodify || !this.canEidt) {
        // 不可编辑状态 显示label
        return (h, params) =>
          h("div", [
            h("span", {
              domProps: {
                innerHTML: params.row[cellData.colname]
              }
            })
          ]);
      }
      if (
        typeof eval(
          `this.${
            DISPLAY_ENUM[cellData.display].eval
          }(cellData, DISPLAY_ENUM[cellData.display].tag)`
        ) === "function"
      ) {
        return eval(
          `this.${
            DISPLAY_ENUM[cellData.display].eval
          }(cellData, DISPLAY_ENUM[cellData.display].tag)`
        );
      }
      return null;
    },
    inputRender(cellData, tag) {
      // 输入框
      return (h, params) =>
        h("div", [
          h(tag, {
            style: {
              width: "100px"
            },
            props: {
              value: params.row[cellData.colname],
              regx:
                cellData.type === "NUMBER"
                  ? cellData.scale && cellData.scale > 0
                    ? new RegExp(
                        `^[\\-\\+]?\\d+(\\.[0-9]{0,${cellData.scale}})?$`
                      )
                    : new RegExp("^[\\-\\+]?\\d+(\\.[0-9]{0,2)?$")
                  : null,
              maxlength:
                cellData.type === "NUMBER"
                  ? cellData.length + 1
                  : cellData.length
            }
          })
        ]);
    },
    checkboxRender(cellData, tag) {
      // 复选框
      return (h, params) =>
        h("div", [
          h(tag, {
            style: {
              width: "40px"
            },
            props: {
              value: cellData.combobox.filter(
                ele => ele.limitdesc === params.row[cellData.colname]
              )[0].limitdis
            }
          })
        ]);
    },
    selectRender(cellData, tag) {
      // 下拉框
      return (h, params) =>
        h("div", [
          h(
            tag,
            {
              style: {
                width: "100px"
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
            cellData.combobox.map(item =>
              h("Option", {
                props: {
                  value: item.limitval,
                  label: item.limitdesc
                }
              })
            )
          )
        ]);
    },
    tabelSearch() {
      // 搜索事件
      const fixedcolumns = {};
      if (this.searchCondition) {
        fixedcolumns[this.searchCondition] = this.searchInfo;
      }
      const params = {
        startindex: 0,
        range: 10,
        fixedcolumns: fixedcolumns
      };
      // this.getTableListForRefTable();
      
      this.$emit('tableSearch', params);
    },

    // 深拷贝
    deepClone(source) {
      if (!source || typeof source !== "object") {
        return source;
      }
      const targetObj = source.constructor === Array ? [] : {};
      for (const keys in source) {
        if (Object.prototype.hasOwnProperty.call(source, keys)) {
          if (source[keys] && typeof source[keys] === "object") {
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
