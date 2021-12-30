<template>
  <div
      v-if="showModule.Navigator"
      :class="classes"
  >
    <component :is="slotName">
      <!-- 操作按钮切换左边面板 -->
      <div
          class="tag"
          :title="$t('buttons.fold')"
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
            :title="$t('tips.backHome')"

        />
      </div>
      <div
          v-if="enableHistoryAndFavoriteUI"
          class="HistoryAndFavorite-time"
          slot="icon-time"
      >
        <Dropdown ref="Dropdown" trigger="click" class="HistoryAndFavorite-Dropdown" placement="bottom-start">
          <Icon type="iconmd-time"></Icon>
          <DropdownMenu
              slot="list"
          >
            <slot name="collect">
              <HistoryAndFavorite/>

            </slot>
          </DropdownMenu>
        </Dropdown>

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
        <ComAutoComplete slot="nav-input"/>

        <Lately slot="icon-Lately" v-if="enableHistoryAndFavoriteUI"></Lately>
        <Collect slot="icon-Collect" v-if="enableHistoryAndFavoriteUI"></Collect>
      </div>
      <div
          v-if="versionValue && !showTaskIcon"
          class="tag right"
          slot="icon-message"
          @click.prevent="messageSlide"
      >
        <Badge :count="taskMessageCount">
          <i
              class="iconfont iconbj_message badge"
          />
        </Badge>

        <!-- 消息队列 -->
        <MessageList v-model="showMessages"></MessageList>
      </div>

      <div
        v-if="versionValue && showTaskIcon"
        class="tag right"
        @click.prevent="handlerOpenTasks"
        slot="icon-task"
      >
        <Badge :count="taskMessageCount">
          <svg-icon icon-class="task" style="color:#1F272C;font-size: 20px"></svg-icon>
        </Badge>
      </div>

      <div
          class="tag right"
          slot="icon-person"
          @click="show = true"
      >
        <i
            class="iconfont iconmd-person"
            :title="$t('buttons.setting')"
        />

        <!-- 设置 -->
        <Setting v-model="show"></Setting>
      </div>

    </component>
  </div>
</template>

<script>
import {mapState, mapMutations, mapActions} from 'vuex';
import Collect from './nav/collect.vue';
import Lately from './nav/lately.vue';
import NaVerticalslot from './nav/NaVerticalslot.vue';


import ComAutoComplete from './ComAutoComplete';
import {routeTo} from '../__config__/event.config';
import network, {urlSearchParams} from '../__utils__/network';
import {
  classFix,
  Version,
  enableHistoryAndFavoriteUI,
  messageSwitch,
  dashboardConfig
} from '../constants/global';
import {updateSessionObject} from '../__utils__/sessionStorage';
import HistoryAndFavorite from './HistoryAndFavorite';
import MessageList from './nav/MessageList.vue'
import Setting from './nav/Setting.vue'
import noticeMixin from './AsyncTask/noticeMixin'
import navigatorMixin from './AsyncTask/navigatorMixin'

export default {
  name: 'Navigator',

  mixins: [noticeMixin, navigatorMixin],

  components: {
    ComAutoComplete,
    HistoryAndFavorite,
    Collect,
    Lately,
    MessageList,
    Setting
  },

  data() {
    return {
      slotName: '',
      enableHistoryAndFavoriteUI: enableHistoryAndFavoriteUI(),
      show: false,
      searchBtn: true,
      searchList: [],
      iconShow: true,
      keyWord: '',
      togglePrimaryMenuData: [],
      messageTimer: null,
      showMessages: false,
    };
  },
  computed: {
    ...mapState('global', {
      collapseHistoryAndFavorite: ({collapseHistoryAndFavorite}) => collapseHistoryAndFavorite,
      menuLists: ({menuLists}) => menuLists,
      navigatorSetting: ({navigatorSetting}) => navigatorSetting,
      showModule: ({showModule}) => showModule,
      userInfo: ({userInfo}) => userInfo,
      primaryMenuIndex: state => state.primaryMenuIndex,
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
    classes: () => `${classFix}NaVertical-bar`

  },
  watch: {
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
        }, 300);
      }
    },
    searchList() {
      this.$refs.AutoComplete.$el.querySelector('input').click();
    }
  },
  methods: {
    ...mapActions('global', ['updataTaskMessageCount']),
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
    },

    markReadNote(item) { // 我的任务单条跳转单对象界面
      this.messagePanel.show = false;
      this.updataTaskMessageCount({id: item.ID.val});
      const type = 'tableDetailVertical';
      const tab = {
        type,
        tableName: Version() === '1.3' ? 'CP_C_TASK' : 'U_NOTE',
        tableId: Version() === '1.3' ? 24386 : 963,
        id: item.ID.val
      };
      this.tabOpen(tab);
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
      routeTo({type, info: {tableName: name, tableId, url}}, () => {
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
      setTimeout(() => {
        let leftWidth = navigator.offsetWidth;
        navigatorMenu.style.left = leftWidth + 'px';
      }, 500)
    },
    routerNext(name) {
      const index = name.value;
      const routerItem = this.searchList[index];
      if (routerItem) {
        this.routeTonext(routerItem);
      }
    },
  },
  async mounted() {
    this.$el._vue_ = this;
    if (window.ProjectConfig.layoutDirectionSlot && window.ProjectConfig.layoutDirectionSlot.NaVertical) {
      this.slotName = window.ProjectConfig.layoutDirectionSlot.NaVertical;
    } else {
      this.slotName = NaVerticalslot;
    }

    if (document.querySelector('.NavigatorVertical')) {
      this.toggle();
    }
  },
};
</script>
