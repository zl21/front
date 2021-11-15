<template>
  <div :class="classes">
    <div class="panel-main">
      <div class="panel-item">
        <p :title="getEname">
          <i class="iconfont iconmd-contact explanatory" />
          {{$t('tips.welcome')}}: {{ getEname }}
        </p>
      </div>
      <div class="panel-item">
        <p @click="changePwd">
          <i class="iconfont iconmd-key explanatory" />{{$t('tips.changePassword')}}
        </p>
      </div>
      <component :is="customizeComponent" />
      <div
        v-if="!layoutDirection"
        class="panel-item"
      >
        <p>
          <i class="iconfont iconmd-book explanatory" />
          {{$t('messages.expandFavorite')}}
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
          {{$t('messages.collapseQuery')}}
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
          {{$t('messages.queryDefaultRows')}}
          <InputNumber
            v-model="num7"
            :max="10"
            :min="1"
            class="set-panel-number"
          />
        </p>
      </div>
      <div class="panel-item">
        <p @click="clickSignout">
          <i class="iconfont iconmd-exit explanatory" />
          {{$t('buttons.exit')}}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState, mapMutations, mapActions } from 'vuex';
  import { layoutDirection, enableInitializationRequest, customizeMixins, classFix } from '../constants/global';
  import network, { urlSearchParams } from '../__utils__/network';
  import moduleName from '../__utils__/getModuleName';

  export default {
    name: 'SetPanel',
    props: ['panel'],
    mixins: [customizeMixins().setPanel ? customizeMixins().setPanel : false],
    computed: {
      ...mapState('global', {
        userInfo: ({ userInfo }) => userInfo,
        collapseHistoryAndFavorite: ({ collapseHistoryAndFavorite }) => collapseHistoryAndFavorite,
      }),
      classes() {
        return [
          `${classFix}set-panel`,
        ];
      },
      getEname() {
        if (this.userInfo) {
          return this.userInfo.ename;
        }
        return null;
      }
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
        showFavorites: false,

        customizeComponent: null
      };
    },
    mounted() {
      const showFavorites = JSON.parse(window.localStorage.getItem('showFavorites'));
      if (showFavorites !== null) {
        this.showFavorites = showFavorites;
        // this.operationFavorites(showFavorites);
      }
      this.setDefaultSearchFoldnum();
    },
    methods: {
      ...mapMutations('global', ['doCollapseHistoryAndFavorite', 'emptyTabs', 'updateTreeTableListData']),
      ...mapActions('global', ['signout']),

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
              // console.log(moduleName(),'0000');
              // if (moduleName()) {
              //   if (moduleName() && moduleName().indexOf('S', 0) === 0) {
              //     this.$store.commit('global/updateModifySearchFoldnum', { queryDisNumber: Number(this.num7), switchValue: this.switchValue });
              //   }
              // }
              this.$store.commit('global/updateModifySearchFoldnum', { queryDisNumber: Number(this.num7), switchValue: this.switchValue });

            }
          });
      },
      clickSignout() {
        this.signout();
      }
    },
  };
</script>
