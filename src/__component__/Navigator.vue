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
        v-if="!collapseHistoryAndFavorite"
        class="trigger"
        alt=""
        :src="imgSrc.closedImg"
        @click="doCollapseHistoryAndFavorite"
      >
      <img
        v-if="collapseHistoryAndFavorite"
        class="trigger"
        alt=""
        :src="imgSrc.openedImg"
        @click="doCollapseHistoryAndFavorite"
      >
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
    <div class="middle">
      <NavigatorPrimaryMenu
        v-for="(menu, index) in menuLists"
        :key="`primary-menu-${index}`"
        :data="menu"
        :index="index"
      />
    </div>
    <div
      v-if="navigatorSetting.length > 0"
      class="tag right"
    >
      <Badge 
        v-for="(item,index) in navigatorSetting" 
        :key="index"
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
    <div :class="searchBtn ? 'tag right' :'tag tag-search right' ">
      <template v-if="searchBtn === false">
        <AutoComplete
          ref="AutoComplete"
          v-model="keyWord"
          class="nav-search"
          icon="ios-search"
          placeholder="请输入要查询的功能名"
          @on-click="searchBtn = true"
          @click="setBtn"
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
      
      
      <i
        v-if="searchBtn === true"
        class="iconfont iconbj_search"
        @click="searchBtn = false"
      />
    </div>
    <div class="tag right">
      <i
        class="iconfont iconmd-person"
        @click="show = true"
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
  import { mapState, mapMutations } from 'vuex';
  import NavigatorPrimaryMenu from './NavigatorPrimaryMenu';
  import SetPanel from './SetPanel';
  import Dialog from './Dialog.vue';
  import closedImg from '../assets/image/closed@2x.png';
  import openedImg from '../assets/image/open@2x.png';
  import logoImg from '../assets/image/logo.png';
  import bannerImg from '../assets/image/banner.png';
  import { routeTo } from '../__config__/event.config';
  import network, { urlSearchParams } from '../__utils__/network';

  export default {
    name: 'Navigator',
    components: {
      NavigatorPrimaryMenu,
      SetPanel,
      Dialog,
    },
    data() {
      return {
        imgSrc: {
          closedImg,
          openedImg,
          logoImg,
          bannerImg,
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
      };
    },
    computed: {
      ...mapState('global', {
        collapseHistoryAndFavorite: ({ collapseHistoryAndFavorite }) => collapseHistoryAndFavorite,
        menuLists: ({ menuLists }) => menuLists,
        navigatorSetting: ({ navigatorSetting }) => navigatorSetting,
        showModule: ({ showModule }) => showModule
      }),
    },
    watch: {
      showModule(val) {
        if (!val.Navigator) {
          this.$el.parentElement.hidden = true;
        }
      }
    },
    methods: {
      ...mapMutations('global', ['doCollapseHistoryAndFavorite']),
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
        const type = data.type;
        let tabid = 0;
        if (type === 'table') {
          tabid = data.tabid;
        } else {
          tabid = data.actid;
        }
        routeTo(
          { type, info: { tableName: data.name, tableId: tabid } },
          () => {
            this.keyWord = '';
            setTimeout(() => {
              this.searchList = [];
            }, 100);
          }
        );
      },
      searchData(value) {
        this.searchList = [];

        if (value === undefined || value.length < 1) {
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
      loadEnterpriseConfig() {
        const image = (window.ProjectConfig || {}).image || {
          enterpriseLogo: undefined,
          enterpriseBanner: undefined,
        };
        const enterpriseLogo = image.enterpriseLogo;
        const enterpriseBanner = image.enterpriseBanner;
        this.imgSrc.logoImg = enterpriseLogo || this.imgSrc.logoImg;
        this.imgSrc.bannerImg = enterpriseBanner || this.imgSrc.bannerImg;
      },
    },
    mounted() {
      this.loadEnterpriseConfig();
    },
  };
</script>

<style lang="less">
  .burgeon-drawer-content {
    //重置BurgeonUI样式
    border-top-left-radius: 0px !important;
    border-top-right-radius: 0px !important;
  }
  
  .burgeon-drawer-body {
    //重置BurgeonUI样式
    padding: 0px !important;
  }
  
  .navigator {
    height: 100%;
    display: flex;
    background-color: #1f272c;
    
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
    }
    
    .tag-search {
      width: 192px;
      line-height: 40px;
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
