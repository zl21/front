<template>
  <div
    class="navigator-primary-menu"
    :class="{ active: index === primaryMenuIndex }"
    @click.stop="changeSelectedPrimaryMenu(index)"
  >
    {{ data.label }}
    <NavigatorSubMenu
      v-show="index === primaryMenuIndex"
      :data="data.children || []"
    />
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
      ...mapMutations('global', ['changeSelectedPrimaryMenu'])
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
