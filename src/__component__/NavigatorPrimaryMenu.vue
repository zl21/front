<template>
  <div
    class="navigator-primary-menu"
    :class="{ active: index === primaryMenuIndex }"
    @click.stop="togglePrimaryMenu"
  >
    {{ data.label }}
    <transition  name="fade">
      <NavigatorSubMenu
        v-show="index === primaryMenuIndex"
        :data="data.children || []"
      />
    </transition>
  </div>
</template>

<script>
  import { mapState, mapMutations } from 'vuex';
  import NavigatorSubMenu from './NavigatorSubMenu';

  export default {
    name: 'NavigatorPrimaryMenu',
    components: {
      NavigatorSubMenu
    },
    computed: {
      ...mapState('global', {
        primaryMenuIndex: state => state.primaryMenuIndex
      })
    },
    methods: {
      togglePrimaryMenu() {
        // 由于此处禁用了冒泡，所以需要手动触发body的点击事件以辅助其他控件对body点击事件的监听。
        document.body.click();
        if (this.index === this.primaryMenuIndex) {
          this.hideMenu();
        } else {
          this.changeSelectedPrimaryMenu(this.index);
        }
      },
      ...mapMutations('global', ['changeSelectedPrimaryMenu', 'hideMenu'])
    },
    props: {
      data: {
        required: true,
        type: Object,
        default: () => ({})
      },
      index: {
        required: true,
        type: Number,
        default: undefined
      }
    }
  };
</script>

<style scoped lang="less">
  .fade-enter-active, .fade-leave-active {
    transition: opacity .25s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
  .navigator-primary-menu.active {
    background-color: #fff;
    color: #575757;
  }
  .navigator-primary-menu.active:hover {
    background-color: #fff;
    color: #575757;
  }
  .navigator-primary-menu {
    user-select: none;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 76px;
    color: #fff;
    font-size: 13px;
  }
  
  .navigator-primary-menu:hover {
    background-color: #2e373c;
    cursor: pointer;
  }
</style>
