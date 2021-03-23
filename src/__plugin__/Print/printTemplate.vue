<template>
  <div class="printTemplate">
    <div class="table-c">
      <table
        border="0"
        cellspacing="0"
        cellpadding="0"
      >
        <tr class="th">
          <td>
            默认
          </td>
          <td>
            模版名称
          </td>
        </tr>
        <tr
          v-for="(item, index) in printTemplateData"
          :key="index"
        >
          <td>
            <input
              v-model="item.ISDEFAULT"
              type="radio"
              name="radio"
              value="Y"
              @click="CheckItem(item)"
            >
          </td>
          <td>{{ item.NAME }}</td>
        </tr>
        <tr>
          <td
            v-if="printTemplateData.length<1"
            colspan="2"
          >
            暂无数据
          </td>
        </tr>
      </table>
    </div>

 
    <div class="pop-btn">
      <button
        class="sav-btn"
        @click="save"
      >
        <span>确定</span>
      </button>
      <button
        class="cancel-btn"
        @click="cancel"
      >
        <span>取消</span>
      </button>
    </div>
  </div>
</template>
<script>
  import { mapState } from 'vuex';
  import network, { urlSearchParams } from '../../__utils__/network';

  export default {
    name: 'PrintTemplate',
    props: {
     
    },
    data() {
      return {
        checkItem: {},
        printTemplateData: [],
        tableId: '', // 主表ID
        userId: '', // 用户ID
      };
    },
    computed: {
      ...mapState('global', {
        showModule: ({ showModule }) => showModule// 隐藏菜单栏和收藏夹
      }),
    }, 
    watch: {
     
    },
    components: {},
    methods: {
      getTempleteData(tableId, userId) {
        network.post('/api/rpt/print/query', urlSearchParams({ tableId, userId }))
          .then((res) => {
            if (res.data.code !== 0) {
              const data = {
                title: '错误',
                content: res.data
              };
              this.$Modal.fcError(data);
              return;
            }
            if (res.data.code === 0) {
              res.data.data.forEach((element) => {
                if (element.ISDEFAULT === 'Y') {
                  this.checkItem = element;
                }
              });
              this.printTemplateData = res.data.data;
            // this.$emit('closeActionDialog', true); // 关闭弹框
            }
          });
      },
             
      CheckItem(item) {
        this.checkItem = item;
      },
      save() {
        const userId = this.userId; 
        const printId = this.checkItem.ID;
        const { tableId } = this.$route.params;

        // const path = this.$route.path;// 获取当前路由
        // const templatePath = path.replace('PRINTTEMPLATE', 'PRINTPREVIEW');
        // this.$router.push(templatePath);
        if (!printId) {
          const data = {
            title: 'warni警告ng',
            content: '请选择一个模版'
          };
          this.$Modal.fcWarning(data);
          return;
        }
       
        network.post('/api/rpt/userprint/save', urlSearchParams({ printId, userId, tableId }))
          .then((res) => {
            if (res.data.code !== 0) {
              const data = {
                title: '错误',
                content: res.data
              };
              this.$Modal.fcError(data);
              return;
            }
            if (res.data.code === 0) {
              const message = res.data.message;
              const data = {
                mask: true,
                title: 'success',
                content: message
              };
              this.$Modal.fcSuccess(data);
              setTimeout(() => {
                window.close(); 
              }, 1000);
              // const path = this.$route.path;// 获取当前路由
              // const templatePath = path.replace('PRINTTEMPLATE', 'PRINTPREVIEW');
              // this.$router.push(templatePath);
            }
          });
      }, // 确定
      cancel() {
        window.close(); 
      }, // 取消
      getEventListenerParam() {
        if (!this._inactive) {
          if (window.opener) {
            window.opener.postMessage({ ready: true }, '*');// 向全局发送消息
          }

          window.addEventListener('message', (event) => {
            if (event.data.print) {
              this.tableId = event.data.print.tableId; // 主表id
              this.userId = event.data.print.userId; // 用户id
              // 打印预览需要的参数d
              // const printPreview = {
              //   tableName: event.data.print.tableName,
              //   userId: event.data.print.userId,
              //   objIds: event.data.print.objIds
              // };
              // this.tableName = event.data.print.tableName;
              // this.userId = event.data.print.userId;
              // this.objIds = event.data.print.objIds;
              // window.sessionStorage.setItem('printPreview', JSON.stringify(printPreview));// 存打印模版所需参数
              if (this.tableId && this.userId) {
                this.getTempleteData(this.tableId, this.userId);
              }
            }
          }, false);
        }
      }
    },
    created() {
    },
    mounted() {
      this.$store.commit('global/setLayout', false);
      this.getEventListenerParam();
    },
    beforeshowModule() {
      window.removeEventListener('message', this.getEventListenerParam);
    }
  };
</script>
<style lang='less'>
.printTemplate{
  .th{
    background: #f8f8f9;
  }
 .table-c {
   table{
   width:100%;
   border-right:1px solid #e8eaec;
   border-bottom:1px solid #e8eaec;
      td{
        border-left:1px solid #e8eaec;
        border-top:1px solid #e8eaec;
        height: 26px;
        padding: 0 10px;
        }
   }
 }
 .pop-btn {
    text-align: right;
    padding: 6px 0 0 0;
    .sav-btn,
    .cancel-btn {
      padding: 0 18px;
      width: 66px;
      height: 24px;
      box-sizing: border-box;
      background-color: #fff;
      border: 1px solid;
      color: #fd6442;
      font-size: 12px;
      border-radius: 2px;
      span {
        color: #fd6442;
      }
    }
    .sav-btn:hover,
    .cancel-btn:hover {
      background-color: rgba(253, 100, 66, 0.3);
      color: rgba(253, 100, 66, 0.6);
    }
  }
}
   
</style>
