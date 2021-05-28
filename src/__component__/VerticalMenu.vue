<template>
  <div>
    <div :class="classes">
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
  import { classFix } from '../constants/global';
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
      classes () {
        return [
          `${classFix}middle`,
        ];
      },
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
