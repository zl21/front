<template>
  <div class="navigator">
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
    <div class="tag right">
      <i
        class="iconfont icon-yonghu-"
        @click="show = true"
      />
    </div>
    <Drawer
      v-model="show"
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
  import Vue from 'vue';
  import NavigatorPrimaryMenu from './NavigatorPrimaryMenu';
  import SetPanel from './SetPanel';
  import Dialog from './Dialog.vue';
  import CustomizeModule from '../__config__/customizeDialog.config';
  import closedImg from '../assets/image/closed@2x.png';
  import openedImg from '../assets/image/open@2x.png';
  import logoImg from '../assets/image/logo.png';
  import bannerImg from '../assets/image/banner.png';
  
  const { image } = window.ProjectConfig || {};
  const { enterpriseLogo, enterpriseBanner } = image || {};
  
  export default {
    name: 'Navigator',
    components: {
      NavigatorPrimaryMenu,
      SetPanel,
      Dialog
    },
    data() {
      return {
        imgSrc: {
          closedImg,
          openedImg,
          logoImg: enterpriseLogo || logoImg,
          bannerImg: enterpriseBanner || bannerImg
        },
        show: false,
        setPanel: {
          show: true,
          list: [],
        },
        dialogConfig: {
          title: '提示',
          mask: true,
          footerHide: false,
          contentText: '',
          confirm: () => {
          }
        }, // 弹框配置信息
        dialogComponentName: null
      };
    },
    computed: {
      ...mapState('global', {
        collapseHistoryAndFavorite: ({ collapseHistoryAndFavorite }) => collapseHistoryAndFavorite,
        menuLists: ({ menuLists }) => menuLists
      })
    },
    methods: {
      ...mapMutations('global', ['doCollapseHistoryAndFavorite']),
      ...mapActions('global', ['getMenuLists']),
      changePwdBox() {
        this.show = false;
        this.$refs.dialogRef.open();
        this.dialogConfig.title = '修改密码';
        this.dialogConfig.footerHide = true;
        Vue.component('ChangePassword', CustomizeModule.ChangePassword.component);
        this.dialogComponentName = 'ChangePassword';
      },
    },
    mounted() {
      this.getMenuLists();
    }
  };
</script>

<style lang="less">
 .burgeon-drawer-content{//重置BurgeonUI样式
    border-top-left-radius: 0px !important; 
    border-top-right-radius: 0px !important; 
  }
  .burgeon-drawer-body{//重置BurgeonUI样式
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
      i{
        font-size: 22px;
      }
    }
    .tag:hover {
      background: #2e373c;
    }
   
  }
 
</style>
