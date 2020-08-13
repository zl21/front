<template>
  <div class="publishContent">
    <div class="pop-title">
      <div class="pop-input">
        <ul>
          <li class="resTop">
            <span>环境:</span>
            <Select
              v-model="envValue"
              style="width:228px"
            >
              <Option
                v-for="(item,index) in env"
                :key="index"
                :value="item"
              >
                {{ item }}
              </Option>
            </Select>
          </li>
        </ul>
      </div>
      <div class="pop-btn">
        <button
          class="sav-btn"
          @click="save"
        >
          <span>{{ chineseName.CONFIRM }}</span>
        </button>
        <button
          class="cancel-btn"
          @click="cancel"
        >
          <span>{{ chineseName.CANCEL }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
  import ChineseDictionary from '../../assets/js/ChineseDictionary';
  import network, { urlSearchParams } from '../../__utils__/network';
  import router from '../../__config__/router.config';

  export default {
    name: 'PublishPrintTemplate',
    props: {
      objList: {
        type: Array,
        default: () => []
      },
      idArray: {// 获取ID用于多选
        type: [Array, Object],
        default: () => {}
      },
    },
    data() {
      return {
        env: [],
        envValue: ''
      };
    },
    components: {},
    methods: {
      getEnvs() {
        network
          .get('/p/cs/getEnvs')
          .then((res) => {
            if (res.data.code === 0) {
              this.env = res.data.data;
            }
          });
      },
      save() {
        if (!this.envValue) {
          const data = {
            mask: true,
            title: '警告',
            content: '请选择环境'
          };
          this.$Modal.fcWarning(data);
          return;
        }
        
        const searchdata = {
          env: this.envValue, 
        };
        const { tableName } = router.currentRoute.params;

        if (this.idArray.length === 0) {
          const data = {
            mask: true,
            title: '警告',
            content: '当前的操作会执行全量覆盖！是否继续？',
            onOk: () => {
              const datas = {
                tableName,
                searchdata
              };
              this.publish(datas);
            }
          };
          this.$Modal.fcWarning(data);
        } else {
          searchdata.ids = this.idArray;
          const datas = {
            tableName,
            searchdata
          };
          this.publish(datas);
        }
        console.log(999, searchdata);
      }, // 确定
      publish(data) {
        this.$R3loading.show();
        network.post('/p/cs/print/release', urlSearchParams(data.searchdata))
          .then((res) => {
            this.$R3loading.hide(data.tableName);
            if (res.data.code !== 0) {
              return;
            }
            if (res.data.code === 0) {
              const message = res.data.message;
              const datas = {
                mask: true,
                title: '成功',
                content: message
              };
              this.$Modal.fcSuccess(datas);
              this.$emit('closeActionDialog', true); // 关闭弹框
            }
          }).catch(() => {
            this.$R3loading.hide(data.tableName);
          });
      },
      cancel() {
        this.$emit('closeActionDialog', false); // 关闭弹框
      }, // 取消
    },
    created() {
      this.chineseName = ChineseDictionary;
    },
    mounted() {
      // this.$emit('setTitle', '环境'); // 关闭弹框

      this.getEnvs();
    },
   
  };
</script>
<style lang="less" scoped type="text/less">
.publishContent {
  font-size: 12px;
  height: 98px;
  .pop-title {
    // width: 400px;
    height: 152px;
    box-sizing: border-box;
  }
  .pop-input {
    padding-top: 10px;
    ul {
      list-style: none;
    }
    li {
      margin-bottom: 10px;
      .version {
        width: 228px;
        height: 22px;
        border-radius: 2px;
      }
    }
    .resTop{
      margin-bottom: 15px;
    }
    span {
      display: inline-block;
      width: 100px;
      text-align: right;
    }
    input {
      border: 1px solid #d8d8d8;
      width: 228px;
      height: 24px;
      padding: 0 7px;
      border-radius: 2px;
      font-size: 12px;
      color: #575757;
      transition: border-color 0.2s ease;
      margin-left: -1px;
    }
    input:focus {
      border-color: #0f8ee9;
    }
  }
  .pop-btn {
    text-align: right;
    padding: 6px 40px 0 0;
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
