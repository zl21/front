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
      <div
        v-if="!layoutDirection"
        class="panel-item"
      >
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
            @on-change="switchChange(switchValue)"
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
  import { getTouristRoute, enableInitializationRequest, layoutDirection } from '../constants/global';
  import router from '../__config__/router.config';
  import network, { urlSearchParams, GetTableName } from '../__utils__/network';
  import moduleName from '../__utils__/getModuleName';
  import { removeSessionObject } from '../__utils__/sessionStorage';


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
        layoutDirection: layoutDirection(), // 收藏夹是否展示
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
      ...mapMutations('global', ['doCollapseHistoryAndFavorite', 'emptyTabs', 'updateTreeTableListData']),
      setDefaultSearchFoldnum() {
        if (enableInitializationRequest()) {
          network
            .post('/p/cs/getParamList')
            .then((res) => {
              if (res.data.code === 0) {
                if (res.data.data.length > 0) {
                  res.data.data.forEach((param) => {
                    if (param.name === 'isFoldCond') { // 设置为false时，展开全部，为true时，展开设置的行数
                      this.switchValue = JSON.parse(param.value);// 为true时展开收藏夹
                    } else if (param.name === 'queryDisNumber') {
                      this.num7 = Number(param.value);// 设置折叠条件
                    }
                    this.$store.commit('global/updateModifySearchFoldnum', { queryDisNumber: this.num7, switchValue: this.switchValue });
                  });
                } else { // 数组为空时，展示全部
                  this.$store.commit('global/updateModifySearchFoldnum', { queryDisNumber: null, switchValue: false });
                }
              }
            });
        }
      },
      changePwd() {
        this.$emit('changePwdBox');
      },
      switchChange(switchValue) {
        const param = {
          name: 'isFoldCond',
          value: this.switchValue
        };
        this.$store.commit('global/updateModifySearchFoldnum', { queryDisNumber: Number(this.num7), switchValue });

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
                  this.$store.commit('global/updateModifySearchFoldnum', { queryDisNumber: Number(this.num7), switchValue: this.switchValue });
                }
              }
            }
          });
      },
      signout() {
        network
          .get('/p/cs/logout')
          .then(() => {
            window.sessionStorage.setItem('loginStatus', false);
            this.emptyTabs();
            router.push({ path: getTouristRoute() });
            removeSessionObject('saveNetwork');
            GetTableName('');
            this.$store.commit('global/updataUserInfoMessage', {});
            window.localStorage.removeItem('userInfo');
            this.$store.commit('global/updateJflowControlField', []);
            // 清空updataTreeId
            removeSessionObject('TreeId');
            this.updateTreeTableListData([]);
          })
          .catch(() => {
            window.sessionStorage.setItem('loginStatus', false);// 清除登陆标记
            router.push({ path: getTouristRoute() });
            window.localStorage.removeItem('userInfo');
            this.$store.commit('global/updataUserInfoMessage', {});
            removeSessionObject('saveNetwork');
            removeSessionObject('TreeId');
            this.updateTreeTableListData([]);
          });
      }
    },
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
