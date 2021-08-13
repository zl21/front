<template>
  <div :class="classes">
    <Table
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
    <Dialog
      ref="dialogRef"
      :title="dialogConfig.title"
      :mask="dialogConfig.mask"
      :content-text="dialogConfig.contentText"
      :footer-hide="dialogConfig.footerHide"
      :confirm="dialogConfig.confirm"
      :dialog-component-name="dialogComponentName"
    />
  </div></dialog>
</template>

<script>
  /* eslint-disable no-lonely-if */

  import { mapMutations } from 'vuex';
  import Dialog from '../../__component__/Dialog';
  import getObjdisType from '../../__utils__/getObjdisType.js';
  import { customizeMixins, classFix } from '../../constants/global';

  export default {
    data() {
      return {
        spinShow: false,
        dialogComponentName: null,
        dialogConfig: {
          title: this.$t('feedback.alert'),
          mask: true,
          footerHide: false,
          contentText: '',
          confirm: () => {
          }
        }, // 弹框配置信息
      };
    },
    mixins: [customizeMixins().taskList ? customizeMixins().taskList : false],
    name: 'CommonTable',
    components: { Dialog },
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
      onSingleCellClick: {
        type: Function,
        default: () => {

        }
      }
    },
    computed: {
      columns() {
        const defaultColumns = [{
          type: 'selection',
          width: 22,
          align: 'right',
          fixed: 'left'
        }];
        if (Object.keys(this.datas).length > 0 && this.datas.tabth.length > 1) {
          let temColumn = defaultColumns.concat(this.datas.tabth.reduce((acc, cur) => {
            if (cur.comment) {
              if (cur.name === 'ID') {
                acc.push(Object.assign({
                  title: this.$t('table.index'),
                  align: 'left',
                  fixed: 'left',
                  key: 'ID',
                  width: 40,
                  render: this.collectionIndexRender(),
                  renderHeader: this.tooltipRenderHeader()
                }, cur));
              } else if (cur.display === 'doc') {
                if (cur.isorder) {
                  cur.sortable = 'custom';
                }
                acc.push(Object.assign({
                  title: cur.name,
                  key: cur.colname,
                  // sortable: cur.isorder ? 'custom' : false,
                  render: this.docRender(),
                  renderHeader: this.tooltipRenderHeader()
                }, cur));
              } else if (cur.display === 'image') {
                if (cur.isorder) {
                  cur.sortable = 'custom';
                }
                acc.push(Object.assign({
                  title: cur.name,
                  key: cur.colname,
                  // sortable: cur.isorder ? 'custom' : false,
                  render: this.imageRender(cur.colname),
                  renderHeader: this.tooltipRenderHeader()
                }, cur));
              } else if (cur.isfk && cur.fkdisplay !== 'mrp' && cur.fkdisplay !== 'mop') {
                if (this.datas.ordids && this.datas.ordids.length > 0 && this.datas.ordids.findIndex(item => item.colname === cur.colname) > -1) {
                  if (cur.isorder) {
                    cur.sortable = 'custom';
                    cur.sortType = this.datas.ordids.find(item => item.colname === cur.colname).ordasc ? 'asc' : 'desc';
                  }
                  acc.push(Object.assign({
                    title: cur.name,
                    key: cur.colname,
                    // sortable: cur.isorder ? 'custom' : false,
                    // sortType: this.datas.ordids.find(item => item.colname === cur.colname).ordasc ? 'asc' : 'desc',
                    render: this.fkIconRender(cur),
                    renderHeader: this.tooltipRenderHeader()
                  }, cur));
                } else {
                  if (cur.isorder) {
                    cur.sortable = 'custom';
                  }
                  acc.push(Object.assign({
                    title: cur.name,
                    key: cur.colname,
                    // sortable: cur.isorder ? 'custom' : false,
                    render: this.fkIconRender(cur),
                    renderHeader: this.tooltipRenderHeader()
                  }, cur));
                }
              } else if (this.datas.ordids && this.datas.ordids.length > 0 && this.datas.ordids.findIndex(item => item.colname === cur.colname) > -1) {
                if (cur.isorder) {
                  cur.sortable = 'custom';
                  cur.sortType = this.datas.ordids.find(item => item.colname === cur.colname).ordasc ? 'asc' : 'desc';
                }
                acc.push(Object.assign({
                  title: cur.name,
                  key: cur.colname,
                  // sortable: cur.isorder ? 'custom' : false,
                  // sortType: this.datas.ordids.find(item => item.colname === cur.colname).ordasc ? 'asc' : 'desc',
                  renderHeader: this.tooltipRenderHeader()
                }, cur));
              } else if (cur.customerurl) {
                if (cur.isorder) {
                  cur.sortable = 'custom';
                }
                acc.push(Object.assign({
                  title: cur.name,
                  key: cur.colname,
                  // sortable: cur.isorder ? 'custom' : false,
                  render: this.customerUrlRender(),
                  renderHeader: this.tooltipRenderHeader()
                }, cur));
              } else {
                if (cur.isorder) {
                  cur.sortable = 'custom';
                }
                acc.push(Object.assign({
                  title: cur.name,
                  key: cur.colname,
                  // sortable: cur.isorder ? 'custom' : false,
                  renderHeader: this.tooltipRenderHeader()
                }, cur));
              }
            } else {
              if (cur.name === 'ID') {
                acc.push(Object.assign({
                  title: this.$t('table.index'),
                  align: 'left',
                  fixed: 'left',
                  key: 'ID',
                  width: 40,
                  render: this.collectionIndexRender()
                }, cur));
              } else if (cur.display === 'switch') { // 开关选择器
                acc.push(Object.assign({
                  title: cur.name,
                  key: cur.colname,
                  render: this.switchRender(cur.colname)
                }, cur));
              } else if (cur.display === 'command') { // 操作列
                acc.push(Object.assign({
                  title: cur.name,
                  key: cur.colname,
                  render: this.commandRender(cur)
                }, cur));
              } else if (cur.display === 'image') {
                if (cur.isorder) {
                  cur.sortable = 'custom';
                }
                acc.push(Object.assign({
                  title: cur.name,
                  key: cur.colname,
                  // sortable: cur.isorder ? 'custom' : false,
                  render: this.imageRender(cur.colname)
                }, cur));
              } else if (cur.display === 'doc') {
                if (cur.isorder) {
                  cur.sortable = 'custom';
                }
                acc.push(Object.assign({
                  title: cur.name,
                  key: cur.colname,
                  // sortable: cur.isorder ? 'custom' : false,
                  render: this.docRender()
                }, cur));
              } else if (cur.isfk && cur.fkdisplay !== 'mrp' && cur.fkdisplay !== 'mop') {
                if (this.datas.ordids && this.datas.ordids.length > 0 && this.datas.ordids.findIndex(item => item.colname === cur.colname) > -1) {
                  if (cur.isorder) {
                    cur.sortable = 'custom';
                    cur.sortType = this.datas.ordids.find(item => item.colname === cur.colname).ordasc ? 'asc' : 'desc';
                  }
                  acc.push(Object.assign({
                    title: cur.name,
                    key: cur.colname,
                    // sortable: cur.isorder ? 'custom' : false,
                    // sortType: this.datas.ordids.find(item => item.colname === cur.colname).ordasc ? 'asc' : 'desc',
                    render: this.fkIconRender(cur)
                  }, cur));
                } else {
                  if (cur.isorder) {
                    cur.sortable = 'custom';
                  }
                  acc.push(Object.assign({
                    title: cur.name,
                    key: cur.colname,
                    // sortable: cur.isorder ? 'custom' : false,
                    render: this.fkIconRender(cur)
                  }, cur));
                }
              } else if (this.datas.ordids && this.datas.ordids.length > 0 && this.datas.ordids.findIndex(item => item.colname === cur.colname) > -1) {
                if (cur.isorder) {
                  cur.sortable = 'custom';
                  cur.sortType = this.datas.ordids.find(item => item.colname === cur.colname).ordasc ? 'asc' : 'desc';
                }
                acc.push(Object.assign({
                  title: cur.name,
                  key: cur.colname,
                  // sortable: cur.isorder ? 'custom' : false,
                  // sortType: this.datas.ordids.find(item => item.colname === cur.colname).ordasc ? 'asc' : 'desc'
                }, cur));
              } else if (cur.customerurl) {
                if (cur.isorder) {
                  cur.sortable = 'custom';
                }
                acc.push(Object.assign({
                  title: cur.name,
                  key: cur.colname,
                  // sortable: cur.isorder ? 'custom' : false,
                  render: this.customerUrlRender()
                }, cur));
              } else {
                if (cur.isorder) {
                  cur.sortable = 'custom';
                }
                acc.push(Object.assign({
                  title: cur.name,
                  key: cur.colname,
                  // sortable: cur.isorder ? 'custom' : false
                }, cur));
              }
            }
            return acc;
          }, []));
          temColumn = temColumn.reduce((arr, cur) => {
            if (cur.key === 'URL') {
              cur.render = (h, params) => h('a', {
                on: {
                  click: () => {
                    if (this.$parent.optionsClick && typeof this.$parent.optionsClick === 'function') {
                      this.$parent.optionsClick(params.row).then(() => {
                        if (typeof this.onSingleCellClick === 'function') {
                          this.onSingleCellClick(params.row);
                        }
                        // window.open(params.row.URL);
                        let url = '';
                        if (params.row.URL.indexOf('http') !== -1) {
                          url = params.row.URL;
                          window.open(url);
                        } else {
                          if (params.row.URL.indexOf('/SYSTEM/TABLE_DETAIL') !== -1) { // 判断是不是标准单对象页面
                            getObjdisType({ table: params.row.URL.split('/')[4] }).then((res) => {
                              const distype = res === 'tabpanle' ? 'H' : 'V';
                              const arr = params.row.URL.split('/');
                              arr[3] = distype;
                              url = arr.join('/');
                              url = url.substr(1);
                              const param = {
                                url,
                                id: params.row.ID,
                                label: null,
                                isMenu: true
                              };
                              this.directionalRouter(param);// 定向路由跳转方法
                            });
                          } else {
                            url = params.row.URL;
                            url = url.substr(1);
                            const param = {
                              url,
                              id: params.row.ID,
                              label: null,
                              isMenu: true
                            };
                            this.directionalRouter(param);// 定向路由跳转方法
                          }
                        }
                      });
                    } else {
                      if (typeof this.onSingleCellClick === 'function') {
                        this.onSingleCellClick(params.row);
                      }
                      // window.open(params.row.URL);
                      let url = '';
                      if (params.row.URL.indexOf('http') !== -1) {
                        url = params.row.URL;
                        window.open(url);
                      } else {
                        if (params.row.URL.indexOf('/SYSTEM/TABLE_DETAIL') !== -1) { // 判断是不是标准单对象页面
                          getObjdisType({ table: params.row.URL.split('/')[4] }).then((res) => {
                            const distype = res === 'tabpanle' ? 'H' : 'V';
                            const arr = params.row.URL.split('/');
                            arr[3] = distype;
                            url = arr.join('/');
                            url = url.substr(1);
                            const param = {
                              url,
                              id: params.row.ID,
                              label: null,
                              isMenu: true
                            };
                            this.directionalRouter(param);// 定向路由跳转方法
                          });
                        } else {
                          url = params.row.URL;
                          url = url.substr(1);
                          const param = {
                            url,
                            id: params.row.ID,
                            label: null,
                            isMenu: true
                          };
                          this.directionalRouter(param);// 定向路由跳转方法
                        }
                      }
                    }
                  }
                }
              }, this.$t('buttons.viewDetails'));
            }
            if (cur.key !== 'OBJDISTYPE') {
              arr.push(cur);
            }
            return arr;
          }, []);
          return temColumn;
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
      tableTotalData() {
        const total = [];
        if (this.datas.isSubTotalEnabled) {
          const cell = {
            ID: this.$t('table.summation')
          };
          const needSubtotalList = this.columns.filter(ele => ele.issubtotal);
          needSubtotalList.map((ele) => {
            const needSubtotalDatas = [];
            this.tableData.reduce((a, c) => needSubtotalDatas.push(c[ele.colname]), []); //
            let totalNumber = needSubtotalDatas.reduce((a, c) => Number(a) + Number(c), []);
            if (typeof totalNumber === 'number') {
              totalNumber = totalNumber.toFixed(2);
            }
            cell[ele.colname] = `${totalNumber}`;
            return ele;
          });
          total.push(cell);
        }
        // if (this.isHorizontal) {
        if (this.datas.isFullRangeSubTotalEnabled) {
          // 总计
          const cell = {
            ID: this.$t('table.total'),
          };
          if (this.datas.fullRangeSubTotalRow) {
            for (const key in this.datas.fullRangeSubTotalRow) {
              if (Object.prototype.hasOwnProperty.call(this.datas.fullRangeSubTotalRow, key)) {
                const element = this.datas.fullRangeSubTotalRow[key];
                cell[key] = element.val;
              }
            }
          }
          total.push(cell);
        }
        // }
        return total;
      }, // 总计和合计
      classes: () => `${classFix}commonTable`
    },
    watch: {},
    methods: {
      ...mapMutations('global', ['tabOpen', 'directionalRouter']),
      deselectAll() {
        this.$refs.table.selectAll(false);
      }, // 取消表格全部选中
      rowClassName(row) {
        let cssStr = '';
        // let cssColorStr = '';
        const cssStatus = JSON.parse(JSON.stringify(this.cssStatus));
        cssStatus.sort((a, b) => a.priority - b.priority);
        cssStatus.forEach((item) => {
          const columnKey = this.columns.find(tem => tem.title === item.desc).key;
          const cssFindindex = item.value.findIndex(cur => cur === row[columnKey]);
          if (cssFindindex > -1) {
            // if (item.css[cssFindindex].indexOf('color') > -1) {
            //   cssColorStr = item.css[cssFindindex];
            // } else {
            //   cssStr = `${cssStr + item.css[cssFindindex]} `;
            // }
            cssStr = `${cssStr + item.css[cssFindindex]} `;
          }
        });
        // cssStr = `${cssStr} ` + cssColorStr;
        return cssStr;
      }, // 行样式
      customerUrlRender() {
        return (h, params) => h('span', {
          style: {
            color: '#0f8ee9',
            'text-decoration': 'underline',
            cursor: 'pointer'
          },
          on: {
            click: () => {
              const objdistype = params.column.customerurl.objdistype;
              if (objdistype === 'popwin') {
                // 自定义弹窗
                this.$emit('CustomizedDialog', params);
              } else if (objdistype === 'tabpanle') {
                // 左右结构单对象界面
                const type = 'tableDetailHorizontal';
                const tab = {
                  type,
                  tableName: params.column.customerurl.reftablename,
                  tableId: params.column.customerurl.reftableid,
                  label: params.column.customerurl.reftabdesc,
                  id: params.row[params.column.customerurl.refobjid]
                };
                this.tabOpen(tab);
              } else if (objdistype === 'object') {
                // 上下结构单对象界面
                const type = 'tableDetailVertical';
                const tab = {
                  type,
                  tableName: params.column.customerurl.reftablename,
                  tableId: params.column.customerurl.reftableid,
                  label: params.column.customerurl.reftabdesc,
                  id: params.row[params.column.customerurl.refobjid]
                };
                this.tabOpen(tab);
              } else if (objdistype === 'customized') {
                // 自定义界面
                const type = 'tableDetailAction';
                const tab = {
                  type,
                  label: params.column.customerurl.reftabdesc,
                  customizedModuleName: params.column.customerurl.tableurl,
                  customizedModuleId: params.column.customerurl.reftableid
                };
                this.tabOpen(tab);
              }
            }
          },
        }, params.row[params.column.colname]);
      }, // 外键连接定制界面
      tooltipRenderHeader() {
        return (h, params) => h('span', [
          h('Poptip', {
            style: {},
            props: {
              trigger: 'hover',
              transfer: true,
              wordWrap: true,
              content: 'content',
              placement: 'top'

            },
            scopedSlots: {
              default: () => h('div', {
                style: {},
                domProps: {
                  innerHTML: `<i class="iconfont comment iconios-information-circle-outline" style="color: orangered"></i> <span>${params.column.name}</span>`
                }
              }),
              content: () => h('div', {
                style: {},
                domProps: {
                  innerHTML: `<span>${params.column.comment}</span>`
                }
              }),
            },
          })
        ]);
      }, // 表头提示的render
      fkIconRender(cellData) {
        // 外键关联到icon
        return (h, params) => h('div', {
          domProps: {
            innerHTML: params.row[cellData.colname] ? `<i class="iconfont iconbj_link" data-target-tag="fkIcon" style="color: #0f8ee9; cursor: pointer; font-size: 12px" ></i> ${params.row[cellData.colname]}` : ''
          },
          on: {
            click: (event) => {
              // TODO 外键关联跳转
              if (event.target.className) {
                const data = this.datas.row[params.index][cellData.colname];
                if (cellData.objdistype === 'object') {
                  window.sessionStorage.setItem('dynamicRoutingForHideBackButton', true);
                  this.tabOpen({
                    type: 'tableDetailVertical',
                    tableName: data.reftablename,
                    tableId: data.reftableid,
                    label: data.reftabdesc,
                    id: data.refobjid,
                    serviceId: data.serviceId
                  });
                } else if (cellData.objdistype === 'tabpanle') {
                  window.sessionStorage.setItem('dynamicRoutingForHideBackButton', true);
                  this.tabOpen({
                    type: 'tableDetailHorizontal',
                    tableName: data.reftablename,
                    tableId: data.reftableid,
                    label: data.reftabdesc,
                    id: data.refobjid,
                    serviceId: data.serviceId
                  });
                } else {
                  const messageData = {
                    mask: true,
                    title: this.$t('feedback.warning'),
                    content: this.$t('messages.setAssociationTable')
                  };
                  this.$Modal.fcWarning(messageData);
                }
              }
              event.stopPropagation();
            }
          }
        },);
      },
      imageRender(colname) {
        return (h, params) => {
          if (!params.row[colname]) {
            return null;
          }
          return h('div', [
            h('Poptip', {
              style: {},
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
      docRender() {
        return (h, params) => {
          if (!params.row[params.column.colname]) {
            return null;
          }
          const data = JSON.parse(params.row[params.column.colname]);
          let html = '';
          data.forEach((item) => {
            html += `<span class="doc-wrapper"><a href="${item.url}"><i class="iconfont iconmd-document" data-target-tag="fkIcon" style="color: #20a0ff; cursor: pointer; font-size: 16px" ></i> ${item.name}</a></span>`;
          });
          return h('div', {
            domProps: {
              innerHTML: html
            }
          });
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
      switchRender(data) {
        // 开关选择器
        return (h, data) => h('div',
                              [
                                h('i-switch', {
                                  on: {
                                    'on-change': (status) => {
                                      this.$Message.info(`${this.$t('messages.switchStatus')}：${status === true ? this.$t('tips.open') : this.$t('tips.close')}`);
                                    }
                                  },

                                  props: {
                                    value: true,
                                    size: 'small',
                                    // disabled: true
                                  },

                                  // class: `iconfont  ${
                                  //   params.row.status === 1 || params.row.status === 3
                                  //     ? 'icon-jmc_error'
                                  //     : 'icon-jmc_right'
                                  // }`,
                                  style: {
                                    // background: `${
                                    //   // params.row.status == 1 ? '#5b85e4' : '#ccc'
                                    // }`,
                                    // marginRight: '2px'
                                  }
                                })
                              ]);
      },
      commandRender(data) {
        const params = [
          {
            label: this.$t('buttons.edit'),
            type: 'fcdefault',
            display: 'dialog',
            component: 'commonTable/componentName',
            disabled: false,
            dialogTitle: this.$t('tips.popUp')
          },
          {
            label: this.$t('buttons.delete'),
            type: 'fcdefault',
            display: 'delete',
            disabled: false

          },
          {
            label: this.$t('buttons.jump'),
            type: 'fcdefault',
            display: 'url',
            url: '',
            disabled: false

          }
        ];
        // display按钮操作类型（3种）
        // 跳转/弹出框/删除/
        return (h, param) => params.map(item => h('ButtonGroup',
                                                  [
                                                    h('i-Button', {
                                                      on: {
                                                        click: () => {
                                                          if (item.display === 'dialog') {
                                                            this.$refs.dialogRef.open();
                                                            const title = `${item.dialogTitle}`;
                                                            this.dialogConfig = {
                                                              title,
                                                            };
                                                            this.dialogConfig.footerHide = true;
                                                            const url = item.component;
                                                            const index = url.lastIndexOf('/');
                                                            const filePath = url.substring(index + 1, url.length);
                                                            this.dialogComponentName = filePath;
                                                          }
                                                        }
                                                      },

                                                      props: {
                                                        type: item.type,
                                                        disabled: item.disabled,
                                                        size: 'small'
                                                      },
                                                      style: {
                                                        marginRight: '10px'
                                                      }
                                                    }, item.label)
                                                  ]));
      }
    }
  };
</script>
