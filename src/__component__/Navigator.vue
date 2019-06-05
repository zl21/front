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
        src="../assets/image/closed@2x.png"
        @click="doCollapseHistoryAndFavorite"
      >
      <img
        v-if="collapseHistoryAndFavorite"
        class="trigger"
        alt=""
        src="../assets/image/open@2x.png"
        @click="doCollapseHistoryAndFavorite"
      >
      <img
        v-if="!collapseHistoryAndFavorite"
        class="logo"
        alt=""
        src="../assets/image/logo.png"
      >
      <img
        v-if="collapseHistoryAndFavorite"
        class="banner"
        alt=""
        src="../assets/image/banner.png"
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
    <Button
      type="primary"
      @click="show = true"
    >
      Open
    </Button>
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

  
  export default {
    name: 'Navigator',
    components: {
      NavigatorPrimaryMenu,
      SetPanel,
      Dialog
    },
    data() {
      return {
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

<style scoped lang="less">
  .navigator {
    height: 100%;
    display: flex;
    background-color: #1f272c;
    .left {
      img.trigger {
        height: 50px;
      }
      img.banner {
        position: absolute;
        width: 30px;
        top: 10px;
        left: 18px;
      }
      img.logo {
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
   
  }
   .burgeon-drawer-content{
      top:50px !important;
    }
</style>
