<template>
  <div class="clonePopUp">
    <div class="pop-title">
      <div class="pop-input">
        <ul>
          <li class="resTop">
            <span>objID:</span>
            <Select
              v-model="model1"
              style="width:228px"
            >
              <Option
                v-for="(item,index) in objID"
                :key="index"
                :value="item"
              >
                {{ item }}
              </Option>
            </Select>
          </li>
          <li>
            <span>env:</span>
            <input
              v-model="env"
              type="text"
            >
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

  export default {
    name: 'ClonePopUp',
    props: {
      objList: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {
        objID: [],
        model1: '',
        env: ''
      };
    },
    components: {},
    methods: {
      getEnvs() {
        network
          .get('/p/cs/getEnvs')
          .then((res) => {
            if (res.data.code === 0) {
              this.objID = res.data.data;
            }
          });
      },
      save() {
        if (!this.model1 || !this.env) {
          const data = {
            title: 'warning',
            content: '请输入objID名或env'
          };
          this.$Modal.fcWarning(data);
          return;
        }
        const searchdata = {
          env: this.env, // 源表表名
          objid: this.model1, // 目标表名
        };
        network.post('/p/cs/release', searchdata)
          .then((res) => {
            if (res.data.code !== 0) {
              return;
            }
            const data = {
              title: 'success',
              content: '提交成功'
            };
            this.$Modal.fcWarning(data);
            this.$emit('closeActionDialog', true); // 关闭弹框
          });
      }, // 确定
      cancel() {
        this.$emit('closeActionDialog', false); // 关闭弹框
      }, // 取消
    
      errorDialogClose() {
        this.errorDialog = false;
      } // 关闭弹框
    },
    created() {
      this.chineseName = ChineseDictionary;
    },
    mounted() {
      this.getEnvs();
    }
  };
</script>
<style lang="less" scoped type="text/less">
.clonePopUp {
  font-size: 12px;
  height: 174px;
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
