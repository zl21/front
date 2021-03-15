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
  import router from '../../__config__/router.config';

  export default {
    name: 'PrintTemplate',
    props: {
      
    },
    data() {
      return {
        checkItem: {},
        printTemplateData: [],
      };
    },
    computed: {
      ...mapState('global', {
        userInfo: ({ userInfo }) => userInfo,
      }),
    }, 
    components: {},
    methods: {
               
      CheckItem(item) {
        this.checkItem = item;
      },
      save() {
        const userId = this.userInfo.id; 
        const printId = this.checkItem.ID;
        const { tableId } = this.$route.params;

        if (!printId) {
          const data = {
            mask: true,
            title: '警告',
            content: '请选择一个模版'
          };
          this.$Modal.fcWarning(data);
          return;
        }
             
        network.post('/api/rpt/userprint/save', urlSearchParams({ printId, userId, tableId }))
          .then((res) => {
            if (res.data.code !== 0) {
              return;
            }
            if (res.data.code === 0) {
              this.$emit('closeActionDialog', true); // 关闭弹框
              const message = res.data.message;
              const data = {
                mask: true,
                title: '成功',
                content: message
              };
              this.$Modal.fcSuccess(data);
              // this.$emit('dialogComponentSaveSuccess',);//此方法用于保存并打印功能，现改为只保存
              this.$emit('closeActionDialog', false); // 关闭弹框
            }
          });
      }, // 确定
      cancel() {
        this.$emit('closeActionDialog', false); // 关闭弹框
      }, // 取消

    },
    created() {
    },
    mounted() {
      const { tableId, itemId } = router.currentRoute.params;
      const userId = this.userInfo.id;
      network.post('/api/rpt/print/query', urlSearchParams({ tableId, userId }))
        .then((res) => {
          if (res.data.code !== 0) {
            return;
          }
          if (res.data.code === 0) {
            res.data.data.forEach((element) => {
              if (element.ISDEFAULT === 'Y') {
                this.checkItem = element;
              }
            });
            this.printTemplateData = res.data.data;
          }
        });
    }
  };
</script>
<style lang='less'>
.printTemplate{
  width:520px;
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
