<template>
  <div class="set-panel">
    <div class="panel-main">
      <div class="panel-item">
        <p>
          <i class="iconfont iconmd-contact explanatory" />
          欢迎: {{ userInfo.ename }}
        </p>
      </div>
      <div class="panel-item">
        <p @click="changePwd">
          <i class="iconfont iconmd-key explanatory" />修改密码
        </p>
      </div>
      <div class="panel-item">
        <p>
          <i class="iconfont iconmd-book explanatory" />
          是否展开收藏夹
          <i-switch
            v-model="showFavorites"
            class="switch"
            @on-change="operationFavorites(showFavorites)"
          />
        </p>
      </div>
      <div class="panel-item">
        <p>
          <i class="iconfont iconmd-apps explanatory" />
          折叠查询条件
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
          <i class="iconfont iconmd-list explanatory" />
          查询条件默认显示行数
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
          <i class="iconfont iconmd-exit explanatory" />
          退出
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
      const showFavorites = JSON.parse(window.localStorage.getItem('showFavorites'));
      if (showFavorites !== null) {
        this.showFavorites = showFavorites;
        this.operationFavorites(showFavorites);
      }
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
                    if (moduleName() && moduleName().indexOf('S', 0) === 0) {
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
        window.localStorage.setItem('showFavorites', showFavorites);
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
              if (moduleName()) {
                if (moduleName() && moduleName().indexOf('S', 0) === 0) {
                  this.$store.commit(`${moduleName()}/updateDefaultSearchFoldnum`, Number(this.num7));
                }
              }
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
      .explanatory{
         position: relative;
         top: 2px;
      }
      .set-panel-number{
         position: absolute;
        right: 15px;
        top: 15px;
        width:50px;
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
