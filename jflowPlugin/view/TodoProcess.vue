<template>
  <div class="TodoProcess">
    <div class="btn-agent">
      <div class="btnArea">
        <Button
          type="primary"
          @click="searchData.page = 1;queryLists()"
        >
          查询
        </Button>
        <Button
          v-if="tabalive === 'todoList'"
          type="primary"
          ghost
          @click="openModal(2)"
        >
          转派
        </Button>
        <Button
          v-if="tabalive === 'todoList'"
          type="primary"
          ghost
          @click="openModal(3)"
        >
          设置外出代理人
        </Button>
        <Button
          v-if="Agent.AGENT_ENAME&&Agent.AGENT_ENAME!==''"
          type="primary"
          ghost
          @click="cancelAgent"
        >
          取消代理人
        </Button>
      </div>
      <span
        v-if="Agent.AGENT_ENAME&&Agent.AGENT_ENAME!==''"
        class="agentshow"
      >代理人：{{ Agent.AGENT_ENAME }}</span>
    </div>
    <FormItemComponent
      class="form"
      :form-item-lists="formLists"
      :button-type="false"
      @formChange="formChange"
    />

    <div class="StandardTable">
      <Spin
        v-if="spinShow"
        size="large"
        fix 
      />
      <StandardTable
        class="table"
        :current-page="searchData.page"
        :page-size="searchData.pageSize"
        :total="total"
        :columns="columns"
        :data="data"
        :standard-table-event="standardTableEvent"
      />
    </div>
    <Modal
      v-model="openControl"
      :title="modaltitle"
      :mask="true"
      :width="835"
      @on-ok="ok"
      @on-cancel="cancel"
    >
      <div class="modalCotent">
        <mutipleSelectPop
          v-if="openControl"
          ref="dialogtest"
          :is-use="false"
          :is-mutiple="false"
          @getResult="getResult"
        />
      </div>
    </Modal>
  </div>
