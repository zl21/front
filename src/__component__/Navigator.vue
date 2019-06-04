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
      @click="value1 = true"
    >
      Open
    </Button>
    <Drawer
      v-model="value1"
      :closable="false"
    >
      <SetPanel :panel="setPanel" />
    </Drawer>
  </div>
</template>

<script>
  import { mapState, mapMutations, mapActions } from 'vuex';
  import NavigatorPrimaryMenu from './NavigatorPrimaryMenu';
  import SetPanel from './SetPanel';
  
  export default {
    name: 'Navigator',
    components: {
      NavigatorPrimaryMenu,
      SetPanel
    },
    data() {
      return {
        value1: false,
        setPanel: {
          show: false,
          list: [],
        },
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
