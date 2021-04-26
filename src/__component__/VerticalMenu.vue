<template>
  <div>
    <div class="middle">
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
    </div>
    <transition name="fade">
      <NavigatorSubMenu
        v-show="primaryMenuIndex!==-1"
        :data="togglePrimaryMenuData || []"
      />
    </transition>
  </div>
</template>
<script>
  import { mapState, mapMutations } from 'vuex';

  import NavigatorPrimaryMenu from './NavigatorPrimaryMenu.vue';
  import NavigatorSubMenu from './NavigatorSubMenu.vue';

  export default {
    data() {
      return {
        togglePrimaryMenuData: [],

      };
    },
    components: {
      NavigatorPrimaryMenu,
      NavigatorSubMenu,
    },
    computed: {
      
      ...mapState('global', {
        menuLists: ({ menuLists }) => menuLists,
        primaryMenuIndex: state => state.primaryMenuIndex,

      }),
    },
    methods: {
      ...mapMutations('global', ['changeSelectedPrimaryMenu', 'hideMenu']),

      togglePrimaryMenu(data, index) {
        this.togglePrimaryMenuData = data;
        if (index === this.primaryMenuIndex) {
          this.hideMenu();
        } else {
          this.changeSelectedPrimaryMenu(index);
        }
      },
    }
  };
</script>
<style lang="less" scoped>
   .middle {
      position: relative;
      display: flex;
      flex: 1 1 1px;
      overflow: auto;
      div{
        width: 100%;
      }
        .navigator-primary-menu{
          font-size: 14px;
          flex-direction: row;
          padding: 14px 20px;
          justify-content: space-around;
          .navigator-primary-menu-div{
           padding-right: 20px;
           overflow: hidden;
           height: 14px;
           line-height: 14px;
           white-space: nowrap;
           text-overflow:ellipsis
          }
          
        }
    }
     .middle::-webkit-scrollbar {
        display: none;
    }
</style>