</template>
<script>
  import FormItemComponent from './FormItemComponent';
  import ItemComponent from './ItemComponent';
  import StandardTable from './StandardTable';
  import mutipleSelectPop from './MutipleSelectPop';
  import network from '../utils/network';
  // import { Version } from '../../constants/global';
  import { BacklogData } from '../js/todoList';
  import { global } from '../utils/global.config';

  export default {
    components: { FormItemComponent, StandardTable, mutipleSelectPop },
    props: {
      tabalive: { type: String, default: '' }
    },
    data() {
      return {
        urlMap: { // 请求数据url映射
          todoList: '/jflow/p/cs/task/backlog/list',
          approvalList: '/jflow/p/cs/task/history/list',
          launchList: '/jflow/p/cs/task/initiator/list',
          copyList: '/jflow/p/cs/task/relation/list'
        },
        headerUrlMap: {
          todoList: 'upcoming',
          approvalList: 'approved',
          launchList: 'initiated',
          copyList: 'carbon-copied'
        },
        modaltype: 0,
        openControl: false, // 弹框是否显示控制
        modaltitle: '', // 弹框标题
        // 待办-同意意见/驳回意见
        agree: '',
        // 待办-驳回下拉数据
        ApprovalData: [],
        selectValue: '', // 选中的数据
        // 表单配置
        formLists: [],
        // formLists: [
        //   {
        //     row: 1,
        //     col: 1,
        //     component: ItemComponent,
        //     item: {
        //       type: 'input',
        //       title: '工作流编号',
        //       filed: 'instanceId',
        //       props: {
        //         regx: /^[0-9]*$/
        //       },
        //       event: {
        //         keydown: (event) => {
        //           if (event.keyCode === 13) {
        //             this.searchData.page = 1;
        //             this.queryLists();
        //           }
        //         }
        //       }
        //     }
        //   },
        //   {
        //     row: 1,
        //     col: 1,
        //     component: ItemComponent,
        //     item: {
        //       type: 'input',
        //       title: '查询索引',
        //       filed: 'businessNumber',
        //       event: {
        //         keydown: (event) => {
        //           if (event.keyCode === 13) {
        //             this.searchData.page = 1;
        //             this.queryLists();
        //           }
        //         }
        //       }
        //     }
            
        //   },
        //   {
        //     row: 1,
        //     col: 1,
        //     component: ItemComponent,
        //     item: {
        //       type: 'select',
        //       title: '单据类型',
        //       filed: 'businessType',
        //       options: [
        //         { value: 0, label: '发送成功' },
        //         { value: 1, label: '发送失败(待发送)' },
        //         { value: 2, label: '消费成功' },
        //         { value: 3, label: '消费失败(待消费)' }
        //       ]
        //     }
        //   },
        //   {
        //     row: 1,
        //     col: 1,
        //     component: ItemComponent,
        //     item: {
        //       type: 'DatePicker',
        //       title: '开始时间',
        //       filed: 'createTime',
        //       value: [new Date(new Date(new Date().getTime() - 24 * 60 * 60 * 1000).setHours(0, 0, 0, 0)).minusDays(29).format('yyyy-MM-dd hh:mm:ss'), new Date(new Date().setHours(23, 59, 59)).format('yyyy-MM-dd hh:mm:ss')]
        //     }
        //   },
        //   {
        //     row: 1,
        //     col: 1,
        //     component: ItemComponent,
        //     item: {
        //       type: 'input',
        //       title: '节点名称',
        //       filed: 'nodeName',
        //       event: {
        //         keydown: (event) => {
        //           if (event.keyCode === 13) {
        //             this.searchData.page = 1;
        //             this.queryLists();
        //           }
        //         }
        //       }
        //     }
        //   }
        // ],
        // 查询条件
        searchData: {
          page: 1,
          pageSize: 10,
          searchType: '0,1',
          excuStatus: 0,
          createTime: [new Date(new Date(new Date().getTime() - 24 * 60 * 60 * 1000).setHours(0, 0, 0, 0)).minusDays(29).format('yyyy-MM-dd hh:mm:ss'), new Date(new Date().setHours(23, 59, 59)).format('yyyy-MM-dd hh:mm:ss')]
        },
        // 表格数据
        total: 0,
        columns: [], // 表头字段
        data: [],
        standardTableEvent: {
          'on-change': (page) => {
            this.searchData.page = page;
            this.queryLists();
          },
          'on-page-size-change': (pageSize) => {
            this.searchData.page = 1;
            this.searchData.pageSize = pageSize;
            this.queryLists();
          },
          'on-select': (selection, row) => {
            // 表格行选中事件
            const self = this;
            self.data.map((item) => {
              if (item.id === row.id) {
                item._check = true;
              }
              return item;
            });
          },
          'on-select-cancel': (selection, row) => {
            // 表格行取消事件
            const self = this;
            self.data.map((item) => {
              if (item.id === row.id) {
                item._check = false;
              }
              return item;
            });
          },
          'on-select-all': () => {
            // 表格行全部选中
            const self = this;
            self.data.map((item) => {
              item._check = true;
              return item;
            });
          },
          'on-select-all-cancel': () => {
            // 表格行全部取消
            const self = this;
            self.data.map((item) => {
              item._check = false;
              return item;
            });
          }
        },
        // findValue: "", //input搜索框的输入值
        queryStyle: {
          color: '#fd6442'
        },
        treedata: [],
        loading: false, // z最大loading
        tree_loading: true, // 左边的 的loading
        tableLoading: false, // 中间的 的loading
        componentData: [
          {
            tab: '筛选结果',
            columns: [
              { key: 'NAME', title: '用户名' },
              { key: 'ENAME', title: '用户姓名' }
            ],
            list: [],
            total: 0,
            pageSize: 10,
            pageNum: 1, // 当前页码
            pageOptions: [10, 20, 50, 100],
            height: 340
          }
        ],
        resultData: {}, // 选中结果
        open: false, // 是否打开
        tableSearch: '',
        selectRow: {}, // 选中的行
        obj: {}, // 传给table的对象

        spinShow: false,
        Agent: {} // 代理人信息
      };
    },
    methods: {
      urlParse(path) {
        const url = path || window.location.search; // 得到url问号后面拼接的参数  ?id=12345&a=b
        const obj = {}; // 创建一个Object
        const reg = /[?&][^?&]+=[^?&]+/g; // 正则匹配 ?&开始 =拼接  非?&结束  的参数
        const arr = url.match(reg); // match() 方法可在字符串内检索指定的值，或找到一个或多个正则表达式的匹配。
        // arr数组形式 ['?id=12345','&a=b']
        if (arr) {
          arr.forEach((item) => {
            /**
             * tempArr数组    ['id','12345']和['a','b']
             * 第一个是key，第二个是value
             * */
            const tempArr = item.substring(1).split('=');
            const key = decodeURIComponent(tempArr[0]);
            const val = decodeURIComponent(tempArr[1]);
            obj[key] = val;
          });
        }
        return obj;
      },
      // 获取表头数据
      getHeader() {
        const gridName = this.headerUrlMap[this.tabalive];
        network.post(`/jflow/p/cs/sys/grid/header/${gridName}`, {}).then((res) => {
          if (res.data.resultCode === 0) {
            res.data.data.headers = res.data.data.headers.map((item) => {
              // 待审批人
              if (item.key === 'approverValue') {
                item.render = (h, params) => h(
                  'p',
                  {
                    style: {
                      maxWidth: '160px',
                      overflow: 'hidden',
                      'text-overflow': 'ellipsis',
                      'white-space': 'nowrap'
                    }
                  },
                  params.row.approvers.join(',')
                );
              }

              // 流程状态
              if (item.key === 'processStatusName') {
                item.render = (h, params) => {
                  if (params.row.processStatus === 4) {
                    return h('Poptip', {
                      props: {
                        trigger: 'hover',
                        content: params.row.submitErrorMsg,
                        transfer: true
                      }
                    }, [h(
                      'span',
                      {
                        style: {
                          color: 'rgba(255, 0, 0, 1)',
                          cursor: 'pointer'
                        }
                      },
                      params.row.processStatusName
                    )]);
                  }
                  return h(
                    'p',
                    {
                      style: {
                        maxWidth: '160px',
                        overflow: 'hidden',
                        'text-overflow': 'ellipsis',
                        'white-space': 'nowrap'
                      }
                    },
                    params.row.processStatusName
                  );
                };
              }
              return item;
            });

            res.data.data.headers.push({
              title: '详情',
              fixed: 'right',
              render: (h, params) => h(
                'p',
                {
                  style: {
                    display: 'flex',
                    'align-items': 'center'
                  // "justify-content": "center"
                  }
                },
                [
                  h(
                    'span',
                    {
                      style: {
                        color: 'rgba(16, 142, 233, 1)',
                        cursor: 'pointer'
                      },
                      on: {
                        click: () => {
                          if (params.row.formUrl.indexOf('SYSTEM') >= 0) { // 区分版本  1.4版本
                            window.getObjdisType({ table: params.row.formUrl.split('/')[4] }).then((res) => {
                              const distype = res === 'tabpanle' ? 'H' : 'V';
                              const arr = params.row.formUrl.split('/');
                              arr[3] = distype;
                              window.vm.$router.push({
                                path: arr.join('/')
                              });
                            });
                          } else {
                            const query = this.urlParse(params.row.formUrl);
                            window.getObjdisType({ table: query.tableName }).then((res) => {
                              const distype = res === 'tabpanle' ? 'H' : 'V';
                              const formUrl = `/SYSTEM/TABLE_DETAIL/${distype}/${query.tableName}/${query.pid}/${query.id}`;
                              window.vm.$router.push({
                                path: formUrl
                              });
                            });
                          }
                        }
                      }
                    },
                    '查看明细'
                  ),
                  h('span', {
                    style: {
                      width: '1px',
                      height: '19px',
                      display: 'inline-block',
                      background: 'rgba(228,228,228,1)',
                      margin: '0 16px'
                    }
                  }),
                  h(
                    'span',
                    {
                      style: {
                        color: 'rgba(16, 142, 233, 1)',
                        cursor: 'pointer'
                      },
                      on: {
                        click: () => {
                          window.open(
                            `${global.localIp}/#/FlowChart?instanceId=${params.row.instanceId}`,
                            '_blank',
                            'width=861,height=612'
                          );
                        }
                      }
                    },
                    '流程进度'
                  )
                ]
              )
            });

            this.columns = res.data.data.headers;
          }
        });
      },
      // 获取查询条件
      getFormLists() {
        const gridName = this.headerUrlMap[this.tabalive];
        network.post(`/jflow/p/cs/sys/grid/search/area/${gridName}`, {})
          .then((res) => {
            res.data.data.searchArea = res.data.data.searchArea.map((item) => {
              const temp = {
                row: 1,
                col: 1,
                component: ItemComponent,
                item
              };
              if (temp.item.type === 'input') {
                temp.item.event = {
                  keydown: (event) => {
                    if (event.keyCode === 13) {
                      this.searchData.page = 1;
                      this.queryLists();
                    }
                  }
                };
              }
              if (temp.item.field === 'instanceId') { // 工作流编号只能输入数字
                temp.item.props = {
                  regx: /^[0-9]*$/
                };
              }

              if (temp.item.field === 'businessType') { // 单据类型
                temp.item.options = [
                  { value: 0, label: '发送成功' },
                  { value: 1, label: '发送失败(待发送)' },
                  { value: 2, label: '消费成功' },
                  { value: 3, label: '消费失败(待消费)' }
                ];
              }

              if (temp.item.field === 'createTime') { // 创建时间设置默认值
                temp.item.value = [new Date(new Date(new Date().getTime() - 24 * 60 * 60 * 1000).setHours(0, 0, 0, 0)).minusDays(29).format('yyyy-MM-dd hh:mm:ss'), new Date(new Date().setHours(23, 59, 59)).format('yyyy-MM-dd hh:mm:ss')];
              }

              return temp;
            });
            this.formLists = res.data.data.searchArea;
          });
      },
      // 业务关系下拉数据
      getselectOption() {
        network.post('/jflow/p/cs/task/relation/list', {}).then((res) => {
          if (res.data.resultCode === 0) {
            this.formLists.forEach((outer) => {
              if (outer.item.filed === 'businessType') {
                outer.item.options = res.data.data.relations.map((item) => {
                  item.value = item.businesskey;
                  item.label = item.businessName;
                  return item;
                });
              }
            });
          }
        });
      },
      // 查询
      queryLists() {
        this.spinShow = true;
        if (
          this.searchData.createTime
          && this.searchData.createTime[0]
          && this.searchData.createTime[1]
        ) {
          this.searchData.startTime = this.searchData.createTime[0];
          this.searchData.endTime = this.searchData.createTime[1];
        } else {
          this.searchData.startTime = '';
          this.searchData.endTime = '';
        }
        const obj = Object.assign({}, this.searchData);
        delete obj.createTime;
        obj.userId = global.userInfo.id;
        network
          .post('/jflow/p/cs/task/backlog/list', obj)
          .then((res) => {
            if (res.data.resultCode === 0) {
              const data = res.data.data;
              this.total = data.total;
              this.data = data.records;
            }
            this.spinShow = false;
          })
          .catch(() => {
            this.spinShow = false;
          });
      },
      formChange(data) {
        // 表单数据修改时，修改searchData数据
        this.searchData = Object.assign({}, this.searchData, data);
        if (
          Object.prototype.toString.call(this.searchData.businessType)
          === '[object Array]'
          && this.searchData.businessType.length === 0
        ) {
          delete this.searchData.businessType;
        }
      },
      // 0同意/1驳回、2转派
      batchoperate() {
        const self = this;
        const sendData = {};
        sendData.ids = '';
        self.data.map((item) => {
          if (item._check) {
            sendData.ids += `${item.id},`;
          }
          return item;
        });
        sendData.ids = sendData.ids.substring(0, sendData.ids.length - 1);
        if (this.resultData.list && this.resultData.list.length > 0) {
          sendData.delegateId = this.resultData.list[0].ID;
        }
        // }else{
        //   return
        // }
        // sendData.userId = this.userInfo.userId;
        network.post('/jflow/p/cs/task/batch/deal', sendData).then((res) => {
          const data = res.data;
          if (data.resultCode === 0) {
            this.resultData.list = [];
            this.tableSearch = '';
            // this.selectRow = {};
            this.$Message.success(data.resultMsg);
            this.queryLists();
            BacklogData(window.jflowPlugin.store);
          } else {
            this.$Message.warning(data.resultMsg);
          }
        });
      },
      ok() {
        if (this.modaltype === 3) {
          this.setAgent();
        } else {
          this.batchoperate();
        }
        if (this.resultData.list && this.resultData.list.length > 0) {
          this.resultData.list = [];
          this.resultData.total = 0;
        }
      },
      cancel() {
        if (this.resultData.list && this.resultData.list.length > 0) {
          this.resultData.list = [];
          this.resultData.total = 0;
        }
        this.openControl = false; // 关闭弹框
      },
      async openModal(type) {
        this.modaltype = type;
        // eslint-disable-next-line no-unused-expressions
        type === 2
          ? (this.modaltitle = '选择转派人')
          : (this.modaltitle = '选择代理人');
        const tableSelectd = [];
        this.data.map((item) => {
          if (item._check) {
            tableSelectd.push(item);
          }
          return item;
        });

        if (type === 2) {
          if (tableSelectd.length > 0) {
            this.openControl = true;
          } else {
            this.$Message.warning('请选择单据');
          }
        }
        if (type === 3) {
          this.openControl = true;
        }
      },
      
      // 设置外出代理人
      setAgent() {
        const needdata = {};
        needdata.USER_ID = global.userInfo.id;
        needdata.AGENT_ENAME = this.resultData.list[0].ENAME;
        if (this.resultData.list && this.resultData.list.length > 0) {
          needdata.AGENT_ID = Number(this.resultData.list[0].ID);
        }
        network.post('/jflow/p/c/agent/save', needdata).then((res) => {
          if (res.data.resultCode === 0) {
            this.resultData.list = [];
            this.tableSearch = '';
            this.getAgent();
            this.queryLists();
            // this.selectRow={};
            this.$Message.success(res.data.resultMsg);
          } else {
            this.$Message.warning(res.data.resultMsg);
          }
        });
      },
      async getAgent() {
        // 获取代理人信息
        await network
          .post('/jflow/p/c/agent/get', {
            USER_ID: global.userInfo.id
          })
          .then((res) => {
            if (res.data.resultCode === 0) {
              this.Agent = res.data.data;
            }
          });
      },
      cancelAgent() {
        this.$Modal.fcWarning({
          title: '警告',
          content: '确定要取消代理人吗？',
          mask: true,
          showCancel: true,
          onOk: () => {
            network
              .post('/jflow/p/c/agent/delete', { USER_ID: this.Agent.USER_ID })
              .then((res) => {
                if (res.data.resultCode === 0) {
                  this.getAgent();
                  this.$Message.success(res.data.resultMsg);
                } else {
                  this.$Message.warning(res.data.resultMsg);
                }
              });
          }
        });
      },

      // 获取选中的数据
      getResult(data) {
        this.resultData = data;
      }
    },
    created() {
      this.getHeader();
      this.getFormLists();
    },
    activated() {
      if (global.userInfo) {
        this.getselectOption();
        this.queryLists();
        // 获取外出代理人数据
        this.getAgent();
      } else {
        const timer = setInterval(() => {
          if (global.userInfo) {
            clearInterval(timer);
            this.getselectOption();
            this.queryLists();
            // 获取外出代理人数据
            this.getAgent();
          }
        }, 10);
      }
    }
  };
</script>
<style lang="less">

.TodoProcess {
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .ark-spin-fix {
    z-index: 100;
  }
  .btn-agent {
    display: flex;
    justify-content: space-between;
    .btnArea {
      margin-bottom: 10px;
      .ark-btn {
        margin-right: 9px;
        &:last-child {
          margin-right: 0;
        }
      }
    }
    .agentshow {
      display: inline-block;
      height: 30px;
      line-height: 30px;
      margin-bottom: 10px;
    }
  }

  .form {
    margin-bottom: 16px;
  }

  .StandardTable {
    position: relative;
    flex: 1;
    display: flex;
    .table {
      flex: 1;
    }
  }
}
.modalCotent {
  .ark-tree {
    overflow-y: auto;
  }
}
</style>
