<template>
  <!-- 历史流程 -->
  <div class="HistoricalProcess">
    <Button
      type="primary"
      @click="searchData.page = 1;queryLists()"
    >
      查询
    </Button>
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
  </div>
</template>
<script>
  import FormItemComponent from './FormItemComponent';
  import ItemComponent from './ItemComponent';
  import StandardTable from './StandardTable';
  import network from '../utils/network';
  // import { Version } from '../../constants/global';
  // import getObjdisType from '../../__utils__/getObjdisType';
  

  export default {
    name: 'HistoricalProcess',
    components: { FormItemComponent, StandardTable },
    props: {
      tabalive: { type: String, default: '' }
    },
    data() {
      return {
        // 表单配置
        formLists: [
          {
            row: 1,
            col: 1,
            component: ItemComponent,
            item: {
              type: 'input',
              title: '工作流编号',
              filed: 'instanceId',
              props: {
                regx: /^[0-9]*$/
              },
              event: {
                keydown: (event) => {
                  if (event.keyCode === 13) {
                    this.searchData.page = 1;
                    this.queryLists();
                  }
                }
              }
            }
          },
          {
            row: 1,
            col: 1,
            component: ItemComponent,
            item: {
              type: 'input',
              title: '查询索引',
              filed: 'businessNumber',
              event: {
                keydown: (event) => {
                  if (event.keyCode === 13) {
                    this.searchData.page = 1;
                    this.queryLists();
                  }
                }
              }
            }
          },

          {
            row: 1,
            col: 1,
            component: ItemComponent,
            item: {
              type: 'select',
              title: '单据类型',
              filed: 'businessType',
              options: [
                { value: 0, label: '发送成功' },
                { value: 1, label: '发送失败(待发送)' },
                { value: 2, label: '消费成功' },
                { value: 3, label: '消费失败(待消费)' }
              ]
            }
          },
          {
            row: 1,
            col: 1,
            component: ItemComponent,
            item: {
              type: 'DatePicker',
              title: '处理时间',
              filed: 'updateTime',
              value: [new Date(new Date(new Date().getTime() - 24 * 60 * 60 * 1000).setHours(0, 0, 0, 0)).minusDays(29).format('yyyy-MM-dd hh:mm:ss'), new Date(new Date().setHours(23, 59, 59)).format('yyyy-MM-dd hh:mm:ss')]
            }
          },
          {
            row: 1,
            col: 1,
            component: ItemComponent,
            item: {
              type: 'input',
              title: '节点名称',
              filed: 'nodeName',
              event: {
                keydown: (event) => {
                  if (event.keyCode === 13) {
                    this.searchData.page = 1;
                    this.queryLists();
                  }
                }
              }
            }
          }
        ],
        // 查询条件
        searchData: {
          page: 1,
          pageSize: 10,
          searchType: '0,1',
          excuStatus: 0,
          userId: window.jflowPlugin.userInfo.id,
          updateTime: [new Date(new Date(new Date().getTime() - 24 * 60 * 60 * 1000).setHours(0, 0, 0, 0)).minusDays(29).format('yyyy-MM-dd hh:mm:ss'), new Date(new Date().setHours(23, 59, 59)).format('yyyy-MM-dd hh:mm:ss')]
        },

        // 表格数据
        total: 0,
        columns: [
          {
            title: '工作流编号',
            key: 'instanceId'
          }, {
            title: '查询索引',
            key: 'businessNumber'
          },
          {
            title: '单据类型',
            key: 'businessName'
          },
          {
            title: '模板名称',
            key: 'moduleName'
          },
          {
            title: '节点名称',
            key: 'nodeName'
          },
          // {
          //   title:'待审批人',
          //   key: 'approverValue'
          // },
          {
            title: '发起人',
            key: 'initiatorName'
          },
          {
            title: '处理时间',
            key: 'updateTime'
          },
          {
            title: '消耗时长',
            key: 'durationTime'
          },
          {
            title: '流程状态',
            key: 'processStatusName',
            render: (h, params) => {
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
            }
          },
          {
            title: '详情',
            fixed: 'right',
            render: (h, params) => h(
              'p',
              {
                style: {
                  display: 'flex',
                  'align-items': 'center',
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
                        params.row.loadType = 0;
                        // if (Version() === '1.4') {
                        //   getObjdisType({ table: params.row.formUrl.split('/')[4] }).then((res) => {
                        //     const distype = res === 'tabpanle' ? 'H' : 'V';
                        //     const arr = params.row.formUrl.split('/');
                        //     arr[3] = distype;
                        //     window.sessionStorage.setItem('dynamicRouting', true);
                        //     window.jflowPlugin.router.push({
                        //       path: arr.join('/')
                        //     });
                        //   });
                        // } else {
                        //   const query = this.urlParse(params.row.formUrl);
                        //   getObjdisType({ table: query.tableName }).then((res) => {
                        //     const distype = res === 'tabpanle' ? 'H' : 'V';
                        //     const formUrl = `/SYSTEM/TABLE_DETAIL/${distype}/${query.tableName}/${query.pid}/${query.id}`;
                        //     window.sessionStorage.setItem('dynamicRouting', true);
                        //     window.jflowPlugin.router.push({
                        //       path: formUrl
                        //     });
                        //   });
                        // }
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
                          `${window.jflowPlugin.jflowIp}/#/FlowChart?instanceId=${params.row.instanceId}`,
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
          }
        ],
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
          }
        },

        spinShow: false
      };
    },
    watch: {
      tabalive(newVal, oldVal) {
        if (newVal === '我已审批的') {
          this.getselectOption();
          this.queryLists();
        // this.getAgent();
        }
      }
    },
    methods: {
      urlParse(path) {
        const url = path || window.location.search;// 得到url问号后面拼接的参数  ?id=12345&a=b
        const obj = {};// 创建一个Object
        const reg = /[?&][^?&]+=[^?&]+/g;// 正则匹配 ?&开始 =拼接  非?&结束  的参数
        const arr = url.match(reg);// match() 方法可在字符串内检索指定的值，或找到一个或多个正则表达式的匹配。
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
      formChange(data) {
        // 表单数据修改时，修改searchData数据
        this.searchData = Object.assign({}, this.searchData, data);
        if (Object.prototype.toString.call(this.searchData.businessType) === '[object Array]' && this.searchData.businessType.length === 0) {
          delete this.searchData.businessType;
        }
      },
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
      queryLists() {
        this.spinShow = true;
        // 查询列表
        if (this.searchData.updateTime && this.searchData.updateTime[0] && this.searchData.updateTime[1]) {
          this.searchData.startTime = this.searchData.updateTime[0];
          this.searchData.endTime = this.searchData.updateTime[1];
        } else {
          this.searchData.startTime = '';
          this.searchData.endTime = '';
        }
        const obj = Object.assign({}, this.searchData);
        delete obj.updateTime;
        network
          .post('/jflow/p/cs/task/history/list', obj)
          .then((res) => {
            if (res.data.resultCode === 0) {
              const data = res.data.data;
              this.total = data.total;
              this.data = data.records;
            }
            this.spinShow = false;
          })
          .catch((res) => {
            this.spinShow = false;
          });
      }
    },
    created() {
    // this.getselectOption();
    // this.queryLists();
    }
  };
</script>
<style lang="less">
.ark-spin-fix{
  z-index: 100;
}
.HistoricalProcess {
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: hidden;
  .title {
    font-size: 18px;
    font-family: PingFangSC-Medium;
    font-weight: 500;
    color: rgba(81, 90, 110, 1);
    line-height: 24px;
    margin-bottom: 16px;
  }

  > button {
    margin-bottom: 10px;
    width: 80px;
  }

  .form {
    margin-bottom: 16px;
  }

  .StandardTable{
    position: relative;
    flex:1;
    display: flex;
    .table {
      flex: 1;
      display: flex;
    }
  }

  // .table {
  //   flex: 1;
  //   display: flex;
  // }
}
</style>
