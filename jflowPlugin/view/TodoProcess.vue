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
          ref="dialogtest"
          :table-search="tableSearch"
          :loading="loading"
          :tree-loading="tree_loading"
          :table-loading="tableLoading"
          :treedata="treedata"
          :component-data="componentData"
          :result-data="resultData"
          :is-use="false"
          @on-select-tree="selectTtree"
          @on-change-tree="changeTtree"
          @on-change-page="changePage"
          @on-change-pageSize="changePageSize"
          @on-row-dblclick="rowdbClick"
          @on-row-click="rowClick"
          @on-change="onChangeInput"
          @on-search="inputsearch"
          @on-transfer="transfer"
          @on-delectli="deleteLi"
          @on-deleBtn="deleBtn"
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
      onChangeInput(event) {
        // 输入框change事件
        this.tableSearch = event.target.value;
      },
      async openModal(type) {
        await this.getAgent();
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
            this.tableSearch = '';
            this.openControl = true;
            this.componentData[0].pageNum = 1;
            this.getTreeData();
          } else {
            this.$Message.warning('请选择单据');
          }
        }
        if (type === 3) {
          this.tableSearch = '';
          this.openControl = true;
          this.componentData[0].pageNum = 1;
          this.getTreeData();
        }
      },
      // 获取树数据
      getTreeData() {
        network.post('/jflow/p/c/identity/org/treeload', {}).then((res) => {
          this.tree_loading = false;
          if (res.data.resultCode === 0) {
            this.treedata = [];
            const newArr = [];
            let root = {};
            if (res.data.data.records.length > 0) {
              res.data.data.records.forEach((item) => {
                const tem = Object.assign(item);
                newArr.push(tem);
                if (
                  item.CP_C_ORGUP_ID === null
                  || item.CP_C_ORGUP_ID === ''
                ) {
                  root = Object.assign(item);
                }
              });
              if (Object.keys(root).length < 1) {
                newArr.push({
                  CP_C_ORGUP_ID: null,
                  ECODE: '00001',
                  ENAME: '全部',
                  ID: 'CP_C_HRORG.2',
                  MIXNAME: '[00001]全部',
                  ORGTYPE: 'IN',
                  TYPE: 'CP_C_HRORG_ID'
                });
              }
              this.treedata = this.arrayTransTree(newArr, 'CP_C_ORGUP_ID');
            }

            this.findUser({});
          }
        });
      },
      // 改造树数据的结构
      arrayTransTree(list, key) {
        const parent = [];
        const children = [];
        list.map((item) => {
          item.expand = false;
          item.title = item.ENAME;
          if (item[key] === null || item[key] === '') {
            // 根节点
            parent.push(item);
          } else {
            // 有父节点的
            children.push(item);
          }
          return item;
        });
        this.translator(parent, children, key);
        return parent;
      },
      translator(parents, children, key) {
        const temp = [];
        children.map((item) => {
          // 对子节点数据进行深复制，这里只支持部分类型的数据深复制，对深复制不了解的童靴可以先去了解下深复制
          const temItem = Object.assign({}, item);
          temp.push(temItem);
          return temp;
        });
        // 遍历父节点数据
        parents.map((parent) => {
          // 遍历子节点数据
          children.map((current, index) => {
            // 此时找到父节点对应的一个子节点
            if (current[key] === parent.ID) {
              // 让当前子节点从temp中移除，temp作为新的子节点数据，这里是为了让递归时，子节点的遍历次数更少，如果父子关系的层级越多，越有利
              temp.splice(index, 1);
              // 让当前子节点作为唯一的父节点，去递归查找其对应的子节点
              this.translator([current], temp, key);
              // 把找到子节点放入父节点的children属性中
              // eslint-disable-next-line no-unused-expressions
              parent.children
                ? parent.children.push(current)
                : (parent.children = [current]);
            }
            return current;
          });
          return parent;
        });
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
      treeTransArray(tree, key) {
        // 数转化为数组
        return tree
          .reduce(function iteration(con, item) {
            con.push(item);
            if (item[key] && item[key].length > 0) { item[key].reduce(iteration, con); }
            return con;
          }, [])
          .map((item) => {
            item[key] = [];
            return item;
          });
      },
      // 表格体数据转化
      transferTbody(data) {
        this.componentData[0].total = data.totalRowCount;
        this.componentData[0].pageOptions = data.selectrange;
        // this.componentData[0].pageSize = data.rowCount;
        // this.componentData[0].pageNum = data.rowCount;
        this.componentData[0].list = [];
        data.row.map((item) => {
          const tem = {};
          Object.keys(item).map((inner) => {
            tem[inner] = item[inner].val;
            return inner;
          });
          this.componentData[0].list.push(tem);
          return item;
        });
      },
      // 查找用户信息
      findUser(param) {
        this.tableLoading = true;
        network.post('/jflow/p/c/identity/user/list', param).then((res) => {
          this.tableLoading = false;
          const data = res.data;
          if (data.code === 0) {
            this.transferTbody(data.data);
          }
        });
      },
      selectTtree(val) {
        // console.log(val, vm);
        this.obj = {};
        if (val.length > 0) {
          this.saveObj = val[0];
          const self = this;
          let valID = val[0].ID.split('.')[1];
          valID = parseInt(valID);
          if (val[0].CP_C_ORGUP_ID === null) {
            // 根节点
            this.findUser({});
          } else {
            // 当item的TYPE为店仓时
            if (val[0].TYPE === 'CP_C_STORE_ID') {
              this.obj.CP_C_STORE_ID = `in(${valID})`;
            }
            // 当item的TYPE为供应商时
            //  当item的TYPE为组织时
            if (val[0].TYPE === 'CP_C_HRORG_ID') {
              network
                .post('/jflow/p/c/identity/org/treequery', { ID: valID })
                .then((res) => {
                  if (res.data.resultCode === 0) {
                    let HRORG = 'in ('; // 储存键名为CP_C_HRORG_ID对象的ID
                    let STORE = 'in ('; // 储存键名为CP_C_STORE_ID对象的ID
                    if (
                      res.data.data.CP_C_HRORG
                      && res.data.data.CP_C_HRORG.length > 0
                    ) {
                      res.data.data.CP_C_HRORG.forEach((item) => {
                        HRORG += `${item.ID},`; // in 1,2,3,5,6,87,8,6
                      });
                      if (res.data.data.CP_C_HRORG.length > 0) {
                        self.obj.CP_C_HRORG_ID = `${HRORG.substring(0, HRORG.length - 1)})`;
                      }
                    }
                    if (
                      res.data.data.CP_C_STORE
                      && res.data.data.CP_C_STORE.length > 0
                    ) {
                      res.data.data.CP_C_STORE.forEach((item) => {
                        STORE += `${item.ID},`;
                      });
                      if (res.data.data.CP_C_STORE.length > 0) {
                        self.obj.CP_C_STORE_ID = `${STORE.substring(0, STORE.length - 1)})`;
                      }
                    }
                  } else {
                    this.$Modal.fcError({
                      title: '错误提示',
                      content: res.data.resultMsg
                    });
                  }
                });
            }
            setTimeout(() => {
              self.findUser(self.obj);
            });
          }
        }
      },
      changeTtree() {},
      changePage(index) {
        this.componentData[0].pageNum = index;
        const param = Object.assign(this.obj, {
          page: index,
          pageSize: this.componentData[0].pageSize
        });
        if (this.tableSearch !== '') {
          param.ENAME = this.tableSearch;
        }
        this.findUser(param);
      },
      changePageSize(index) {
        this.componentData[0].pageNum = 1;
        this.componentData[0].pageSize = index;
        const param = Object.assign(this.obj, {
          page: this.componentData[0].pageNum,
          pageSize: index
        });
        if (this.tableSearch !== '') {
          param.ENAME = this.tableSearch;
        }
        this.findUser(param);
      },
      rowClick(row, index, vm) {
        this.selectRow = Object.assign(this.selectRow, row);
      },
      rowdbClick(row, index) {
        // 双击事件
        const selectObj = Object.assign({}, row);
        selectObj.string = selectObj.ENAME;
        if (this.resultData.list) {
          this.resultData.list = [];
          this.resultData.list.push(selectObj);
        } else {
          this.$set(this.resultData, 'list', [selectObj]);
        }
        // eslint-disable-next-line no-unused-expressions
        this.resultData.total
          ? (this.resultData.total = 1)
          : this.$set(this.resultData, 'total', 1);
        this.componentData[0].list.map((item, i) => {
          item._checked = false;
        });
        this.selectRow = Object.assign({}, row);
      },
      // 搜索
      inputsearch(event, vm) {
        const param = Object.assign(this.obj, {
          page: this.componentData[0].pageNum,
          pageSize: this.componentData[0].pageSize,
          ENAME: event
        });
        this.findUser(param);
      },
      transfer(vm) {
        if (Object.keys(this.selectRow).length === 0) {
          this.$Message.warning('请选择人员!');
          return;
        }
        // eslint-disable-next-line no-unused-expressions
        this.resultData.total
          ? (this.resultData.total = 1)
          : this.$set(this.resultData, 'total', 1);
        const selectObj = Object.assign({}, this.selectRow);
        selectObj.string = selectObj.ENAME;
        if (this.resultData.list) {
          this.resultData.list = [];
          this.resultData.list.push(selectObj);
        } else {
          this.$set(this.resultData, 'list', [selectObj]);
        }
        this.componentData[0].list.map((item, i) => {
          item._checked = false;
        });
        this.componentData[0].list = this.componentData[0].list.concat([]);
        this.selectRow = {};
      },
      deleteLi(index, tem) {
        // 删除li
        this.selectRow = {};
        this.resultData.total = this.resultData.total - 1;
        this.resultData.list.splice(index, 1);
      },
      deleBtn(vm) {
        // 全部清空事件
        this.selectRow = {};
        this.resultData.total = 0;
        this.resultData.list = [];
        this.componentData[0].list.map((item) => {
          item._checked = false;
        });
        this.componentData[0].list = this.componentData[0].list.concat([]);
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
      } else {
        const timer = setTimeout(() => {
          if (global.userInfo) {
            clearTimeout(timer);
            this.getselectOption();
            this.queryLists();
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
