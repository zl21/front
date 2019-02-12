<template>
  <div class="navigator">
    <div class="left">
      <img class="trigger" alt="" src="../assets/image/closed@2x.png" />
      <img class="trigger" alt="" src="../assets/image/open@2x.png" />
      <img class="logo" alt="" src="../assets/image/logo.png" />
    </div>
    <div class="middle">
      <NavigatorPrimaryMenu
        v-for="(menu, index) in menuLists"
        :data="menu"
        :key="`primary-menu-${index}`"
      />
    </div>
  </div>
</template>

<script>
  import network from '../__utils__/network';
  import NavigatorPrimaryMenu from './NavigatorPrimaryMenu';
  
  export default {
    name: 'Navigator',
    components: {
      NavigatorPrimaryMenu
    },
    data() {
      return {
        menuLists: []
      };
    },
    mounted() {
      network.post('/p/cs/getSubSystems').then((res) => {
        this.menuLists = res.data.data;
      });
    }
  };
</script>

<style scoped lang="less">
  .navigator {
    height: 100%;
    display: flex;
    background-color: #1f272c;
    .left {
      width: 180px;
      img.trigger {
        height: 50px;
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
      display: flex;
      flex: 1 1 1px;
    }
  }
</style>
