<template>
  <div
    v-if="showModule.Navigator"
    :class="classes"
  >
    <div
      class="left"
      :style="{ width: collapseHistoryAndFavorite ? '50px' : '180px' }"
    >
      <img
        v-if="!collapseHistoryAndFavorite&&enableHistoryAndFavoriteUI"
        class="trigger"
        :title="$t('messages.collapseFavorites')"
        alt=""
        :src="imgSrc.closedImg"
        @click="doCollapseHistoryAndFavorite"
      >
      <img
        v-if="collapseHistoryAndFavorite&&enableHistoryAndFavoriteUI"
        class="trigger"
        alt=""
        :title="$t('messages.expandFavorites')"
        :src="imgSrc.openedImg"
        @click="doCollapseHistoryAndFavorite"
      >
      <div id="navBrandImg">
        <img
          v-if="!collapseHistoryAndFavorite"
          class="banner"
          alt=""
          :src="imgAssets.banner"
        >
        <img
          v-if="collapseHistoryAndFavorite"
          class="logo"
          alt=""
          :src="imgSrc.logoImg"
        >
      </div>
    </div>
    <div class="middle">
      <div style="display: flex;">
        <NavigatorPrimaryMenu
          v-for="(menu, index) in menuLists"
          :key="`primary-menu-${index}`"
          :data="menu"
          :index="index"
          @togglePrimaryMenu="togglePrimaryMenu"
        />
      </div>
    </div>
    <transition name="fade">
      <NavigatorSubMenu
        v-show="primaryMenuIndex!==-1"
        :data="togglePrimaryMenuData || []"
      />
    </transition>
    <div
      v-for="(item,index) in navigatorSetting"
      :key="index"
      class="tag right"
      style="width:auto;display:flex"
    >
      <Badge
        style="width:50px;height:50px"
        :offset="['6px','-8px']"
        :count="item.count"
        @click.native="item.callback"
      >
        <i
          class="iconfont"
          :class="item.icon"
        />
      </Badge>
    </div>
    <div
      v-if="getDashboardConfig"
      @click="dashboardClick"
      class="tag right"
    >
      <i
        :class="getDashboardConfig"
        :title="$t('tips.backHome')"

      />
    </div>

    <ComAutoComplete />
    <div
      v-if="versionValue"
      class="tag right"
      @click.prevent="messageSlide"
    >
      <Badge :count="taskMessageCount">
        <i
          class="iconfont iconbj_message badge"
        />
      </Badge>
    </div>

    <!-- 消息队列 -->
    <MessageList v-model="showMessages"></MessageList>
    <!-- <Drawer
      v-model="messagePanel.show"
      :closable="false"
    >
      <messagePanel
        v-if="Version==='1.4'"
        :panel="messagePanel"
        @markRead="markReadNote"
        @ignoreMsg="ignoreMsg"
        @jumpTask="jumpTask"
        @nextPage="nextPage"
      />
      <message-panel-older
        v-if="Version==='1.3'"
        :panel="messagePanel"
        @markRead="markReadNote"
        @ignoreMsg="ignoreMsg"
        @jumpTask="jumpTask"
        @nextPage="nextPage"
      />
    </Drawer> -->
    <div
      class="tag right"
      @click="show = true"
    >
      <i
        class="iconfont iconmd-person"
        :title="$t('buttons.setting')"
      />
    </div>

    <!-- 设置 -->
    <Setting v-model="show"></Setting>
    <!-- <Drawer
      v-model="show"
      :closable="false"
    >
      <SetPanel
        :panel="setPanel"
        @changePwdBox="changePwdBox"
      />
    </Drawer>
    <Dialog
      ref="dialogRef"
      :title="dialogConfig.title"
      :mask="dialogConfig.mask"
      :content-text="dialogConfig.contentText"
      :footer-hide="dialogConfig.footerHide"
      :confirm="dialogConfig.confirm"
      :dialog-component-name="dialogComponentName"
    /> -->
  </div>
</template>

