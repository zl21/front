<template>
  <div
  
    class="set-panel"
  >
    <div class="panel-main">
      <div class="panel-item">
        <p>
          <i class="iconfont icon-yonghu-" />
          <span>欢迎: {{ userInfo.ename }}</span>
        </p>
      </div>
      <div class="panel-item">
        <p @click="changePwd">
          <i
            class="iconfont icon-xiugaimima"
          />
          <span>修改密码</span>
        </p>
      </div>
      <div class="panel-item">
        <p>
          <i class="iconfont icon-zhankaichaxuntiaojian" />
          <span>折叠查询条件</span>
          <!-- <el-switch
            v-model="value2"
            class="absrit"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="switchChange()"
          /> -->
        </p>
      </div>
      <div
        v-if="value2"
        class="panel-item"
      >
        <p>
          <i class="iconfont icon-xiugaimima" />
          <span>查询条件默认显示行数</span>
          <!-- <el-input-number
            v-model="num7"
            class="set-panel-number"
            size="mini"
            :min="1"
          /> -->
        </p>
      </div>
      <div class="panel-item">
        <p @click="signout">
          <i class="iconfont icon-tuichu" />
          <span>退出</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
  // import { fetch } from '../../utils/request';
  // import router from '../__config__/router.config';
  import { mapState } from 'vuex';

  export default {
    props: ['panel'],
    computed: {
      ...mapState('global', {
        userInfo: ({ userInfo }) => userInfo,
      }),
    
    
    },
    watch: {
      // num7(val, oldval) {
      //   this.changeNum();
      // },
    },
    data() {
      return {
        actionDialog: { // 自定义动作弹框
          show: false,
          title: '',
        },
        value2: false,
        num7: 3,
        dialogComponent: null,
        setPanel: {
          show: false,
          list: [],
        },
      };
    },
    mounted() {
      // this.axios({ // 查询开关
      //   method: 'post',
      //   url: '/p/cs/getParamList',
      //   data: {
      //   },
      // }).then((res) => {
      //   if (res.data.code == 0) {
      //     if (res.data.data.length > 0) {
      //       for (const param of res.data.data) {
      //         if (param.name === 'isFoldCond') {
      //           this.value2 = JSON.parse(param.value);
      //         } else if (param.name === 'queryDisNumber') {
      //           this.num7 = param.value;
      //           this.$store.state.queryDisNumber = param.value;
      //         }
      //       }
      //     }
      //   }
      // }).catch((error) => {
      //   console.log(error);
      // });
    },
    methods: {
      changePwd() {
        this.$emit('changePwdBox');
      },
      closeMessage() {
      },
      switchChange() {
        this.axios({ // 查询开关
          method: 'post',
          url: '/p/cs/setUserParam',
          data: {
            name: 'isFoldCond', value: this.value2,
          },
        }).then((res) => {
          if (res.data.code === 0) {
          }
        }).catch((error) => {
          console.log(error);
        });
      },
      changeNum() {
        this.axios({ // 查询条件默认显示行数
          method: 'post',
          url: '/p/cs/setUserParam',
          data: {
            name: 'queryDisNumber', value: this.num7,
          },
        }).then((res) => {
          if (res.data.code == 0) {
            this.$store.state.queryDisNumber = this.num7;
          }
        }).catch((error) => {
          console.log(error);
        });
      },
      signout() {
        // fetch('/p/cs/logout').then(() => {
        //   router.push({ path: '/login' });
        // }).catch(() => {
        //   router.push({ path: '/login' });
        // });
      },
    },
  };
</script>


<style lang="less" scoped>
.set-panel {
    .el-button {
      width: 100%;
    }
}

.panel-main {
    .panel-item {
      height: 49px;
      line-height: 49px;
      border-bottom: solid 1px #d8d8d8;
      position: relative;
      cursor: pointer;
      p {
        height: 50px;
        line-height: 50px;
        margin: 0 20px;
      }
      span {
        font-size: 12px;
        color: #000;
      }
      svg {
        width: 18px;
        height: 18px;
      }
		  .absrit{
        position:absolute;
        right: 15px;
        top: 15px;
      }
    }
    .panel-item:hover {
      .item-sign {
        color: #fd6442;
      }
		}
}
</style>
<style lang="less">
  .panel-main {
    .panel-item {
      .set-panel-number.el-input-number {
        height: 24px;
        line-height: 24px;
        width: 80px;
        position: absolute;
        right: 15px;
        top: 15px;
        .el-input-number__decrease {
          height: 22px;
          line-height: 24px;
          width: 24px;
          float: left;
          .el-icon-minus {
            font-size: 14px;
          }
        }
        .el-input-number__increase{
          height: 22px;
          line-height: 24px;
          width: 24px;
          float: right;
          .el-icon-plus {
            font-size: 14px;
          }
        }
        .el-input.el-input--mini {
          .el-input__inner {
            height: 24px;
            font-size: 14px;
            padding: 0 24px;
            text-align: center;
          }
        }
      }
    }
  }
</style>
