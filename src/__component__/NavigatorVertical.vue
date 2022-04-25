<template>
  <div
    v-if="showModule.Navigator"
    :class="classes"
  >
    <div
      class="left"
    >
      <div id="navBrandImg">
        <img
          class="banner"
          alt=""
          :src="imgAssets.banner"
        >
        <!-- <img
          v-if="collapseHistoryAndFavorite"
          class="logo"
          alt=""
          :src="imgSrc.logoImg"
        > -->
      </div>
    </div>

    <VerticalMenu />
    <!-- <div class="middle">
      <div style="">
        <NavigatorPrimaryMenu
          v-for="(menu, index) in menuLists"
          :key="`primary-menu-${index}`"
          :data="menu"
          type="Vertical"
          :index="index"
          @togglePrimaryMenu="togglePrimaryMenu"
        />
      </div>
    </div> -->
    <!-- <transition name="fade">
      <NavigatorSubMenu
        v-show="primaryMenuIndex!==-1"
        :data="togglePrimaryMenuData || []"
      />
    </transition> -->
  </div>
</template>

<script>
  import { mapState, mapMutations, mapActions, mapGetters } from 'vuex';

  import { routeTo } from '../__config__/event.config';
  import network, { urlSearchParams } from '../__utils__/network';
  import {
    STANDARD_TABLE_LIST_PREFIX, Version, enableGateWay, getGatewayValue, classFix
  } from '../constants/global';
  import { updateSessionObject } from '../__utils__/sessionStorage';

  import VerticalMenu from './VerticalMenu.vue';

  export default {
    name: 'Navigator',
    components: {
      VerticalMenu
    },

    data() {
      return {
        // primaryMenuShow: false,
        // imgSrc: {
        //   closedImg,
        //   openedImg,
        //   logoImg,
        //   bannerImg,
        // },
        messagePanel: {
          show: false,
          list: [],
          loaded: true,
          start: 0,
          total: 0
        },
        show: false,
        searchBtn: true,
        searchList: [],
        setPanel: {
          show: true,
          list: [],
        },
        keyWord: '',
        dialogConfig: {
          title: this.$t('feedback.alert'),
          mask: true,
          footerHide: false,
          contentText: '',
          confirm: () => {
          },
        }, // 弹框配置信息
        dialogComponentName: null,
        togglePrimaryMenuData: [],
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
        imgSrc: state => state.imgSrc
      }),
      ...mapGetters('global', ['imgAssets']),
      classes: () => `${classFix}NavigatorVertical`,
      versionValue() {
        if (Version() === '1.4') {
          return false;
        }
        return true;
      },
      taskMessageCounts() {
        if (this.userInfo) {
          return this.userInfo.id;
        }
        return null;
      }

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
            if(this.$el.parentElement.nextElementSibling.firstElementChild.lastElementChild){
              this.$el.parentElement.nextElementSibling.firstElementChild.lastElementChild.firstElementChild.firstElementChild.style.padding = '0px';
              this.$el.parentElement.nextElementSibling.firstElementChild.lastElementChild.style.margin = '0px';
            }
            
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
      ...mapMutations('global', ['updateTaskMessageCount', 'doCollapseHistoryAndFavorite', 'changeSelectedPrimaryMenu', 'hideMenu', 'tabOpen', 'directionalRouter']),
      togglePrimaryMenu(data, index) {
        this.togglePrimaryMenuData = data;
        if (index === this.primaryMenuIndex) {
          this.hideMenu();
        } else {
          this.changeSelectedPrimaryMenu(index);
        }
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
          label: this.$t('tips.myTask')
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
        const searchdata = {
          table: Version() === '1.3' ? 'CP_C_TASK' : 'U_NOTE',
          column_include_uicontroller: true,
          fixedcolumns: {
            OPERATOR_ID: [this.userInfo.id],
            READ_STATE: ['=0'],
            // TASKSTATE: ['=2', '=3']
          },
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
        this.dialogConfig.title = this.$t('tips.changePassword');
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
      // if (Version() === '1.3') {
      //   this.messageTimer = setInterval(() => {
      //     this.getMessageCount();
      //   }, 30000);
      // }
      this.messageTimer = setInterval(() => {
        this.getMessageCount();
      }, 30000);
    },
    beforeDestroy() {
      clearInterval(this.messageTimer);
    }
  };
</script>
