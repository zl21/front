<template>
  <div
    v-if="data.children.filter(subMenu => subMenu.children.length > 0 && subMenu.children.filter(c => !c.isHidden).length > 0).length>0"
    class="navigator-primary-menu"
    :class="{ active: index === primaryMenuIndex }"
    @click.stop="togglePrimaryMenu(data.children)"
  >
    {{ data.label }}
  </div>
</template>
<script>
  import { mapState, mapMutations } from 'vuex';

  export default {

    name: 'NavigatorPrimaryMenu',
    components: {
    },
    computed: {
      ...mapState('global', {
        primaryMenuIndex: state => state.primaryMenuIndex,
      })
    },
    methods: {
      togglePrimaryMenu(data) {
        this.$emit('togglePrimaryMenu', data, this.index);
      },
      ...mapMutations('global', ['changeSelectedPrimaryMenu', 'hideMenu', 'saveLastIndexForMenu'])
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
