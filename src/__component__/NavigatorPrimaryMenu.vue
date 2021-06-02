<template>
  <div
    v-if="isShow"
    class="navigator-primary-menu"
    :class="{ active: index === primaryMenuIndex }"
    @click.stop="togglePrimaryMenu(data.children)"
  >
    <template v-if="type==='Vertical'">
      <div class="navigator-primary-menu-div">
        {{ data.label }}
      </div> <Icon type="ios-arrow-forward" />
    </template>
    <template v-else>
      {{ data.label }}
    </template>
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
      }),
      isShow() {
        return this.data.children.filter(subMenu => subMenu.children.length > 0 && subMenu.children.filter(c => !c.isHidden).length > 0).length > 0;
      },
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
      type: {
        type: String,
        default: () => ('')
      },
      index: {
        required: true,
        type: Number,
        default: undefined
      }
    }
  };
</script>
