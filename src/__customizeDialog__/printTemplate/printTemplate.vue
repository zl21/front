<template>
  <div :class="classes">
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
  import { classFix } from '../../constants/global';

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
      classes: () => `${classFix}printTemplate`
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
            title: this.$t('feedback.warning'),
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
                title: this.$t('feedback.success'),
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
