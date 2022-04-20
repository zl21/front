<template>
  <component
    v-if="showModule.Navigator"
    :class="classes"
    :is="wrapperComponent"
  >
    <!-- 左侧logo -->
    <template slot="left">
      <div
        class="left"
        :style="{ width: collapseHistoryAndFavorite ? '50px' : '180px' }"
      >
        <span>
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
        </span>
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
    </template>

    <!-- 导航菜单 -->
    <template slot='middle'>
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
    </template>

    <template slot='icon-home'>
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
      <!-- 返回图标 -->
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
    </template>

    <template slot="nav-input">
      <ComAutoComplete />
    </template>

    <!-- 异步任务图标 -->
    <template slot="icon-task">
      <div
        v-if="versionValue && !showTaskIcon"
        class="tag right"
        @click.prevent="messageSlide"
      >
        <Badge :count="taskMessageCount">
          <i
            class="iconfont iconbj_message badge"
          />
        </Badge>
      </div>
      <div
        v-if="versionValue && showTaskIcon"
        class="tag right async-task-icon"
        @click.prevent="handlerOpenTasks"
      >
        <Badge :count="taskMessageCount">
          <svg-icon icon-class="task" style="width: 21px;"></svg-icon>
        </Badge>
      </div>
      <!-- 消息队列弹出层 -->
      <MessageList v-model="showMessages"></MessageList>
    </template>

    <!-- 设置 -->
    <template slot="icon-person">
      <div
        class="tag right"
        @click="show = true"
      >
        <i
          class="iconfont iconmd-person"
          :title="$t('buttons.setting')"
        />
      </div>
      <!-- 设置的弹出层 -->
      <Setting v-model="show"></Setting>
    </template>
  </component>
</template>

<script>
  import { mapState, mapMutations, mapActions, mapGetters } from 'vuex';
  import NavigatorPrimaryMenu from './NavigatorPrimaryMenu';
  import Setting from './nav/Setting.vue'
  import MessageList from './nav/MessageList.vue'

  import ComAutoComplete from './ComAutoComplete';
  import { routeTo } from '../__config__/event.config';
  import network, { urlSearchParams } from '../__utils__/network';
  import NavigatorSubMenu from './NavigatorSubMenu';
  import {
    Version, enableHistoryAndFavoriteUI, dashboardConfig,messageSwitch, classFix, layoutDirectionSlot
  } from '../constants/global';
  import { updateSessionObject } from '../__utils__/sessionStorage';
  import noticeMixin from './AsyncTask/noticeMixin'
  import navigatorMixin from './AsyncTask/navigatorMixin'
  import NavigatorSlot from './nav/NavigatorSlot.vue'

  export default {
    name: 'Navigator',

    mixins: [noticeMixin, navigatorMixin],

    components: {
      NavigatorPrimaryMenu,
      Setting,
      MessageList,
      NavigatorSubMenu,
      ComAutoComplete,
      NavigatorSlot
    },

    data() {
      return {
        show: false,
        searchBtn: true,
        searchList: [],
        keyWord: '',
        togglePrimaryMenuData: [],
        messageTimer: null,
        showMessages: false,
        wrapperComponent: undefined,
      };
    },
    computed: {
      ...mapState('global', {
        collapseHistoryAndFavorite: ({ collapseHistoryAndFavorite }) => collapseHistoryAndFavorite,
        menuLists: ({ menuLists }) => menuLists,
        navigatorSetting: ({ navigatorSetting }) => navigatorSetting,
        showModule: ({ showModule }) => showModule,
        primaryMenuIndex: state => state.primaryMenuIndex,
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

      classes() {
        return [
          `${classFix}navigator`,
        ];
      },
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
      routerNext(name) {
        const index = name.value;
        const routerItem = this.searchList[index];
        if (routerItem) {
          this.routeTonext(routerItem);
        }
      },
    },

    async mounted() {
      if (this.showModule && !this.showModule.Navigator) {
        if (this.$el) {
          this.$el.parentElement.hidden = true;
          this.$el.parentElement.parentElement.hidden = true;
          this.$el.parentElement.nextElementSibling.firstElementChild.lastElementChild.firstElementChild.firstElementChild.style.padding = '0px';
          this.$el.parentElement.nextElementSibling.firstElementChild.lastElementChild.style.margin = '0px';
        }
      }

      const slotObj = layoutDirectionSlot()
      if (slotObj && slotObj.navigator) {
        this.wrapperComponent = slotObj.navigator;
      } else {
        this.wrapperComponent = NavigatorSlot;
      }
    },
  };
</script>

