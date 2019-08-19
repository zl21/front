<template>
  <div
    class="navigator-sub-menu"
    @click.stop
  >
    <ul
      v-for="(subMenu, index) in data"
      :key="`subMenu-${index}`"
      class="menu-group"
    >
      <li class="title">
        {{ subMenu.label }}
      </li>
      <li
        v-for="(endMenu, endIndex) in subMenu.children"
        :key="`endMenu-${endIndex}`"
        class="item"
        @click="routeTo(endMenu)"
      >
        {{ endMenu.label }}
      </li>
    </ul>
  </div>
</template>

<script>
  import { mapMutations } from 'vuex';
  import { routeTo } from '../__config__/event.config';
  
  export default {
    name: 'NavigatorSubMenu',
    props: {
      data: {
        required: true,
        type: Array,
        default: () => []
      }
    },
    methods: {
      ...mapMutations('global', ['increaseKeepAliveLists', 'hideMenu', 'increaseOpenedMenuLists']),
      routeTo(data) {
        let {
          type, value, id, vuedisplay 
        } = data;
        if (vuedisplay && vuedisplay === 'external') {
          type = vuedisplay;
        }
        routeTo({ type, info: { tableName: value, tableId: id } }, () => {
          this.hideMenu();
        });
      },
    },
  };
</script>

<style scoped lang="less">
  .navigator-sub-menu {
    z-index: 9999;
    border-bottom: 1px solid #d1dbe5;
    width: calc(100% - 10px + 50px);
    max-height: calc(100vh - 50px);
    overflow-y: auto;
    display: flex;
    flex-wrap: wrap;
    background-color: #fff;
    color: #575757;
    padding: 20px 10px 0;
    position: absolute;
    top: 50px;
    left: 0;
    
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
