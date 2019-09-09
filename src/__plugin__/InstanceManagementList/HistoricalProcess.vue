<template>
  <!-- 历史流程 -->
  <div class="HistoricalProcess">
    <Button type="primary" @click="queryLists">查询</Button>
    <FormItemComponent
      class="form"
      :form-item-lists="formLists"
      :button-type="false"
      @formChange="formChange"
    />
    <div class="StandardTable">
      <Spin v-if="spinShow" size="large" fix />
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
import FormItemComponent from "./FormItemComponent";
import ItemComponent from "./ItemComponent";
import StandardTable from "./StandardTable";

export default {
  name: "HistoricalProcess",
  components: { FormItemComponent, StandardTable },
  props: { tabalive: { type: String, default: "" } },
  data() {
    return {
      // 表单配置
      formLists: [
        {
          row: 1,
          col: 1,
          component: ItemComponent,
          item: {
            type: "input",
            title: "单据编号",
            filed: "businessCode"
          }
        },
        {
          row: 1,
          col: 1,
          component: ItemComponent,
          item: {
            type: "select",
            title: "单据类型",
            filed: "businessType",
            options: [
              { value: 0, label: "发送成功" },
              { value: 1, label: "发送失败(待发送)" },
              { value: 2, label: "消费成功" },
              { value: 3, label: "消费失败(待消费)" }
            ]
          }
        },
        {
          row: 1,
          col: 1,
          component: ItemComponent,
          item: {
            type: "DatePicker",
            title: "处理时间",
            filed: "createTime"
          }
        }
      ],
      // 查询条件
      searchData: {
        page: 1,
        pageSize: 10,
        searchType: "0,1",
        excuStatus: 0,
        userId: window.jflowPlugin.userInfo.id,
        createTime: [
          new Date(new Date(new Date().toLocaleDateString()).getTime()),
          new Date()
        ]
      },

      // 表格数据
      total: 0,
      columns: [
        {
          title: "工作流编号",
          key: "instanceId"
        },
        {
          title: "单据类型",
          key: "businessName"
        },
        // {
        //   title:'待审批人',
        //   key: 'approverValue'
        // },
        {
          title: "发起人",
          key: "initiatorName"
        },
        {
          title: "处理时间",
          key: "updateTime"
        },
        {
          title: "消耗时长",
          key: "durationTime"
        },
        {
          title: "流程状态",
          key: "processStatus",
          render: (h, params) => {
            let processStatusT = "";
            switch (params.row.processStatus) {
              case 0:
                processStatusT = "待审批";
                break;
              case 1:
                processStatusT = "审批中";
                break;
              case 2:
                processStatusT = "已中止";
                break;
              case 3:
                processStatusT = "已完结";
                break;
              case 4:
                processStatusT = "业务系统提交失败";
                break;
              case -1:
                processStatusT = "已撤销";
                break;
            }
            return h(
              "p",
              {
                style: {
                  maxWidth: "160px",
                  overflow: "hidden",
                  "text-overflow": "ellipsis",
                  "white-space": "nowrap"
                }
              },
              processStatusT
            );
          }
        },
        {
          title: "详情",
          fixed: "right",
          render: (h, params) =>
            h(
              "p",
              {
                style: {
                  display: "flex",
                  "align-items": "center",
                  "justify-content": "center"
                }
              },
              [
                h(
                  "span",
                  {
                    style: {
                      color: "rgba(16, 142, 233, 1)",
                      cursor: "pointer"
                    },
                    on: {
                      click: () => {
                        params.row.loadType = 0;
                        // window.jflowPlugin.store.dispatch('emptyTabs')
                        // window.fastfish.emit("closedalltab")
                        const query = this.urlParse(params.row.formUrl);
                        const type = params.row.formUrl.split("/")[2];
                        window.jflowPlugin.router.push({
                          path: params.row.formUrl
                        });
                      }
                    }
                  },
                  "查看明细"
                ),
                h("span", {
                  style: {
                    width: "1px",
                    height: "19px",
                    display: "inline-block",
                    background: "rgba(228,228,228,1)",
                    margin: "0 16px"
                  }
                }),
                h(
                  "span",
                  {
                    style: {
                      color: "rgba(16, 142, 233, 1)",
                      cursor: "pointer"
                    },
                    on: {
                      click: () => {
                        window.open(
                          `http://${window.jflowPlugin.jflowIp}/#/FlowChart?instanceId=${params.row.instanceId}`,
                          "_blank",
                          "width=800,height=800"
                        );
                      }
                    }
                  },
                  "流程进度"
                )
              ]
            )
        }
      ],
      data: [],
      standardTableEvent: {
        "on-change": page => {
          this.searchData.page = page;
          this.queryLists();
        },
        "on-page-size-change": pageSize => {
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
      if (newVal === "我已审批的") {
        this.getselectOption();
        this.queryLists();
      }
    }
  },
  methods: {
    urlParse(path) {
      const url = path || window.location.search; // 得到url问号后面拼接的参数  ?id=12345&a=b
      const obj = {}; // 创建一个Object
      const reg = /[?&][^?&]+=[^?&]+/g; // 正则匹配 ?&开始 =拼接  非?&结束  的参数
      const arr = url.match(reg); // match() 方法可在字符串内检索指定的值，或找到一个或多个正则表达式的匹配。
      // arr数组形式 ['?id=12345','&a=b']
      if (arr) {
        arr.forEach(item => {
          /**
           * tempArr数组    ['id','12345']和['a','b']
           * 第一个是key，第二个是value
           * */
          const tempArr = item.substring(1).split("=");
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
      if (
        Object.prototype.toString.call(this.searchData.businessType) ===
          "[object Array]" &&
        this.searchData.businessType.length === 0
      ) {
        delete this.searchData.businessType;
      }
      this.searchData.page = 1;
    },
    getselectOption() {
      this.$network.post("/jflow/p/cs/task/relation/list", {}).then(res => {
        if (res.data.resultCode === 0) {
          this.formLists[1].item.options = res.data.data.relations.map(item => {
            item.value = item.businesskey;
            item.label = item.businessName;
            return item;
          });
        }
      });
    },
    queryLists() {
      this.spinShow = true;
      // 查询列表
      if (
        this.searchData.createTime &&
        this.searchData.createTime[0] &&
        this.searchData.createTime[1]
      ) {
        this.searchData.startTime = new Date(
          this.searchData.createTime[0]
        ).format("yyyy-MM-dd hh:mm");
        this.searchData.endTime = new Date(
          this.searchData.createTime[1]
        ).format("yyyy-MM-dd hh:mm");
      } else {
        this.searchData.startTime = "";
        this.searchData.endTime = "";
      }
      const obj = Object.assign({}, this.searchData);
      delete obj.createTime;
      this.$network
        .post("/jflow/p/cs/task/history/list", obj)
        .then(res => {
          if (res.data.resultCode === 0) {
            const data = res.data.data;
            this.total = data.total;
            this.data = data.records;
          }
          this.spinShow = false;
        })
        .catch(res => {
          this.spinShow = false;
        });
    }
  },
  created() {
   
    // this.queryLists();
  }
};
</script>
<style lang="less">
.burgeon-spin-fix {
  z-index: 100;
}
.HistoricalProcess {
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
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

  .StandardTable {
    position: relative;
    flex: 1;
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
