<template>
  <div
    class="navigator-sub-menu"
    :class="collapseHistoryAndFavorite ? 'close':'open'"
    @click="toggleSubMenu()"
  >
    <ul
      v-for="(subMenu, index) in data"
      v-if="subMenu.children.length>0&&subMenu.children.filter(c=>!c.isHidden).length>0"
      :key="`subMenu-${index}`"
      class="menu-group"
    >
      <li
        v-if="subMenu.children.length>0&&subMenu.children.filter(c=>!c.isHidden).length>0"
        class="title"
      >
        {{ subMenu.label.replace(/'&nbsp;'/g,'\xa0') }}  
      </li>
      <li
        v-for="(endMenu, endIndex) in subMenu.children"
        v-if="!endMenu.isHidden"
        :key="`endMenu-${endIndex}`"
        class="item"
        @click="routeTo(endMenu)"
      >
        {{ endMenu.label.replace(/'&nbsp;'/g,'\xa0') }} 
      </li>
    </ul>
  </div>
</template>

<script>
  import { mapMutations, mapState } from 'vuex';
  import { routeTo } from '../__config__/event.config';
  import { updateSessionObject } from '../__utils__/sessionStorage';


  export default {
    name: 'NavigatorSubMenu',
    props: {
      data: {
        required: true,
        type: Array,
        default: () => []
      }
    },
    // watch: {
    //   data: {
    //     handler(val) {
    //       val.forEach((d) => {
    //           const childrenNum=d.children.filter(c => !c.isHidden).length;
    //           d.children.map((c) => {
    //               if(!c.isHidden){
    //                 delete c;
    //               }
    //           });
    //       });

    //       this.data = val.concat([]);
    //     },
    //     deep: true
    //   },
    // },
    computed: {
      ...mapState('global', {
        collapseHistoryAndFavorite: state => state.collapseHistoryAndFavorite,
      })
    },
    methods: {
      ...mapMutations('global', ['increaseKeepAliveLists', 'hideMenu', 'increaseOpenedMenuLists', 'changeSelectedPrimaryMenu']),
      toggleSubMenu() {
        this.changeSelectedPrimaryMenu(1);
      },
      routeTo(data) {
        const {
          type
        } = data;
        const {
          value, id, url 
        } = data;
        if (url) {
          // window.sessionStorage.setItem('dynamicRoutingForHideBackButton', true);
          window.sessionStorage.setItem('dynamicRouting', true);
          const menuType = url.substring(url.lastIndexOf('/') + 1, url.length);
          const modifyPageUrl = url.substring(0, Number(url.length) - 3);
          if (menuType === 'New') {
            const clickMenuAddSingleObjectData = {
              k: `/${url}`,
              v: modifyPageUrl
            };
            updateSessionObject('clickMenuAddSingleObject', clickMenuAddSingleObjectData);
          }
        }
        routeTo({ type, info: { tableName: value, tableId: id, url } }, () => {
          this.hideMenu();
        });
      },
    },
  };
</script>

<style scoped lang="less">
  .open{
     width: calc(100% - 190px - 50px);
    left: 190px;
  }
  .close{
     width: calc(100% - 60px - 50px);
     left: 60px;
  }
  .navigator-sub-menu {
    z-index: 9999;
    border-bottom: 1px solid #d1dbe5;
    // width: calc(100% - 190px - 50px);
    max-height: calc(100vh - 50px);
    overflow-y: auto;
    display: flex;
    flex-wrap: wrap;
    background-color: #fff;
    color: #575757;
    padding: 20px 10px 0;
    position: absolute;
    top: 50px;
    
    .menu-group {
      min-width: 150px;
      padding-right: 10px;
      margin: 0 30px 20px 0;
      li {
        list-style: none;
      }
      li.title {
        border-bottom: 1px solid #d8d8d8;
        display: block;
        font-size: 14px;
        font-weight: 700;
        line-height: 14px;
        height: 20px;
        margin-left: 10px;
      }
      li.item {
        white-space: normal;
        cursor: pointer;
        height: 28px;
        line-height: 28px;
        margin-top: 1px;
        padding-left: 10px;
        font-size: 12px;
      }
      li.item:hover {
        background-color: #fd6442;
        color: #fff;
      }
    }
  }
</style>
