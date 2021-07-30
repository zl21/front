<template>
  <div
    v-if="showModule.Navigator"
    :class="classes"
  >
   <component :is="slotName">
<!-- 操作按钮切换左边面板 -->
      <div
        class="tag"
        title="折叠"
        slot="icon-tag"
        @click="toggle"
      >
        <i
          v-if="!iconShow"
          class="iconfont iconbj-fold"
        />
        <i
          v-if="iconShow"
          class="iconfont iconbj-unfold"
        />
      </div>
      <!-- 最近操作 -->
       <div
      v-if="getDashboardConfig"
      @click="dashboardClick" slot="icon-home"
      class="tag right"
    >
      <i
        :class="getDashboardConfig"
        title="回到首页"

      />
    </div>
      <div
        v-if="enableHistoryAndFavoriteUI"
        class="HistoryAndFavorite-time"
        slot="icon-time"
      >
        <Dropdown ref="Dropdown" trigger="click"  class="HistoryAndFavorite-Dropdown" placement="bottom-start">
            <Icon type="iconmd-time"></Icon>
          <DropdownMenu
            slot="list"
          >
          <slot name="collect">
            <HistoryAndFavorite />

             </slot>
          </DropdownMenu>
        </Dropdown>
        <!-- <div class="iconfont iconmd-time">
        </div> -->

    </div>
      <!-- 最近操作navigatorSetting -->
      <div class="icon-setting right" slot="icon-Setting">
        <div
          v-for="(item,index) in navigatorSetting"
          :key="index"
          class="tag right"
        >
          <Badge

            style="width:40px;height:40px"
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
        <ComAutoComplete slot="nav-input" />

        <Lately slot="icon-Lately"  v-if="enableHistoryAndFavoriteUI"></Lately>
        <Collect slot="icon-Collect"  v-if="enableHistoryAndFavoriteUI"></Collect>
      </div>
      <div
        v-if="versionValue"
        class="tag right"
        slot="icon-message"
        @click.prevent="messageSlide"
      >
        <Badge :count="taskMessageCount">
          <i
            class="iconfont iconbj_message badge"
          />
        </Badge>
        <Drawer
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
          </Drawer>
      </div>

      <div
        class="tag right"
        slot="icon-person"
        @click="show = true"
      >
          <i
            class="iconfont iconmd-person"
            title="设置"
          />
          <Drawer
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
        />

      </div>

   </component>
  </div>
</template>