<script>
  import { mapState, mapMutations, mapActions, mapGetters } from 'vuex';
  import NavigatorPrimaryMenu from './NavigatorPrimaryMenu';
  // import SetPanel from './SetPanel';
  // import messagePanel from './messagePanel';
  // import messagePanelOlder from './messagePanelOlder'; // 1.3
  import Setting from './nav/Setting.vue'
  import MessageList from './nav/MessageList.vue'

  import ComAutoComplete from './ComAutoComplete';
  // import Dialog from './Dialog.vue';
  import { routeTo } from '../__config__/event.config';
  import network, { urlSearchParams } from '../__utils__/network';
  import NavigatorSubMenu from './NavigatorSubMenu';
  import {
    STANDARD_TABLE_LIST_PREFIX, Version, enableHistoryAndFavoriteUI, enableGateWay, getGatewayValue,dashboardConfig,messageSwitch, classFix
  } from '../constants/global';
  import { updateSessionObject } from '../__utils__/sessionStorage';
  import noticeMixin from './nav/noticeMixin'

  export default {
    name: 'Navigator',

    mixins: [noticeMixin],

    components: {
      NavigatorPrimaryMenu,
      // SetPanel,
      Setting,
      MessageList,
      // Dialog,
      NavigatorSubMenu,
      // messagePanel,
      // messagePanelOlder,
      ComAutoComplete
    },

    data() {
      return {
        // primaryMenuShow: false,
        // messagePanel: {
        //   show: false,
        //   list: [],
        //   loaded: true,
        //   start: 0,
        //   total: 0
        // },
        show: false,
        searchBtn: true,
        searchList: [],
        // setPanel: {
        //   show: true,
        //   list: [],
        // },
        keyWord: '',
        // dialogConfig: {
        //   title: this.$t('feedback.alert'),
        //   mask: true,
        //   footerHide: false,
        //   contentText: '',
        //   confirm: () => {
        //   },
        // }, // 弹框配置信息
        // dialogComponentName: null,
        togglePrimaryMenuData: [],
        // Version: Version(),
        messageTimer: null,
        showMessages: false
      };
    },
    computed: {
      ...mapState('global', {
        collapseHistoryAndFavorite: ({ collapseHistoryAndFavorite }) => collapseHistoryAndFavorite,
        menuLists: ({ menuLists }) => menuLists,
        navigatorSetting: ({ navigatorSetting }) => navigatorSetting,
        showModule: ({ showModule }) => showModule,
        userInfo: ({ userInfo }) => userInfo,
        primaryMenuIndex: state => state.primaryMenuIndex,
        taskMessageCount: state => state.taskMessageCount,
        imgSrc: state => state.imgSrc,
        isShowDashboardPage: state => state.isShowDashboardPage,
      }),
      ...mapGetters('global', ['imgAssets']),
      getDashboardConfig() {
        if (dashboardConfig() && dashboardConfig().iconClass) {
          return dashboardConfig().iconClass;
        }
        return false;
      },
      enableHistoryAndFavoriteUI() {
        return enableHistoryAndFavoriteUI();
      },
      versionValue() {
        if (Version() === '1.4') {
          if (messageSwitch()) {
            return true;
          }
          return false;
        }
        return true;
      },
      userId() {
        return this.userInfo && this.userInfo.id;
      },
      classes() {
        return [
          `${classFix}navigator`,
        ];
      },
    },
    watch: {
      userId(val) {
        // if (val && Version() === '1.3') {
        //   this.getTaskMessageCount(val);
        // }
        if (val) {
          this.getTaskMessageCount(val);
        }
      },

      taskMessageCount(newVal, oldVal) {
        if(newVal > oldVal) {
          if(this.noticeTimer) {
            clearTimeout(this.noticeTimer);
            this.noticeTimer = setTimeout(() => {
              this._getTaskNotice()
              this.noticeTimer = null
            }, 4000)
            return
          }
          this.noticeTimer = setTimeout(() => {
            this._getTaskNotice()
            this.noticeTimer = null
          }, 4000)
        }
      },

      showModule(val) {
        if (!val.Navigator) {
          if (this.$el) {
            this.$el.parentElement.hidden = true;
            this.$el.parentElement.parentElement.hidden = true;
            this.$el.parentElement.nextElementSibling.firstElementChild.lastElementChild.firstElementChild.firstElementChild.style.padding = '0px';
            this.$el.parentElement.nextElementSibling.firstElementChild.lastElementChild.style.margin = '0px';
          }
        }
      },
      searchBtn(val) {
        if (val === false) {
          setTimeout(() => {
            this.$refs.AutoComplete.$el.querySelector('input').focus();
            // this.$refs.AutoComplete.$el.querySelector('input').click();
          }, 300);
        }
      },
      searchList() {
        this.$refs.AutoComplete.$el.querySelector('input').click();
      }
    },
    methods: {
      ...mapActions('global', ['getTaskMessageCount', 'updataTaskMessageCount']),
      ...mapMutations('global', ['updateDashboardPageValue', 'updateTaskMessageCount', 'doCollapseHistoryAndFavorite', 'changeSelectedPrimaryMenu', 'hideMenu', 'tabOpen', 'directionalRouter']),
      togglePrimaryMenu(data, index) {
        this.togglePrimaryMenuData = data;
        if (index === this.primaryMenuIndex) {
          this.hideMenu();
        } else {
          this.changeSelectedPrimaryMenu(index);
        }
      },
      dashboardClick() {
        if (this.$router.currentRoute.path !== '/') {
          this.updateDashboardPageValue();
        }
      },
      messageSlide() {
        this.showMessages = !this.showMessages
        // this.messagePanel.show = !this.messagePanel.show;
        // if (this.messagePanel.show) {
        //   this.getMessages(0);
        // }
        // this.searchShow = true;
        // this.cascaderShow = false;
        // this.cascaderOpen = false;
        // this.setPanel.show = false;
      },
      // ignoreMsg() { // 我的任务忽略功能
      //   network.post(Version() === '1.3' ? '/p/cs/ignoreAllMsg' : '/p/cs/u_note/ignoreMsg', {}, {
      //     serviceId: enableGateWay() ? 'asynctask' : ''
      //   }).then((res) => {
      //     if (res.data.code === 0) {
      //       this.updateTaskMessageCount(0);
      //       this.getMessages(0);
      //     }
      //   });
      // },
      // jumpTask() { // 跳转我的任务列表界面
      //   this.messagePanel.show = false;
      //   const type = STANDARD_TABLE_LIST_PREFIX;
      //   const tab = {
      //     type,
      //     tableName: Version() === '1.3' ? 'CP_C_TASK' : 'U_NOTE',
      //     tableId: Version() === '1.3' ? 24386 : 963,
      //     label: this.$t('tips.myTask')
      //   };
      //   this.tabOpen(tab);
      // },

      // nextPage() {
      //   if (this.messagePanel.start < this.messagePanel.total) {
      //     this.getMessages();
      //   }
      // },

      // getMessages(start) { // 请求我的任务数据
      //   const self = this;
      //   //        self.panel.list = [];
      //   if (start !== undefined) {
      //     self.messagePanel.start = start;
      //     self.messagePanel.list = [];
      //   }
      //   let fixedcolumns = {};
      //   if (Version() === '1.3') {
      //     fixedcolumns = {
      //       OPERATOR_ID: [this.userInfo.id],
      //       READSTATE: ['=0'],
      //       TASKSTATE: ['=2', '=3']
      //     };
      //   } else {
      //     fixedcolumns = {
      //       OPERATOR_ID: [this.userInfo.id],
      //       READ_STATE: ['=0'],
      //     };
      //   }
      //   const searchdata = {
      //     table: Version() === '1.3' ? 'CP_C_TASK' : 'U_NOTE',
      //     column_include_uicontroller: true,
      //     fixedcolumns,
      //     multiple: [],
      //     startindex: self.messagePanel.start,
      //     range: 20,
      //     orderby: [{ column: Version() === '1.3' ? 'CP_C_TASK.ID' : 'U_NOTE.ID', asc: false }]
      //   };
      //   network.post('/p/cs/QueryList', urlSearchParams({ searchdata }), {
      //     serviceId: enableGateWay() ? getGatewayValue('U_NOTE') : ''
      //   }).then((res) => {
      //     const result = res.data;
      //     if (!result.datas) {
      //       result.datas = result.data;
      //     }

      //     if (result.code === 0) {
      //       self.messagePanel.list = self.messagePanel.list.concat(result.datas.row);
      //       self.messagePanel.start = result.datas.start + result.datas.rowCount;
      //       self.messagePanel.total = result.datas.totalRowCount;
      //       // 更新消息
      //       this.updateTaskMessageCount(self.messagePanel.total);
      //     //            self.panel.start = result.start
      //     }
      //   });
      // },

      // markReadNote(item) { // 我的任务单条跳转单对象界面
      //   this.messagePanel.show = false;
      //   this.updataTaskMessageCount({ id: item.ID.val });
      //   const type = 'tableDetailVertical';
      //   const tab = {
      //     type,
      //     tableName: Version() === '1.3' ? 'CP_C_TASK' : 'U_NOTE',
      //     tableId: Version() === '1.3' ? 24386 : 963,
      //     id: item.ID.val
      //   };
      //   this.tabOpen(tab);
      // },

      // changePwdBox() {
      //   this.show = false;
      //   this.$refs.dialogRef.open();
      //   this.dialogConfig.title = this.$t('tips.changePassword');
      //   this.dialogConfig.footerHide = true;
      //   // Vue.component('ChangePassword', CustomizeModule.ChangePassword.component);
      //   this.dialogComponentName = 'ChangePassword';
      // },
      enter(event) {
        if (event.keyCode === 13) {
          let index = 0;
          if (this.$refs.AutoComplete.$refs.select.focusIndex !== -1) {
            index = this.$refs.AutoComplete.$refs.select.focusIndex;
          } else {
            index = 0;
          }
          const routerItem = this.searchList[index];

          if (routerItem) {
            this.routeTonext(routerItem);
          }
        }
      },
      routeTonext(data) {
        const {
          name, url, type, tabid, actid
        } = data;
        let tableId = '';
        if (type === 'table') {
          tableId = tabid;
        } else {
          tableId = actid;
        }
        // window.sessionStorage.setItem('dynamicRoutingForHideBackButton', true);
        window.sessionStorage.setItem('dynamicRouting', true);
        if (url) {
          const menuType = url.substring(url.lastIndexOf('/') + 1, url.length);
          if (menuType === 'New') {
            const modifyPageUrl = url.substring(0, Number(url.length) - 3);
            const clickMenuAddSingleObjectData = {
              k: `/${url}`,
              v: modifyPageUrl
            };
            updateSessionObject('clickMenuAddSingleObject', clickMenuAddSingleObjectData);
          }
        }
        routeTo({ type, info: { tableName: name, tableId, url } }, () => {
          this.keyWord = '';
          setTimeout(() => {
            this.searchList = [];
          }, 100);
        });
        // }
      },
      searchData(value) {
        this.searchList = [];
        if (value === undefined || value.length < 1) {
          return;
        }
        const values = this.$refs.AutoComplete.$el.querySelector('input').value;
        if (values !== value) {
          return;
        }
        network
          .post(
            '/p/cs/SearchWords',
            urlSearchParams({
              words: value,
            })
          )
          .then((r) => {
            if (r.status === 200 && r.data.code === 0) {
              this.searchList = r.data.data || r.data.datas;
            }
          });
      },
      setBtn() {
      },
      routerNext(name) {
        const index = name.value;
        const routerItem = this.searchList[index];
        if (routerItem) {
          this.routeTonext(routerItem);
        }
        //
      },
      getMessageCount() {
        if (!this.userInfo.id) {
          return;
        }
        this.getTaskMessageCount(this.userInfo.id);
      },
    },

    async mounted() {
      // if (Version() === '1.3') {
      //   this.messageTimer = setInterval(() => {
      //     this.getMessageCount();
      //   }, 30000);
      // }
      this.messageTimer = setInterval(() => {
        this.getMessageCount();
      }, 3000);
      if (this.showModule && !this.showModule.Navigator) {
        if (this.$el) {
          this.$el.parentElement.hidden = true;
          this.$el.parentElement.parentElement.hidden = true;
          this.$el.parentElement.nextElementSibling.firstElementChild.lastElementChild.firstElementChild.firstElementChild.style.padding = '0px';
          this.$el.parentElement.nextElementSibling.firstElementChild.lastElementChild.style.margin = '0px';
        }
      }
    },
    beforeDestroy() {
      clearInterval(this.messageTimer);
    }
  };
</script>

