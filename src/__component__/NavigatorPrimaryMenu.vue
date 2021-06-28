<template>
  <div
    v-if="isShow"
    class="navigator-primary-menu"
    :class="{ active: index === primaryMenuIndex }"
    @click.stop="togglePrimaryMenu(data.children)"
  >
    <template v-if="type==='Vertical'">
      <component :is="NavigatorPrimaryMenuBar" :data="data" />
      <div v-if="NavigatorPrimaryMenuBar===''">
         <div class="navigator-primary-menu-div">
          {{ data.label }}
        </div> <Icon type="ios-arrow-forward" />
      </div>
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
    data(){
        return {
          NavigatorPrimaryMenuBar:''
        }

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
        if(document.querySelector('.NaVertical')){
          document.querySelector('.NaVertical').__vue__.$refs.Dropdown.onClickoutside();
        }
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
    },
    mounted(){
      if(window.ProjectConfig.layoutDirectionSlot){
        this.NavigatorPrimaryMenuBar = window.ProjectConfig.layoutDirectionSlot.NavigatorSubMenu || '';
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
    div{
       display: flex;
    }
  }
  
  .navigator-primary-menu:hover {
    background-color: #2e373c;
    cursor: pointer;
  }
</style>