<script>
  import { mapState, mapMutations, mapActions } from 'vuex';
  import NavigatorPrimaryMenu from './NavigatorPrimaryMenu';
  import SetPanel from './SetPanel';
  import messagePanel from './messagePanel';
  import messagePanelOlder from './messagePanelOlder'; // 1.3
  import Collect from './nav/collect.vue';
  import Lately from './nav/lately.vue';
  import NaVerticalslot from './nav/NaVerticalslot.vue';


  import ComAutoComplete from './ComAutoComplete';
  import Dialog from './Dialog.vue';
  import { routeTo } from '../__config__/event.config';
  import network, { urlSearchParams } from '../__utils__/network';
  import NavigatorSubMenu from './NavigatorSubMenu';
  import {
    classFix, STANDARD_TABLE_LIST_PREFIX, Version, enableGateWay, getGatewayValue, enableHistoryAndFavoriteUI, messageSwitch,dashboardConfig
  } from '../constants/global';
  import { updateSessionObject } from '../__utils__/sessionStorage';
  import { DispatchEvent } from '../__utils__/dispatchEvent'
  import HistoryAndFavorite from './HistoryAndFavorite';
  import MessagePanelOlder from './messagePanelOlder.vue';

  export default {
    name: 'Navigator',
    components: {
      SetPanel,
      Dialog,
      messagePanel,
      ComAutoComplete,
      HistoryAndFavorite,
      messagePanelOlder,
      Collect,
      Lately
    },

    data() {
      return {
        // primaryMenuShow: false,
        slotName:'',
        messagePanel: {
          show: false,
          list: [],
          loaded: true,
          start: 0,
          total: 0
        },
        enableHistoryAndFavoriteUI: enableHistoryAndFavoriteUI(),
        show: false,
        searchBtn: true,
        searchList: [],
        setPanel: {
          show: true,
          list: [],
        },
        iconShow: true,
        keyWord: '',
        dialogConfig: {
          title: '提示',
          mask: true,
          footerHide: false,
          contentText: '',
          confirm: () => {
          },
        }, // 弹框配置信息
        dialogComponentName: null,
        togglePrimaryMenuData: [],
        Version: Version(),
        messageTimer: null
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
        getDashboardConfig() {
            if (dashboardConfig() && dashboardConfig().iconClass) {
              return dashboardConfig().iconClass;
            }
            return false;
        },
        imgSrc: state => state.imgSrc
      }),
      versionValue() {
        if (Version() === '1.4') {
          if (messageSwitch()) {
            return true;
          }
          return false;
        }
        return true;
      },
      taskMessageCounts() {
        return this.userInfo.id;
      },
      classes: () => `${classFix}NaVertical-bar`

    },
    watch: {
      taskMessageCounts(val) {
        if (val && Version() === '1.3') {
          this.getTaskMessageCount(val);
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
      ...mapMutations('global', ['updateDashboardPageValue','updateTaskMessageCount', 'doCollapseHistoryAndFavorite', 'changeSelectedPrimaryMenu', 'hideMenu', 'tabOpen', 'directionalRouter']),
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
      mouseover(){
          console.log(1212);
      },
      showDropdown() {
        console.log(1212);
      },
      messageSlide() {
        this.messagePanel.show = !this.messagePanel.show;
        if (this.messagePanel.show) {
          this.getMessages(0);
        }
        // this.searchShow = true;
        // this.cascaderShow = false;
        // this.cascaderOpen = false;
        // this.setPanel.show = false;
      },
      ignoreMsg() { // 我的任务忽略功能
        network.post(Version() === '1.3' ? '/p/cs/ignoreAllMsg' : '/p/cs/u_note/ignoreMsg', {}, {
          serviceId: enableGateWay() ? 'asynctask' : ''
        }).then((res) => {
          if (res.data.code === 0) {
            this.updateTaskMessageCount(0);
            this.getMessages(0);
          }
        });
      },
      jumpTask() { // 跳转我的任务列表界面
        this.messagePanel.show = false;
        const type = STANDARD_TABLE_LIST_PREFIX;
        const tab = {
          type,
          tableName: Version() === '1.3' ? 'CP_C_TASK' : 'U_NOTE',
          tableId: Version() === '1.3' ? 24386 : 963,
          label: '我的任务'
        };
        this.tabOpen(tab);
      },
      nextPage() {
        if (this.messagePanel.start < this.messagePanel.total) {
          this.getMessages();
        }
      },
      getMessages(start) { // 请求我的任务数据
        const self = this;
        //        self.panel.list = [];
        if (start !== undefined) {
          self.messagePanel.start = start;
          self.messagePanel.list = [];
        }
        let fixedcolumns = {};
        if (Version() === '1.3') {
          fixedcolumns = {
            OPERATOR_ID: [this.userInfo.id],
            READSTATE: ['=0'],
            TASKSTATE: ['=2', '=3']
          };
        } else {
          fixedcolumns = {
            OPERATOR_ID: [this.userInfo.id],
            READ_STATE: ['=0'],
          };
        }
        const searchdata = {
          table: Version() === '1.3' ? 'CP_C_TASK' : 'U_NOTE',
          column_include_uicontroller: true,
          fixedcolumns,
          multiple: [],
          startindex: self.messagePanel.start,
          range: 20,
          orderby: [{ column: Version() === '1.3' ? 'CP_C_TASK.ID' : 'U_NOTE.ID', asc: false }]
        };
        network.post('/p/cs/QueryList', urlSearchParams({ searchdata }), {
          serviceId: enableGateWay() ? getGatewayValue('U_NOTE') : ''
        }).then((res) => {
          const result = res.data;
          if (!result.datas) {
            result.datas = result.data;
          }
          if (result.code === 0) {
            self.messagePanel.list = self.messagePanel.list.concat(result.datas.row);
            console.log(99, self.messagePanel.list);

            self.messagePanel.start = result.datas.start + result.datas.rowCount;
            self.messagePanel.total = result.datas.totalRowCount;
          //            self.panel.start = result.start
          }
        });
      },

      markReadNote(item) { // 我的任务单条跳转单对象界面
        this.messagePanel.show = false;
        this.updataTaskMessageCount({ id: item.ID.val });
        const type = 'tableDetailVertical';
        const tab = {
          type,
          tableName: Version() === '1.3' ? 'CP_C_TASK' : 'U_NOTE',
          tableId: Version() === '1.3' ? 24386 : 963,
          id: item.ID.val
        };
        this.tabOpen(tab);
      },
      changePwdBox() {
        this.show = false;
        this.$refs.dialogRef.open();
        this.dialogConfig.title = '修改密码';
        this.dialogConfig.footerHide = true;
        // Vue.component('ChangePassword', CustomizeModule.ChangePassword.component);
        this.dialogComponentName = 'ChangePassword';
      },
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
      toggle() {
        const navigator = document.querySelector('.NavigatorVertical');
        const navigatorMenu = document.querySelector('.NavigatorSubMenu');
        if (this.iconShow) {
          navigator.className = 'NavigatorVertical transferRight';
          this.iconShow = false;
        } else {
          navigator.className = 'NavigatorVertical transferLeft';
          this.iconShow = true;
        }
        setTimeout(()=>{
          let leftWidth = navigator.offsetWidth;
          navigatorMenu.style.left = leftWidth+'px';

          // 调整ag列宽
          DispatchEvent('resizeAgColumn')
        },500)
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
      }
    },
    mounted() {
      this.$el._vue_=this;
      if(window.ProjectConfig.layoutDirectionSlot && window.ProjectConfig.layoutDirectionSlot.NaVertical){
      this.slotName = window.ProjectConfig.layoutDirectionSlot.NaVertical;
      }else{
      this.slotName = NaVerticalslot;
      }
            console.log(this.slotName, window.ProjectConfig);
      if (Version() === '1.3') {
        this.messageTimer = setInterval(() => {
          this.getMessageCount();
        }, 30000);
      }
      if(document.querySelector('.NavigatorVertical')){
        this.toggle();
      }
    },
    beforeDestroy() {
      clearInterval(this.messageTimer);
    }
  };
</script>
