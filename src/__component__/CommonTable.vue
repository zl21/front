<template>
  <div class="commonTable">
    <Table
      :columns="columns"
      :height="true"
      :data="tableData"
      :row-class-name="rowClassName"
      @on-selection-change="tableSelectionChange"
      @on-row-dblclick="tableRowDbclick"
      @on-row-click="tableRowClick"
      @on-sort-change="tableSortChange"
      @on-select-all="tableSelectionChange"
    />
    <Spin
      v-show="spinShow"
      fix
    >
      <Icon
        type="ios-loading"
        size="48"
        class="demo-spin-icon-load"
      />
      <div>Loading</div>
    </Spin>
  </div>
</template>

<script>
  import { mapMutations } from 'vuex';

  export default {
    data() {
      return {
        spinShow: false
      };
    },
    name: 'CommonTable',
    components: {},
    props: {
      cssStatus: {
        type: Array,
        default: () => []
      }, // 颜色配置信息  /p/cs/getTableQuery 接口返回
      datas: {
        type: Object,
        default: () => ({})
      }, // 所有返回数据  /p/cs/getTableQuery 接口返回
      errorArr: {
        type: Array,
        default: () => []
      }, // 错误信息数组
      onRowSingleClick: {
        type: Function,
        default: () => {
          // 参数说明
          // colDef：包含表头信息的对象
          // row：包含当前行所有数据的对象
          // target：事件触发对象，即event.target所返回的dom结点
        }
      }, // 行单击回调
      onRowDoubleClick: {
        type: Function,
        default: () => {
          // 参数说明
          // colDef：包含表头信息的对象
          // row：包含当前行所有数据的对象
          // target：事件触发对象，即event.target所返回的dom结点
        }
      }, // 行双击回调
      onSortChanged: {
        type: Function,
        default: () => {
          // 参数说明
          // arrayOfSortInfo: 返回当前用户触发的排序信息
          // 形如： [{"colId":"PS_C_BRAND_ID.val","sort":"asc"},{"colId":"ECODE.val","sort":"desc"}]
        }
      }, // 排序事件触发回调
      onSelectionChanged: {
        type: Function,
        default: () => {
          // 参数 rowIdArray选中的数据id数组 rowArray选中的数据数组
        }
      }, // 行选中事件
    },
    computed: {
      columns() {
        const defaultColumns = [{
          type: 'selection',
          width: 40,
          align: 'right'
        }];
        if (Object.keys(this.datas).length > 0) {
          return defaultColumns.concat(this.datas.tabth.reduce((acc, cur) => {
            if (cur.name === 'ID') {
              acc.push(Object.assign({
                title: '序号',
                align: 'left',
                render: this.collectionIndexRender()
              }, cur));
            } else if (cur.display === 'image') {
              acc.push(Object.assign({
                title: cur.name,
                key: cur.colname,
                sortable: cur.isorder ? 'custom' : false,
                render: this.imageRender(cur.colname)
              }, cur));
            } else if (cur.isfk && cur.fkdisplay !== 'mrp' && cur.fkdisplay !== 'mop') {
              acc.push(Object.assign({
                title: cur.name,
                key: cur.colname,
                sortable: cur.isorder ? 'custom' : false,
                render: this.fkIconRender(cur)
              }, cur));
            } else if (this.datas.ordids && this.datas.ordids.length > 0 && this.datas.ordids.findIndex(item => item.colname === cur.colname) > -1) {
              acc.push(Object.assign({
                title: cur.name,
                key: cur.colname,
                sortable: cur.isorder ? 'custom' : false,
                sortType: this.datas.ordids.find(item => item.colname === cur.colname).ordasc ? 'asc' : 'desc'
              }, cur));
            } else {
              acc.push(Object.assign({
                title: cur.name,
                key: cur.colname,
                sortable: cur.isorder ? 'custom' : false
              }, cur));
            }
            return acc;
          }, []));
        }
        return [];
      }, // 表头
      tableData() {
        if (Object.keys(this.datas).length > 0) {
          const data = this.datas.row.reduce((acc, cur) => {
            const obj = {};
            Object.keys(cur).forEach((item) => {
              obj[item] = cur[item].val;
            });
            acc.push(obj);
            return acc;
          }, []);
          this.spinShow = false;
          return data;
        }
        this.spinShow = false;
        return [];
      }, // 表体
    },
    watch: {},
    methods: {

      ...mapMutations('global', ['tabHref']),
      rowClassName(row) {
        let cssStr = '';
        this.cssStatus.forEach((item) => {
          const columnKey = this.columns.find(tem => tem.title === item.desc).key;
          const cssFindindex = item.value.findIndex(cur => cur === row[columnKey]);
          if (cssFindindex > -1) {
            cssStr = `${cssStr + item.css[cssFindindex]} `;
          }
        });
        return cssStr;
      }, // 行样式
      fkIconRender(cellData) {
        // 外键关联到icon
        return (h, params) => h('div', {
          domProps: {
            innerHTML: params.row[cellData.colname] ? `<i class="iconfont iconbj_link" data-target-tag="fkIcon" style="color: #0f8ee9; cursor: pointer; font-size: 12px" ></i>${params.row[cellData.colname]}` : ''
          },
          on: {
            click: (event) => {
              // TODO 外键关联跳转
              const data = this.datas.row[params.index][cellData.colname];
              if (cellData.objdistype === 'object') {
                this.tabHref({
                  type: 'tableDetailVertical',
                  tableName: data.reftablename,
                  tableId: data.reftableid,
                  label: data.reftabdesc,
                  id: data.refobjid
                });
              } else if (cellData.objdistype === 'tabpanle') {
                this.tabHref({
                  type: 'tableDetailHorizontal',
                  tableName: data.reftablename,
                  tableId: data.reftableid,
                  label: data.reftabdesc,
                  id: data.refobjid
                });
              }
              event.stopPropagation();
            }
          }
        });
      },
      imageRender(colname) {
        return (h, params) => {
          if (!params.row[colname]) {
            return null;
          }
          return h('div', [
            h('Poptip', {
              style: {
              },
              props: {
                trigger: 'hover',
                transfer: true,
                content: 'content',
                placement: 'right'
              },
              scopedSlots: {
                default: () => h('img', {
                  style: {
                    height: '20px',
                    width: '20px'
                  },
                  domProps: {
                    src: params.row[colname] && this.isJsonString(params.row[colname]) ? JSON.parse(params.row[colname])[0].URL : params.row[colname]
                  }
                }),
                content: () => h('img', {
                  style: {
                    width: '120px',
                    height: '120px',
                    margin: '8px 0px',
                    'vertical-align': 'middle',
                  },
                  domProps: {
                    src: params.row[colname] && this.isJsonString(params.row[colname]) ? JSON.parse(params.row[colname])[0].URL : params.row[colname]
                  }
                }),
              },
              nativeOn: {
                // click: (e) => {
                //   e.stopPropagation();
                // }
              },
            })
          ]);
        };
      }, // 图片render
      isJsonString(str) {
        if (typeof JSON.parse(str) === 'object') {
          return true;
        }
        return false;
      },
      collectionIndexRender() {
        // 序号的render
        return (h, params) => {
          const index = Number(this.datas.start) + params.index + 1;
          if (this.datas.deleteFailInfo && this.datas.deleteFailInfo.length > 0 && this.datas.deleteFailInfo.findIndex(item => item.objid.toString() === params.row.ID.toString()) > -1) {
            const errIndex = this.datas.deleteFailInfo.findIndex(item => item.objid.toString() === params.row.ID.toString());
            return h('div', [
              h('Poptip', {
                style: {},
                props: {
                  trigger: 'hover',
                  transfer: true,
                  wordWrap: true,
                  content: 'content',
                  placement: 'right'

                },
                scopedSlots: {
                  default: () => h('div', {
                    style: {},
                    domProps: {
                      innerHTML: `<span>${index}</span>
                            <i class="iconfont iconios-warning-outlin" style="margin-left:5px; color: red" />`
                    }
                  }),
                  content: () => h('div', {
                    style: {
                      width: '180px',
                    },
                    domProps: {
                      innerHTML: `<span>${this.datas.deleteFailInfo[errIndex].message}</span>`
                    }
                  }),
                },
              })
            ]);
          }
          return h('div', {
            domProps: {
              innerHTML: `<span>${index}</span>`
            }
          });
        };
      }, // 序号render
      tableRowClick() {

      }, // 普通表格单击
      tableSelectionChange(val) {
        const self = this;
        const rowIdArray = val.reduce((acc, cur) => {
          acc.push(cur.ID);
          return acc;
        }, []);
        if (typeof self.onSelectionChanged === 'function') {
          self.onSelectionChanged(rowIdArray, val);
        }
      }, // 普通表格选中事件
      tableRowDbclick(row, index, event, colDef) {
        const self = this;
        const rowData = this.datas.row[index];
        if (typeof self.onRowDoubleClick === 'function') {
          self.onRowDoubleClick(colDef, rowData, event.target);
        }
      }, // 普通表格双击事件
      tableSortChange(val) {
        const self = this;
        const arrayOfSortInfo = [{ colId: val.key, sort: val.order }];
        if (typeof self.onSortChanged === 'function') {
          self.onSortChanged(arrayOfSortInfo);
        }
      }, // 表格排序触发
    }
  };
</script>

<style lang="less">
    .burgeon-spin-fix{
        z-index: 999;
        .demo-spin-icon-load{
            animation: ani-demo-spin 1s linear infinite;
        }
        @keyframes ani-demo-spin {
            from { transform: rotate(0deg);}
            50%  { transform: rotate(180deg);}
            to   { transform: rotate(360deg);}
        }
    }
    .commonTable {
        height: 100%;
        overflow-y: hidden;
        position: relative;
    }
</style>
