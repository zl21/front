<template>
  <div ref="dataPermission" :class="classes">
    <div class="buttonGroup">
      <Button
        type="fcdefault"
        class="Button"
        @click="leftRefreshClick"
      >
        {{$t('buttons.refresh')}}
      </Button>
    </div>
    <div class="content">
      <div class="contentLeft">
        <Input
          :placeholder="$t('messages.enterRole')"
          clearable
          icon="ios-search"
          @on-clear="searchInputClear"
          @on-change="searchInputChange"
        >
        <span slot="prepend">{{$t('buttons.find')}}</span>
        </Input>
        <div class="menuContainer">
          <Tree
            ref="menuTree"
            :data="menuTreeData"
            :query="menuTreeQuery"
            @on-select-change="menuTreeChange"
          ></Tree>
        </div>
      </div>
      <div class="contentRight">
        <div class="buttonGroup rightButton">
          <Button
            type="fcdefault"
            class="Button"
            @click="saveClick"
          >
            {{$t('buttons.save')}}
          </Button>
          <Button
            type="fcdefault"
            class="Button"
            @click="rightRefreshClick"
          >
            {{$t('buttons.refresh')}}
          </Button>
          <Button
            type="fcdefault"
            class="Button"
            @click="addClick"
          >
            {{$t('buttons.add')}}
          </Button>
          <Button
            type="fcdefault"
            class="Button"
            @click="deleteClick"
          >
            {{$t('buttons.delete')}}
          </Button>
        </div>
        <div class="rightTable">
          <Table
            class="table"
            :height="true"
            :data="tableData"
            :columns="columns"
            @on-select="tableSelect"
            @on-select-all="tableSelectAll"
            @on-select-all-cancel="tableSelectCancelAll"
          ></Table>
        </div>
      </div>
    </div>
    <Modal
      v-model="dataPermissionModal"
      mask
      :width="880"
      class="dataPermissionDialog"
      :title="$t('messages.dataFilterSetting')"
      @on-ok="dataPermissionModalConfirm"
      @on-cancel="dataPermissionModalCancel"
    >
      <div
        v-if="dataPermissionModal"
        class="dataPermissionContainer"
      >
        <div class="dataPermissionContainerLeft">
          <div class="buttonGroup">
            <Button
              type="primary"
              class="Button"
              @click="dataPermissionSearch"
            >
              {{$t('buttons.search')}}
            </Button>
            <Button
              type="fcdefault"
              class="Button"
              @click="screenCondition"
            >
              {{$t('messages.chooseFilterCriteria')}}
            </Button>
            <Button
              type="fcdefault"
              class="Button"
              @click="screenResult"
            >
              {{$t('messages.chooseFilterResults')}}
            </Button>
          </div>
          <div
            v-if="screenConditionData.length > 0"
            class="searchContainer"
          >
            <DownComponent
              :search-foldnum="3"
              :row-all="screenConditionData.length / 2"
              :set-height="34"
            >
              <div
                slot="dwonContent"
                class="searchContent"
              >
                <div
                  v-for="(item, index) in screenConditionData"
                  :key="index"
                  class="searchItem"
                >
                  <!--<div class="searchItemLabel" ><i class="iconfont iconios-create-outline" style="color: #108EE9; cursor: pointer; font-size: 12px" @click="environmentVariableIconClick(index)"></i> {{item.NAME}}:</div>-->
                  <div class="searchItemLabel">
                    {{ item.NAME }}:
                  </div>
                  <DropDownSelectFilter
                    v-if="item.display === 'OBJ_FK'"
                    class="searchItemCom"
                    :single="false"
                    :total-row-count="item.totalRowCount"
                    :page-size="20"
                    :auto-data="multipleAutoData"
                    :columns-key="['ID','NAME']"
                    :data="multipleDropData"
                    :default-selected="item.defaultSelected"
                    @on-fkrp-selected="(val, instance) => multipleDropSelected(val, instance, index)"
                    @on-page-change="(val) => multipleDropPageChange(val, index)"
                    @on-popper-hide="multiplePopperHide"
                    @on-popper-show="(instance) => multiplePopperShow(instance, index)"
                    @on-clear="(instance) => multipleDropClear(instance, index)"
                    @on-input-value-change="(val) => multipleInputChange(val, index)"
                  >
                  </DropDownSelectFilter>
                  <Select
                    v-else-if="item.display === 'OBJ_SELECT'"
                    v-model="item.defaultValue"
                    multiple
                    class="searchItemCom"
                    label-in-value
                    transfer
                    clearable
                    @on-clear="selectOnClear(index)"
                    @on-change="(val) => selectOnChange(val, index)"
                  >
                    <Option
                      v-for="tem in item.combobox"
                      :key="tem.limitval"
                      :value="tem.limitval"
                    >
                      {{ tem.limitdesc }}
                    </Option>
                  </Select>
                  <Input
                    v-else
                    v-model="item.defaultValue"
                    class="searchItemCom"
                    clearable
                    @on-clear="inputOnClear(index)"
                    @on-change="(e) => inputOnChange(e, index)"
                  />
                </div>
              </div>
            </DownComponent>
          </div>
          <div class="pageContainer">
            <Page
              :total="pageTotal"
              :page-size-opts="pageSizeOpts"
              :page-size="pageSize"
              :current="currentPage"
              class="table-page"
              size="small"
              show-elevator
              show-sizer
              show-total
              @on-change="pageChangeEvent"
              @on-page-size-change="pageSizeChangeEvent"
            ></Page>
          </div>
          <div class="tableContainer">
            <Table
              ref="table"
              :columns="dataPermissionColumns"
              class="table"
              :height="true"
              :data="dataPermissionTableData"
              highlight-row
              @on-row-click="tableRowClick"
              @on-row-dblclick="tableRowDbclick"
            ></Table>
          </div>
        </div>
        <div class="dataPermissionContainerRight">
          <div class="selectedContainerTitle">
            <div>{{$t('feedback.selected')}}（<span style="color: #F34141; font-weight: bold">{{ selectedNum }}</span>）{{$t('tips.piece')}}</div>
            <i
              class="iconfont iconbj_delete selectedDataDeleteAllIcon"
              @click="selectedDataDeleteAll()"
            ></i>
          </div>
          <div class="selectedContainerData">
            <div
              v-for="(item, index) in selectedDataList"
              :key="index"
              class="selectedDataItem"
            >
              <div class="selectedDataItemLabel">
                {{ item.label }}
              </div>
              <i
                class="iconfont iconbj_delete2 selectedDataItemIcon"
                @click="selectedDataDelete(index)"
              ></i>
            </div>
          </div>
        </div>
      </div>
    </Modal>
    <Modal
      v-model="environmentVariableModal"
      mask
      :width="320"
      class="environmentVariableDialog"
      :title="$t('messages.envVariableSetting')"
      @on-ok="environmentVariableConfirm"
      @on-cancel="environmentVariableCancel"
    >
      <div class="environmentVariableContainer">
        <div class="environmentVariableLabel">
          {{$t('tips.envVariable')}}：
        </div>
        <Input
          v-model="environmentVariableValue"
          clearable
        />
      </div>
    </Modal>
    <Spin
      v-show="spinShow"
      fix
    >
      <Icon
        type="ios-loading"
        size="48"
        class="demo-spin-icon-load"
      ></Icon>
      <div>Loading</div>
    </Spin>
  </div>
