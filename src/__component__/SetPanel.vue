<template>
  <div class="set-panel">
    <div class="panel-main">
      <div class="panel-item">
        <p>
          <i class="iconfont icon-yonghu-" />
          <span>欢迎: {{ userInfo.ename }}</span>
        </p>
      </div>
      <div class="panel-item">
        <p @click="changePwd">
          <i class="iconfont icon-xiugaimima" />
          <span>修改密码</span>
        </p>
      </div>
      <div class="panel-item">
        <p>
          <i class="iconfont icon-liebiao-shoucang left-icon" />
          <span>是否展开收藏夹</span>
          <i-switch
            v-model="showFavorites"
            class="switch"
            @on-change="operationFavorites(showFavorites)"
          />
        </p>
      </div>
      <div class="panel-item">
        <p>
          <i class="iconfont icon-zhankaichaxuntiaojian" />
          <span>折叠查询条件</span>
          <i-switch
            v-model="switchValue"
            class="switch"
            @on-change="switchChange()"
          />
        </p>
      </div>
      <div
        v-if="switchValue"
        class="panel-item"
      >
        <p>
          <i class="iconfont icon-xiugaimima" />
          <span>查询条件默认显示行数</span>
          <InputNumber
            v-model="num7"
            :max="10"
            :min="1"
            class="set-panel-number"
          />
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
  import { mapState, mapMutations } from 'vuex';

  import router from '../__config__/router.config';
  import network, { urlSearchParams } from '../__utils__/network';
  import moduleName from '../__utils__/getModuleName';


  export default {
    name: 'SetPanel',
    props: ['panel'],
    computed: {
      ...mapState('global', {
        userInfo: ({ userInfo }) => userInfo,
        collapseHistoryAndFavorite: ({ collapseHistoryAndFavorite }) => collapseHistoryAndFavorite,
      })
    },
    watch: {
      num7() {
        this.changeNum();
      },
    },
    data() {
      return {
        actionDialog: {
          // 自定义动作弹框
          show: false,
          title: ''
        },
        switchValue: false,
        num7: 3,
        dialogComponent: null,
        setPanel: {
          show: false,
          list: []
        },
        showFavorites: false
      };
    },
    mounted() {
      const showFavorites = JSON.parse(window.sessionStorage.getItem('showFavorites'));
      this.showFavorites = showFavorites;
      this.operationFavorites(showFavorites);

      this.setDefaultSearchFoldnum();
    },
    methods: {
      ...mapMutations('global', ['doCollapseHistoryAndFavorite']),
      setDefaultSearchFoldnum() {
        network
          .post('/p/cs/getParamList')
          .then((res) => {
            if (res.data.code === 0) {
              if (res.data.data.length > 0) {
                res.data.data.forEach((param) => {
                  if (param.name === 'isFoldCond') {
                    this.switchValue = JSON.parse(param.value);
                  } else if (param.name === 'queryDisNumber') {
                    this.num7 = Number(param.value);
                    if (moduleName().indexOf('S', 0) !== -1) {
                      this.$store.commit(`${moduleName()}/updateDefaultSearchFoldnum`, param.value);
                    }
                  }
                });
              }
            }
          });
      },
      changePwd() {
        this.$emit('changePwdBox');
      },
      switchChange() {
        const param = {
          name: 'isFoldCond',
          value: this.switchValue
        };
        network
          .post('/p/cs/setUserParam', urlSearchParams(param))
          .then(() => {
            
          });
      },
      operationFavorites(showFavorites) {
        window.sessionStorage.setItem('showFavorites', showFavorites);
        this.doCollapseHistoryAndFavorite({ showFavorites });
      },
      changeNum() {
        const param = {
          name: 'queryDisNumber',
          value: this.num7
        };
        network
          .post('/p/cs/setUserParam', urlSearchParams(param))
          .then((res) => {
            if (res.data.code === 0) {
              this.$store.commit(`${moduleName()}/updateDefaultSearchFoldnum`, Number(this.num7));
            }
          });
      },
      signout() {
        network
          .get('/p/cs/logout')
          .then(() => {
            router.push({ path: '/login' });
          })
          .catch(() => {
            router.push({ path: '/login' });
          });
      }
    }
  };
</script>


<style lang="less" scoped>
.set-panel {
  .panel-main {
    .panel-item {
      height: 49px;
      line-height: 49px;
      border-bottom: solid 1px #d8d8d8;
      position: relative;
      .set-panel-number{
         position: absolute;
        right: 15px;
        top: 15px;
      }
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
      .switch {
        position: absolute;
        right: 15px;
        top: 15px;
      }
    }
  }
  .burgeon-switch-checked {
        border: 1px solid#19be6b !important;
    background-color: #19be6b !important;
}
    .burgeon-input-number-handler-wrap {
    opacity: 1 !important;
    background :red  !important;
}
}
</style>
