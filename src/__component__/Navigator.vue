<template>
  <div
    v-if="showModule.Navigator"
    class="navigator"
  >
    <div
      class="left"
      :style="{ width: collapseHistoryAndFavorite ? '50px' : '180px' }"
    >
      <img
        v-if="!collapseHistoryAndFavorite&&enableHistoryAndFavoriteUI"
        class="trigger"
        title="收起收藏夹与最近使用"
        alt=""
        :src="imgSrc.closedImg"
        @click="doCollapseHistoryAndFavorite"
      >
      <img
        v-if="collapseHistoryAndFavorite&&enableHistoryAndFavoriteUI"
        class="trigger"
        alt=""
        title="展开收藏夹与最近使用"
        :src="imgSrc.openedImg"
        @click="doCollapseHistoryAndFavorite"
      >
      <div id="navBrandImg">
        <img
          v-if="!collapseHistoryAndFavorite"
          class="banner"
          alt=""
          :src="imgSrc.bannerImg"
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
    <ComAutoComplete />
    <!-- <div
      :class="searchBtn ? 'tag right' :'tag tag-search right' "
    >
      <template v-if="searchBtn === false">
        <AutoComplete
          ref="AutoComplete"
          v-model="keyWord"
          class="nav-search"
          icon="ios-search"
          placeholder="请输入要查询的功能名"
          @on-click="searchBtn = true"
          @on-keydown="enter"
          @on-change="searchData"
        >
          <Option
            v-for="(item,index) in searchList"
            :key="index"
            :value="index"
            :lable="item.desc"
            @on-select-selected="routerNext"
          >
            {{ item.desc }}
          </Option>
        </AutoComplete>
      </template>
      
      <span
        v-if="searchBtn === true"
        class="buttonIcon"
        @click="searchBtn = false"
      >
        <i
          class="iconfont iconbj_search"
        />
      </span>
    </div> -->
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
    <Drawer
      v-model="messagePanel.show"
      :closable="false"
    >
      <messagePanel
        :panel="messagePanel"
        @markRead="markReadNote"
        @ignoreMsg="ignoreMsg"
        @jumpTask="jumpTask"
        @nextPage="nextPage"
      />
    </Drawer>
    <div
      class="tag right"
      @click="show = true"
    >
      <i
        class="iconfont iconmd-person"
        title="设置"
      />
    </div>
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
</template>

<script>
  import { mapState, mapMutations, mapActions } from 'vuex';
  import NavigatorPrimaryMenu from './NavigatorPrimaryMenu';
  import SetPanel from './SetPanel';
  import messagePanel from './messagePanel';
  import ComAutoComplete from './ComAutoComplete';
  import Dialog from './Dialog.vue';
  import { routeTo } from '../__config__/event.config';
  import network, { urlSearchParams } from '../__utils__/network';
  import NavigatorSubMenu from './NavigatorSubMenu';
  import {
    STANDARD_TABLE_LIST_PREFIX, Version, enableHistoryAndFavoriteUI, enableGateWay, getGatewayValue
  } from '../constants/global';
  import { updateSessionObject } from '../__utils__/sessionStorage';


  export default {
    name: 'Navigator',
    components: {
      NavigatorPrimaryMenu,
      SetPanel,
      Dialog,
      NavigatorSubMenu,
      messagePanel,
      ComAutoComplete
    },
    
    data() {
      return {
        // primaryMenuShow: false,
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
          title: '提示',
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
      enableHistoryAndFavoriteUI() {
        return enableHistoryAndFavoriteUI();
      },
      versionValue() {
        // if (Version() === '1.4') {
        //   return false;
        // }
        return true;
      },
      taskMessageCounts() {
        return this.userInfo.id;
      }
      
    },
    watch: {
      taskMessageCounts(val) {
        // if (val && Version() === '1.3') {
        //   this.getTaskMessageCount(val);
        // }
        if (val) {
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
        network.post('/p/cs/ignoreAllMsg').then((res) => {
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
          serviceId: enableGateWay() ? getGatewayValue('U_NOTE.ID') : ''
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

<style lang="less">
  .ark-drawer-content {
    //重置arkUI样式
    border-top-left-radius: 0px !important;
    border-top-right-radius: 0px !important;
  }
  
  .ark-drawer-body {
    //重置arkUI样式
    padding: 0px !important;
  }
  
  .navigator {
    height: 100%;
    display: flex;
    background-color: #1f272c;
     a{
          color:white
        }
      .badge{
        width: 42px;
        height: 42px;
        // background: #eee;
        border-radius: 6px;
        display: inline-block;
       
       
    }
    .left {
      img.trigger {
        height: 50px;
      }
      
      img.logo {
        position: absolute;
        width: 30px;
        top: 10px;
        left: 18px;
      }
      
      img.banner {
        width: 76px;
        height: 30px;
        position: absolute;
        top: 11px;
        left: 64px;
      }
      
      img:hover {
        cursor: pointer;
      }
    }
    
    .middle {
      margin-left: 10px;
      position: relative;
      display: flex;
      flex: 1 1 1px;
      overflow: auto;
    }
     .middle::-webkit-scrollbar {
        display: none;
    }
   .buttonIcon{
     width:100%;
     height:100%;
     display: inline-block;
   } 
    .nav-search {
      input {
        display: inline-block;
        width: 100%;
        padding: 0 8px;
        border: solid 1px #fff;
        border-radius: 15px;
        background: #4f5356;
        height: 28px;
        line-height: 28px;
        color: #fff;
        font-size: 13px;
        transition: all 0.25s;

        &:hover{
            font-size: 12px;
            padding: 0px 14px;
            transition: all 0.25s;
        }
      }
      
      i {
        color: #c0c4cc;
        padding-top: 2px;
      }
    }
    
    .tag {
      width: 50px;
      float: left;
      font-size: 24px;
      text-align: center;
      line-height: 50px;
      cursor: pointer;
      color: #fff;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      
      i {
        font-size: 22px;
      }
      
      .ark-badge-count{
        top: 2px;
      }
    }
    
    .tag-search {
      width: 192px;
      line-height: 40px;
      .ark-select{
          text-align: left;
      }
    }
    
    .tag:hover {
      background: #2e373c;
    }
  }
  
  .Poptip-nav {
    ul {
      li {
        &:hover {
          background: #f4f4f4;
        }
        
        padding: 0 20px;
        text-align: left;
        margin: 0;
        line-height: 34px;
        cursor: pointer;
        color: #606266;
        font-size: 14px;
        list-style: none;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
</style>