</template>

<script>
  /* eslint-disable arrow-parens,no-lonely-if,no-empty,no-return-assign,no-unused-expressions,arrow-body-style */
  import network, { urlSearchParams } from '../../__utils__/network';

  import DownComponent from '../../__component__/DownComponent.vue';
  import ComAttachFilter from '../../__component__/ComAttachFilter.vue';

  import {
    Version,
    classFix
  } from '../../constants/global';

  export default {
    data() {
      return {
        spinShow: false, // loading是否显示
        Version: Version(), // 版本控制
        tableSaveData: [], // 保存表格修改的的数据
        tableDeleteData: [], // 保存表格删除数据

        menuHighlightIndex: 0, // 菜单高亮的index
        menuList: [], // 菜单数据
        groupId: '', // 菜单id
        groupName: '', // 菜单名字
        newGroupId: '', // 切换菜单时，当前切换的id

        menuTreeData: [], // 菜单树数据
        menuTreeQuery: '', // 菜单树检索的值

        columns: [], // 右边表格，表头数据
        tableData: [], // 右边表格，标题数据
        comAttachFilterServiceId: 'ad-app', // 弹窗单选serviceId
        configPermissionTableIndex: null, // 当前设置权限的，表格的row index

        /* 数据权限 */
        dataPermissionModal: false, // 数据权限弹窗
        screenTableName: '', // screen接口的tableName
        screenServiceId: '', // screen接口和screenresult接口的serviceId
        searchCondition: {}, // screenresult接口的搜索条件

        screenConditionData: [], // 渲染搜索条件的数据
        screenConditionDataIndex: null, // 环境变量icon点击的搜索条件的下标
        multipleAutoData: [], // 下拉多选模糊搜索的数据
        multipleDropData: {}, // 下拉多选表格数据
        multipleDropPage: 1, // 下拉多选的页码

        pageTotal: 0, // 数据权限弹窗分页总条数
        pageSizeOpts: [10, 20, 30, 40], // 数据权限弹窗更改每页多少条
        pageSize: 10, // 数据权限页码，每页的条数
        currentPage: 1, // 数据权限弹窗分页的当前页码

        dataPermissionColumns: [], // 数据权限表头数据
        dataPermissionTableData: [], // 数据权限表体数据
        selectTableKey: '', // 数据权限弹窗的表格选中时要在右边显示的表格数据的key
        selectTableObj: {}, // 数据权限表格选中的数据

        selectedNum: 0, // 数据权限弹窗右边已选中的条数
        selectedDataList: [], // 右边已选择的数据
        multipleDropSelectedData: {}, // 保存筛选条件多选下拉框选择的数据

        /* 环境变量弹窗 */
        environmentVariableModal: false,
        environmentVariableValue: '', // 环境变量输入框里的值
      };
    },
    components: {
      // eslint-disable-next-line vue/no-unused-components
      ComAttachFilter, DownComponent
    },
    watch: {
      dataPermissionModal(val) {
        if (!val) {
          this.searchCondition = {};
        }
      }
    },
    computed: {
      classes: () => `${classFix}dataPermission dataPermission_Version`
    },
    created() {
      if (this.Version === '1.3') {
        setTimeout(() => {
          this.$el.innerHTML = this.$t('feedback.notSupportedFeature');
        }, 50);
      } else {
        this.leftRefreshClick();
      }
    },
    methods: {
      menuClick(index, item) {
        this.menuHighlightIndex = index;
        this.groupId = item.ID;
        const treePromise = new Promise((resolve, reject) => {
          this.getTreeData(resolve, reject);
        });
        treePromise.then(() => {
          this.getTableData();
        });
      }, // 点击左侧的菜单
      searchInputChange(e) {
        this.menuTreeQuery = e.target.value;
      }, // 检索输入框值改变
      searchInputClear() {
        this.menuTreeQuery = '';
      }, // 检索输入框清空
      getTableData() {
        network.post('/p/cs/QueryList', urlSearchParams({
          searchdata: {
            table: 'ad_data_permission',
            startindex: 0,
            range: 100,
            column_include_uicontroller: true,
            orderby: [],
            fixedcolumns: {
              GROUPS_ID: this.groupId
              // GROUPS_ID: 552
            }
          }
        })).then((res) => {
          if (res.data.code === 0) {
            this.tableDeleteData = [];
            this.tableSaveData = [];
            const defaultColumns = [
              {
                type: 'selection',
                width: 40,
                align: 'right',
              },
              {
                type: 'index',
                width: 60,
                align: 'left',
                title: this.$t('table.index')
              }
            ];
            this.columns = defaultColumns.concat(res.data.data.tabth.reduce((acc, cur) => {
              cur.title = cur.name;
              cur.key = cur.colname;
              if (cur.colname === 'AD_TABLE_ID') {
                cur.render = this.permissionTableRender(); // 权限表的render
              } else if (cur.colname === 'ISACTIVE') {
                cur.fixed = 'right';
                cur.render = this.availableRender(); // 可用的render
              } else if (cur.colname === 'SQLFILTER') {
                cur.render = this.sqlfilterRender();
              }
              if (cur.colname !== 'ID') {
                acc.push(cur);
              }
              return acc;
            }, []));

            this.tableData = res.data.data.row.reduce((acc, cur) => {
              const obj = {
                isEditPermissionTable: false
              };
              Object.keys(cur).forEach((item) => {
                obj[item] = cur[item].val;
              });
              acc.push(obj);
              return acc;
            }, []);
          }
        });
      }, // 获取表格数据
      /**/
      // permissionTableRender() {
      //   return (h, params) => {
      //     if (!params.row.isEditPermissionTable) {
      //       return h('div', {
      //         style: {
      //           display: 'flex',
      //           'align-items': 'center'
      //         }
      //       }, [
      //         h('AttachFilter', {
      //           style: {
      //             width: '150px',
      //             'margin-right': '5px'
      //           },
      //           props: {
      //             // 弹窗单选的icon
      //             filtericon: 'iconbj_tcdan',
      //             // 是否显示输入完成后是否禁用 true、false
      //             show: true,
      //             // 是否显示筛选提示弹窗 true、false
      //             filterTip: true,
      //             // 是否选中后禁止编辑 true、false
      //             enterType: true,
      //             // 是否回车选中第一行
      //             disabled: false,
      //             // 默认提示框
      //             placeholder: null,
      //             // 定义选中展示的文字的key
      //             hideColumnsKey: ['id'],
      //             // 配置弹窗的配置项 model
      //             dialog: {
      //               model: {
      //                 title: params.column.fkdesc,
      //                 mask: true,
      //                 draggable: true,
      //                 scrollable: true,
      //                 'footer-hide': true,
      //                 width: 720
      //               }
      //             }
      //           },
      //           nativeOn: {
      //           },
      //           scopedSlots: {
      //             daigo: () => h(components.PopDialog, {
      //               props: {
      //                 fkobj: {
      //                   reftable: params.column.reftable,
      //                   reftableid: params.column.reftableid,
      //                   colid: params.row.rowItem[params.column.colname].colid,
      //                   show: false,
      //                   url: ''
      //                 }
      //               }
      //             })
      //           },
      //           on: {
      //             'on-show': (value, item) => { // 当气泡拉展开时去请求数据
      //             },
      //             'on-ok': ($this) => {
      //             },
      //             'on-clear': () => {
      //             },
      //             'on-popclick': (event, row, targName, $this) => {
      //             },
      //             'on-change': (data, data2, value) => {
      //             },
      //             'on-blur': (data, event, value) => {
      //             },
      //             'on-select': (data) => {
      //             }
      //           }
      //         }),
      //         h('div', {
      //           domProps: {
      //             innerHTML: params.row.SQLFILTER ? '<i class="iconfont icondata-set" style="color: #108EE9; cursor: pointer; font-size: 12px" ></i>' : '<i class="iconfont icondata-set" style="color: #575757; cursor: pointer; font-size: 12px" ></i>'
      //           },
      //           on: {
      //             click: () => {
      //               this.dataPermissionModal = true;
      //             }
      //           }
      //         })
      //       ]);
      //     }
      //     return h('div', {
      //       style: {
      //         display: 'flex',
      //         'align-items': 'center'
      //       }
      //     }, [
      //       h('div', {
      //         style: {
      //           'margin-right': '5px'
      //         },
      //         domProps: {
      //           innerHTML: `<span>${params.row[params.column.colname]}</span>`
      //         }
      //       }),
      //       h('div', {
      //         domProps: {
      //           innerHTML: params.row.SQLFILTER ? '<i class="iconfont icondata-set" style="color: #108EE9; cursor: pointer; font-size: 12px" ></i>' : '<i class="iconfont icondata-set" style="color: #575757; cursor: pointer; font-size: 12px" ></i>'
      //         },
      //       })
      //     ]);
      //   };
      // },
      permissionTableRender() {
        return (h, params) => {
          if (params.row.isEditPermissionTable) {
            return h('div', {
              style: {
                display: 'flex',
                'align-items': 'center'
              }
            }, [
              h(ComAttachFilter, {
                style: {
                  width: '150px',
                  'margin-right': '5px'
                },
                class:'datapermission-div',
                props: {
                  defaultValue: params.row[params.column.colname],
                  propstype: {
                    fuzzyUrl:'/p/cs/fuzzyQueryDataPermissionTabl',
                    AutoData: [],
                    ...params.column,
                    fkdisplay: 'pop',
                    // 是否显示输入完成后是否禁用 true、false
                    show: false,
                    // 是否显示筛选提示弹窗 true、false
                    filterTip: true,
                    // 是否选中后禁止编辑 true、false
                    enterType: true,
                    // 是否回车选中第一行
                    disabled: false,
                    // 默认提示框
                    placeholder: null,
                    // 定义选中展示的文字的key
                    hideColumnsKey: ['id'],
                    // 配置弹窗的配置项 model
                    dialog: {
                      model: {
                        title: params.column.fkdesc,
                        mask: true,
                        draggable: true,
                        scrollable: true,
                        'footer-hide': true,
                        width: 920
                      }
                    },
                    fkobj: {
                      serviceId: this.comAttachFilterServiceId,
                      reftable: params.column.reftable,
                      reftableid: params.column.reftableid,
                      colid: 99136,
                      show: false,
                      url: ''
                    }
                    // 模糊查询的文字信息，支持多列
                  },
                  defaultSelected: [
                    {
                      Label: '',
                      ID: ''
                    }
                  ]
                },
                nativeOn: {
                },
                on: {
                  valuechange: (item, instance) => {
                    if (item.selected.length > 0 && item.selected[0].ID === '') {
                      this.tableData[params.index][params.column.colname] = '';
                      this.tableData[params.index].COLUMNNAME = '';
                      this.tableData[params.index].SQLFILTER = '';
                      this.selectedDataList = [];
                      this.tableDeleteData = [];
                    }

                    if (item.selected.length > 0 && item.selected[0].ID) {
                      const findTableIndex = this.tableData.findIndex((cur, index) => {
                        if (index !== params.index) {
                          return cur[params.column.colname] === item.selected[0].Label;
                        }
                        return false;
                      });

                      if (findTableIndex === -1) {
                        this.tableData[params.index][params.column.colname] = item.selected[0].Label;
                        this.tableData[params.index][`${params.column.colname}_Value`] = item.selected[0].ID;
                        item.selected[0].Label ? this.tableData[params.index].COLUMNNAME = `${item.selected[0].Label}_ID` : this.tableData[params.index].COLUMNNAME = '';
                        this.tableData[params.index].SQLFILTER = '';
                        this.tableDeleteData = [];
                      } else {
                        const data = {
                          mask: true,
                          title: this.$t('feedback.alert'),
                          content: this.$t('messages.permissionHasSet'),
                          onOk: () => {
                            // params.row[params.column.colname] = '';
                            instance.attachFilterClear();
                            this.tableData[params.index][params.column.colname] = '';
                            this.tableData[params.index].COLUMNNAME = '';
                            this.tableData[params.index].SQLFILTER = '';
                            this.selectedDataList = [];
                            this.tableDeleteData = [];
                          }
                        };
                        this.$Modal.fcWarning(data);
                      }
                    }
                  },
                }
              }),
              h('div', {
                domProps: {
                  innerHTML: params.row.SQLFILTER ? '<i class="iconfont icondata-set" style="color: #108EE9; cursor: pointer; font-size: 12px" ></i>' : '<i class="iconfont icondata-set" style="color: #575757; cursor: pointer; font-size: 12px" ></i>'
                },
                on: {
                  click: () => {
                    this.dataPermissionIconClick(params);
                  }
                }
              })
            ]);
          }
          return h('div', {
            style: {
              display: 'flex',
              'align-items': 'center'
            }
          }, [
            h('div', {
              style: {
                'margin-right': '5px'
              },
              domProps: {
                innerHTML: `<span>${params.row[params.column.colname]}</span>`
              }
            }),
            h('div', {
              domProps: {
                innerHTML: params.row.SQLFILTER ? '<i class="iconfont icondata-set" style="color: #108EE9; cursor: pointer; font-size: 12px" ></i>' : '<i class="iconfont icondata-set" style="color: #575757; cursor: pointer; font-size: 12px" ></i>'
              },
              on: {
                click: () => {
                  this.dataPermissionIconClick(params);
                }
              }
            })
          ]);
        };
      },
      dataPermissionIconClick(params) {
        this.configPermissionTableIndex = params.index;
        this.screenTableName = params.row[params.column.colname];
        if (this.screenTableName) {
          const serviceIdPromise = new Promise((res, rej) => {
            this.getTableServiceId(res, rej);
          });
          serviceIdPromise.then(() => {
            this.getSearchConditionData();
            this.getSearchResultTableData();
          });
          if (params.row.SQLFILTER) {
            this.selectedDataList = JSON.parse(params.row.SQLFILTER).lists.result.reduce((acc, cur) => {
              acc.push({
                label: cur.screen_string,
                value: cur.screen,
                copyValue: cur.copyScreen ? cur.copyScreen : ''
              });
              return acc;
            }, []);
            serviceIdPromise.then(() => {
              this.getScreenResultCheckData();
            });
          }
          this.dataPermissionModal = true;
        } else {
          this.$Message.warning(this.$t('messages.selectPermission'));
        }
      }, // 数据权限icon点击
      availableRender() {
        return (h, params) => {
          return h('i-switch', {
            props: {
              value: params.row[params.column.colname] ? params.column.combobox.find(item => item.limitdesc === params.row[params.column.colname]).limitdis : false,
              size: 'small',
            },
            on: {
              'on-change': (val) => {
                if (val) {
                  this.tableData[params.index][params.column.colname] = '是';
                } else {
                  this.tableData[params.index][params.column.colname] = '否';
                }
                this.tableDeleteData = [];
                const tableRowData = this.tableData[params.index];
                if (tableRowData.ID === -1) {
                  this.getEditData(tableRowData);
                } else {
                  this.getEditData({
                    ID: tableRowData.ID,
                    SQLFILTER: tableRowData.SQLFILTER,
                    ISACTIVE: tableRowData.ISACTIVE
                  });
                }
              }
            }
          });
        };
      }, // 可用的render
      sqlfilterRender() {
        return (h, params) => {
          let sqlfilterData = '';
          if (params.row[params.column.colname]) {
            const data = JSON.parse(params.row[params.column.colname]);
            sqlfilterData = data.lists.result.reduce((acc, cur) => {
              acc.push(cur.screen_string);
              return acc;
            }, [])
              .join('; ');
          }
          return h('div', {
            domProps: {
              innerHTML: `<span>${sqlfilterData}</span>`
            }
          });
        };
      }, // 过滤添加的render的render
      getMenuData(resolve, reject) {
        network.post('/p/cs/groupTreeload')
          .then((res) => {
            resolve();
            if (res.data.code === 0) {
              // this.menuHighlightIndex = 0;
              // this.menuList = res.data.data;
              // this.groupId = this.menuList[this.menuHighlightIndex].ID;
              this.groupId = res.data.data[0].ID;
              this.groupName = res.data.data[0].NAME;
              this.newGroupId = res.data.data[0].ID;
              this.menuTreeData = this.restructureMenuTreeData(res.data.data, true);
            } else {
              reject();
            }
          })
          .catch((err) => {
            reject();
            throw err;
          });
      }, // 获取菜单数据
      restructureMenuTreeData(data, first) {
        return data.map((item, idx) => {
          item.title = item.NAME;
          if (first && idx === 0) {
            item.selected = true;
          }
          if (item.children && item.children.length > 0) {
            this.restructureMenuTreeData(item.children);
          }
          return item;
        });
      }, // 重构树数据
      menuTreeChange(val, item) {
        this.groupId = item.ID;
        this.groupName = item.NAME;
        this.getTableData();
        this.tableSaveData = [];
        this.tableSaveData = [];
      }, // 左侧菜单树点击
      getSearchConditionData() {
        network.post('/p/cs/screen_data_permission', urlSearchParams({
          // param: { TABLENAME: 'USER_DEPT' }
          param: { TABLENAME: this.screenTableName }
        }), {
          // serviceId: 'ad-app'
          // serviceId: 'mboscloud-app'
          serviceId: this.screenServiceId
        }).then((res) => {
          this.screenConditionData = res.data.data.reduce((acc, cur) => {
            if (cur.display === 'OBJ_FK') {
              cur.totalRowCount = cur.VALUE.length;
              cur.defaultSelected = [];
            } else {
              cur.defaultValue = '';
            }
            acc.push(cur);
            return acc;
          }, []);
        });
      }, // 获取数据权限弹窗搜索条件的数据
      getTableServiceId(resolve, reject) {
        network.post('/p/cs/get_service_id', {
          // TABLE_NAME: 'USER_DEPT'
          TABLE_NAME: this.screenTableName
        }).then((res) => {
          if (res.data.code === 0) {
            resolve();
            this.screenServiceId = res.data.data.serviceId;
          } else {
            reject();
          }
        });
      }, // 获取数据权限弹窗搜索条件的数据
      getSearchResultTableData() {
        network.post('/p/cs/screenresult', urlSearchParams({
          param: {
            // TABLENAME: 'USER_DEPT',
            TABLENAME: this.screenTableName,
            CONDITION: this.searchCondition,
            GLOBAL: '',
            PAGENUM: this.currentPage,
            PAGESIZE: this.pageSize
          }
        }), {
          // serviceId: 'mboscloud-app'
          serviceId: this.screenServiceId
        }).then((res) => {
          this.pageTotal = Number(res.data.data.data.total||0);
          if (res.data.data.refakname && Object.keys(res.data.data.refakname).length > 0) {
            this.dataPermissionTableData = res.data.data.data.list.reduce((acc, cur) => {
              const obj = {};
              Object.keys(cur).forEach((item) => {
                if (item === 'ID') {
                  obj.ID = cur.ID;
                } else if (res.data.data.refakname[item]) {
                  obj[item] = res.data.data.refakname[item].find(ite => ite.ID === cur[item]) ? res.data.data.refakname[item].find(ite => ite.ID === cur[item]).NAME : '';
                } else {
                  obj[item] = cur[item];
                }
              });
              acc.push(obj);
              return acc;
            }, []);
          } else {
            this.dataPermissionTableData = res.data.data.data.list;
          }
          const headerData = JSON.parse(res.data.data.header);
          const headerDataArr = Object.keys(headerData);
          if (headerDataArr[0] === 'ID') {
            this.selectTableKey = headerDataArr[1];
          } else {
            this.selectTableKey = headerDataArr[0];
          }
          this.dataPermissionColumns = [{
            title: this.$t('table.index'),
            render: this.serialNumberRender()
          }].concat(Object.keys(headerData).reduce((acc, cur) => {
            const obj = {};
            if (cur !== 'ID') {
              obj.title = headerData[cur];
              obj.key = cur;
              acc.push(obj);
            }
            return acc;
          }, []));
        });
      }, // 获取数据权限弹窗搜索条件的数据
      serialNumberRender() {
        return (h, params) => {
          const serialNumber = (this.currentPage - 1) * this.pageSize;
          return h('div', {
            domProps: {
              innerHTML: `<span>${serialNumber + params.index + 1}</span>`
            }
          });
        };
      }, // 数据权限弹窗表格序号render
      getScreenResultCheckData() {
        const inIdList = this.selectedDataList.reduce((acc, cur) => {
          if (cur.value && typeof cur.value === 'number' || 'string') {
            acc.push(cur.value);
          }
          return acc;
        }, []);
        const conditionArr = this.selectedDataList.reduce((acc, cur) => {
          if (cur.value && typeof cur.value === 'object') {
            acc.push(cur.value);
          }
          return acc;
        }, []);
        network.post('/p/cs/screenresultcheck', urlSearchParams({
          param: {
            // TABLENAME: 'USER_DEPT',
            TABLENAME: this.screenTableName,
            CONDITION: conditionArr,
            GLOBAL: '',
            IN: inIdList,
            PAGENUM: this.currentPage,
            PAGESIZE: this.pageSize
          }
        }), {
          // serviceId: 'mboscloud-app'
          serviceId: this.screenServiceId
        }).then((res) => {
          if (res.data.code === 0) {
            this.selectedNum = res.data.data.data.total;
          }
        });
      }, // 获取数据权限弹窗搜索条件的数据
      saveClick() {
        const promiseArr = [];
        if (this.checkTableRowData()) {
          if (this.tableSaveData.length > 0) {
            this.tableSaveData.forEach((item, index) => {
              index = new Promise((resolve, reject) => {
                this.saveRequest(item, resolve, reject);
              });
              promiseArr.push(index);
            });
            Promise.all(promiseArr).then(() => {
              this.$Message.success(this.$t('feedback.saveSuccess'));
              this.tableSaveData = [];
              this.getTableData();
            });
          } else {
            this.$Message.warning(this.$t('messages.noDataSave'));
          }
        }
      }, // 保存按钮点击触发
      saveRequest(obj, resolve, reject) {
        const saveObj = JSON.parse(JSON.stringify(obj));
        if (obj.ID === -1) {
          saveObj.AD_TABLE_ID = parseInt(saveObj.AD_TABLE_ID_Value);
          delete saveObj.AD_TABLE_ID_Value;
        }
        saveObj.GROUPS_ID = this.groupId;
        delete saveObj.ID;

        const fixedData = {
          AD_DATA_PERMISSION: saveObj
        };
        network.post('/p/cs/objectSave', {
          table: 'AD_DATA_PERMISSION', // 主表表名
          objId: obj.ID, // 明细id
          fixedData
        }).then((res) => {
          if (res.data.code === 0) {
            resolve();
          } else {
            reject();
          }
        });
      }, // 调保存的接口
      leftRefreshClick() {
        new Promise((resolve, reject) => {
          this.getMenuData(resolve, reject);
        }).then(() => {
          this.getTableData();
        });
      }, // 左侧刷新按钮点击
      rightRefreshClick() {
        this.getTableData();
      }, // 右侧刷新按钮点击
      checkTableAllSaveData() {
        return this.tableData.every((item) => {
          if (item.isEditPermissionTable) {
            return false;
          }
          return true;
        });
      }, // 校验表格是否有未保存的数据
      checkTableRowData() {
        return this.tableData.every((item, index) => {
          if (item.isEditPermissionTable) {
            if (item.AD_TABLE_ID === '') {
              this.$Message.warning(this.$t('messages.selectPermissionTable', {num:index + 1}));
              return false;
            }
            if (item.SQLFILTER === '') {
              this.$Message.warning(this.$t('messages.setDataPermissions', {num:index + 1}));
              return false;
            }
            return true;
          }
          return true;
        });
      }, // 校验表格数据是否填完整
      addClick() {
        const isAdd = this.checkTableRowData();
        if (isAdd) {
          const obj = {
            ID: -1,
            GROUPS_ID: this.groupName,
            AD_TABLE_ID: '',
            COLUMNNAME: '',
            ISACTIVE: '是',
            SQLFILTER: '',
            isEditPermissionTable: true
          };
          this.tableData.push(obj);
        }
      }, // 新增按钮点击触发
      deleteClick() {
        if (this.tableDeleteData.length > 0) {
          if (this.checkTableAllSaveData()) {
            this.$Modal.fcWarning({
              title: this.$t('feedback.alert'),
              mask: true,
              showCancel: true,
              content: this.$t('messages.confirmDelete'),
              onOk: () => {
                network.post('/p/cs/batchDelete', {
                  tableName: 'AD_DATA_PERMISSION', // 主表表名
                  ids: this.tableDeleteData
                }).then((res) => {
                  if (res.data.code === 0) {
                    this.$Message.success(res.data.message);
                    this.getTableData();
                  }
                });
              }
            });
          } else {
            this.$Modal.fcWarning({
              title: this.$t('feedback.alert'),
              mask: true,
              content: this.$t('messages.unsavedData'),
              onOk: () => {
              }
            });
          }
        } else {
          this.$Modal.fcWarning({
            title: this.$t('feedback.alert'),
            mask: true,
            content: this.$t('messages.chooseDeleteData'),
            onOk: () => {
            }
          });
        }
      }, // 删除按钮点击触发
      tableSelect(arr) {
        this.tableDeleteData = arr.reduce((acc, cur) => {
          // if (cur.ID !== -1) {
          acc.push(parseInt(cur.ID));
          // }
          return acc;
        }, []);
      }, // 多选模式下，表格选中某一项触发
      tableSelectAll(arr) {
        this.tableDeleteData = arr.reduce((acc, cur) => {
          // if (cur.ID !== -1) {
          acc.push(parseInt(cur.ID));
          // }
          return acc;
        }, []);
      }, // 多选模式下，表格全选触发
      tableSelectCancelAll() {
        this.tableDeleteData = [];
      }, // 表格全部取消时触发
      dataPermissionSearch() {
        this.currentPage = 1;
        this.getSearchResultTableData();
      }, // 数据权限弹窗的查找按钮
      screenCondition() {
        let labelStr = '';
        const idValue = {};
        let copyValue = '';
        let labelIndex = 0;
        if (Object.keys(this.multipleDropSelectedData).length > 0) {
          this.screenConditionData.forEach((item, index) => {
            if (this.multipleDropSelectedData[item.AKNAME] && Object.keys(this.multipleDropSelectedData[item.AKNAME].length > 0)) {
              labelIndex += 1;
              if (labelIndex > 1) {
                labelStr += ` ${this.$t('tips.and')} `;
              }
              if (this.multipleDropSelectedData[item.AKNAME].copyValue) {
                copyValue = this.multipleDropSelectedData[item.AKNAME].copyValue;
              }
              labelStr += `${item.NAME}${this.$t('tips.contain')}（${this.multipleDropSelectedData[item.AKNAME].label}）`;
              idValue[item.AKNAME] = this.multipleDropSelectedData[item.AKNAME].value;
            }
          });
          this.selectedDataList.push({ label: labelStr, value: idValue, copyValue });
          this.screenConditionData.map(item => {
            if (item.defaultValue) {
              item.defaultValue = '';
            }
            if (item.defaultSelected) {
              item.defaultSelected = [];
            }
            return item;
          });
          setTimeout(() => {
            this.getScreenResultCheckData();
          }, 0);
          this.multipleDropSelectedData = {};
          this.searchCondition = {};
          this.getSearchResultTableData();
        } else {
          this.$Message.warning(this.$t('messages.selectFilterCriteria'));
        }
      }, // 数据权限弹窗的筛选条件按钮
      screenResult() {
        if (Object.keys(this.selectTableObj).length > 0) {
          this.toShowTableSelectedData();
          this.getScreenResultCheckData();
        } else {
          this.$Message.warning(this.$t('messages.selectFilterResults'));
        }
      }, // 数据权限弹窗的筛选结果按钮
      multipleDropSelected(val, instance, index) {
        const idArr = val.reduce((acc, cur) => {
          acc.push(cur.ID);
          return acc;
        }, []);
        this.searchCondition[this.screenConditionData[index].AKNAME] = idArr;
        setTimeout(() => {
          this.multipleDropSelectedData[this.screenConditionData[index].AKNAME] = {
            label: instance.inputValue,
            value: idArr
          };
        }, 10);
      }, // 下拉多选，选中值时触发
      multipleDropPageChange(val, index) {
        this.multipleDropPage = val;
        this.getMultipleDropData(index);
      }, // 下拉多选分页时触发
      multiplePopperHide() {

      }, // 下拉多选气泡隐藏时触发
      getMultipleDropData(index) {
        this.multipleDropData = {};
        const startIndex = this.multipleDropPage * 20 - 20;
        const endIndex = this.multipleDropPage * 20;
        this.multipleDropData.tabth = [{ colname: 'ID', name: '', isak: false }, { colname: 'VALUE', name: '', isak: false }, { colname: 'NAME', name: '', isak: true }];
        this.multipleDropData.row = this.screenConditionData[index].VALUE.filter((item, idx) => idx >= startIndex && idx < endIndex)
          .reduce((acc, cur) => {
            const obj = {};
            Object.keys(cur).forEach((ite) => {
              obj[ite] = {
                val: cur[ite]
              };
            });
            obj.VALUE = {
              val: cur.ID
            };
            acc.push(obj);
            return acc;
          }, [])
          .concat([]);
        this.multipleDropData.start = this.multipleDropPage * 20 - 20;
        this.multipleDropData = Object.assign(this.multipleDropData, {});
      }, // 获取下拉多选表格的数据
      multiplePopperShow(instance, index) {
        this.multipleDropPage = 1;
        this.getMultipleDropData(index);
      }, // 下拉多选气泡出现时触发
      multipleDropClear(instance, index) {
        this.multipleDropSelectedData[this.screenConditionData[index].AKNAME] = {};
        this.searchCondition[this.screenConditionData[index].AKNAME] = [];
      }, // 下拉多选清空时触发
      multipleInputChange(val, index) {
        if (val) {
          const valueKey = this.screenConditionData[index].AKNAME;
          this.multipleDropSelectedData[this.screenConditionData[index].AKNAME] = {
            label: val,
            value: val,
            copyValue: val
          };
          this.searchCondition[this.screenConditionData[index].AKNAME] = val;
        } else {
          this.searchCondition[this.screenConditionData[index].AKNAME] = '';
          this.multipleDropSelectedData[this.screenConditionData[index].AKNAME] = {};
        }
        this.multipleAutoData = this.screenConditionData[index].VALUE.filter(item => item.NAME.indexOf(val) !== -1);
      }, // 下拉多选输入框值改变时触发
      selectOnChange(val, index) {
        let labelStr = '';
        const valueArr = [];
        if (val.length > 0 && val[0].value === 'bSelect-all') {
          labelStr = this.screenConditionData[index].combobox.reduce((acc, cur) => {
            valueArr.push(cur.limitval);
            acc.push(cur.limitdesc);
            return acc;
          }, []).join(',');
        } else {
          labelStr = val.reduce((acc, cur) => {
            valueArr.push(cur.value);
            acc.push(cur.label);
            return acc;
          }, []).join(',');
        }
        this.searchCondition[this.screenConditionData[index].AKNAME] = valueArr;
        this.multipleDropSelectedData[this.screenConditionData[index].AKNAME] = {
          label: labelStr,
          value: valueArr,
        };
      }, // 下拉框改变时触发
      selectOnClear(index) {
        this.searchCondition[this.screenConditionData[index].AKNAME] = [];
        this.multipleDropSelectedData[this.screenConditionData[index].AKNAME] = {};
      }, // 下拉框清空时触发
      inputOnChange(e, index) {
        if (e.target.value) {
          this.multipleDropSelectedData[this.screenConditionData[index].AKNAME] = {
            label: e.target.value,
            value: e.target.value,
            copyValue: e.target.value
          };
          this.searchCondition[this.screenConditionData[index].AKNAME] = e.target.value;
        } else {
          this.searchCondition[this.screenConditionData[index].AKNAME] = '';
          this.multipleDropSelectedData[this.screenConditionData[index].AKNAME] = {};
        }
      }, // 输入框改变时触发
      inputOnClear(index) {
        this.searchCondition[this.screenConditionData[index].AKNAME] = '';
        this.multipleDropSelectedData[this.screenConditionData[index].AKNAME] = {};
      }, // 输入框清空时触发
      pageChangeEvent(val) {
        this.currentPage = val;
        this.getSearchResultTableData();
      }, // 数据权限弹窗的分页改变时触发
      pageSizeChangeEvent(val) {
        this.pageSize = val;
      }, // 数据权限弹窗的分页修改每页多少条时触发
      tableRowDbclick(val) {
        this.selectTableObj = { label: val[this.selectTableKey], value: val.ID };
        this.toShowTableSelectedData();
        this.getScreenResultCheckData();
      }, // 数据权限弹窗表格双击触发
      toShowTableSelectedData() {
        if (Object.keys(this.selectTableObj).length > 0) {
          if (this.selectedDataList.find(item => item.value === this.selectTableObj.value)) {
            this.$Message.error(this.$t('messages.recordInList'));
          } else {
            this.selectedDataList.push(this.selectTableObj);
          }
        }
        setTimeout(() => {
          this.$refs.table.clearCurrentRow();
          this.selectTableObj = {};
        }, 100);
      }, // 数据权限弹窗右边显示表格选中的值
      tableRowClick(val) {
        this.selectTableObj = { label: val[this.selectTableKey], value: val.ID };
      }, // 数据权限弹窗表格单击触发
      // environmentVariableIconClick(index) {
      //   this.screenConditionDataIndex = index;
      //   this.environmentVariableModal = true;
      // }, // 环境变量icon点击时触发
      selectedDataDeleteAll() {
        this.selectedDataList = [];
        this.selectedNum = 0;
      }, // 数据权限弹窗右侧删除所有的icon点击触发
      selectedDataDelete(index) {
        this.selectedDataList.splice(index, 1);
        if (this.selectedDataList.length > 0) {
          this.getScreenResultCheckData();
        } else {
          this.selectedNum = 0;
        }
      }, // 数据权限弹窗右侧删除单条的icon点击触发
      environmentVariableConfirm() {
        if (this.environmentVariableValue) {
          const valueStr = `${this.screenConditionData[this.screenConditionDataIndex].NAME}包含（${this.environmentVariableValue}）`;
          const valueKey = this.screenConditionData[this.screenConditionDataIndex].AKNAME;
          this.selectedDataList.push({ label: valueStr, value: { [valueKey]: valueStr }, copyValue: this.environmentVariableValue });
        }
        this.environmentVariableValue = '';
      }, // 环境变量弹窗确定按钮
      environmentVariableCancel() {
        this.environmentVariableValue = '';
      }, // 环境变量弹窗取消按钮
      dataPermissionModalConfirm() {
        if (this.selectedDataList.length > 0) {
          const conditionArr = [];
          const inArr = [];
          const resultArr = [];
          this.selectedDataList.forEach(item => {
            const resultObj = {
              exclude: false,
            };
            if (typeof item.value === 'object') {
              if (typeof item.value[Object.keys(item.value)[0]] === 'string') {
                // conditionArr.push(item.copyValue);
                conditionArr.push({
                  [Object.keys(item.value)[0]]: item.copyValue
                });
                resultObj.screen = item.value;
                resultObj.copyScreen = item.copyValue;
                resultObj.screen_string = item.label;
              } else {
                conditionArr.push(item.value);
              }
              if (Array.isArray(item.value[Object.keys(item.value)[0]])) {
                let idListArr = [];
                Object.keys(item.value).forEach((cur) => {
                  idListArr = idListArr.concat(item.value[cur]);
                });
                resultObj.id_list = idListArr;
                resultObj.screen = item.value;
                resultObj.screen_string = item.label;
                resultObj.ID = idListArr;
              }
            }
            if (typeof item.value === 'number' || 'string') {
              inArr.push(item.value);

              resultObj.id_list = [item.value];
              resultObj.screen = item.value;
              resultObj.screen_string = item.label;
              resultObj.ID = item.value;
            }
            resultArr.push(resultObj);
          });
          const obj = {
            idArray: [],
            lists: {
              result: resultArr
            },
            total: this.selectedNum,
            value: {
              CONDITION: conditionArr,
              GLOBAL: '',
              IN: inArr,
              NOTIN: [],
              // TABLENAME: 'USER_DEPT'
              TABLENAME: this.screenTableName
            }
          };
          this.tableData[this.configPermissionTableIndex].SQLFILTER = JSON.stringify(obj);
          const tableRowData = this.tableData[this.configPermissionTableIndex];
          if (tableRowData.ID === -1) {
            this.getEditData(tableRowData);
          } else {
            this.getEditData({
              ID: tableRowData.ID,
              SQLFILTER: tableRowData.SQLFILTER,
              ISACTIVE: tableRowData.ISACTIVE
            });
          }
        } else {
          this.tableData[this.configPermissionTableIndex].SQLFILTER = '';
        }
        this.selectedDataList = [];
        this.dataPermissionColumns = [];
        this.dataPermissionTableData = [];
        this.selectedNum = 0;
        this.multipleDropSelectedData = {};
        this.selectTableKey = '';
        this.selectTableObj = {};
        this.tableDeleteData = [];
      }, // 数据权限弹窗点击确定时触发
      getEditData(obj) {
        const saveObj = JSON.parse(JSON.stringify(obj));
        delete saveObj.isEditPermissionTable;
        if (saveObj.ISACTIVE === '是') {
          saveObj.ISACTIVE = 'Y';
        } else {
          saveObj.ISACTIVE = 'N';
        }
        const findIndex = this.tableSaveData.findIndex(item => item.AD_TABLE_ID === saveObj.AD_TABLE_ID);
        if (findIndex > -1) {
          this.tableSaveData.splice(findIndex, 1, saveObj);
        } else {
          this.tableSaveData.push(saveObj);
        }
      }, // 获取修改的数据
      dataPermissionModalCancel() {
        this.selectedDataList = [];
        this.dataPermissionColumns = [];
        this.dataPermissionTableData = [];
        this.selectedNum = 0;
        this.multipleDropSelectedData = {};
        this.selectTableKey = '';
        this.selectTableObj = {};
      }, // 数据权限弹窗点击取消时触发
    }
  };
</script>
<style lang="less">
.datapermission-div{
  .iconbj_tcduo{
  display: none!important;
}

}

</style>
