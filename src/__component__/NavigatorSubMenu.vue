<template>
  <div class="navigator-sub-menu" @click.stop>
    <ul
      class="menu-group"
      v-for="(subMenu, index) in data"
      :key="`subMenu-${index}`"
    >
      <li class="title">{{ subMenu.label }}</li>
      <li
        class="item"
        v-for="(endMenu, endIndex) in subMenu.children"
        :key="`endMenu-${endIndex}`"
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
  import { STANDARD_TABLE_COMPONENT_PREFIX } from '../constants/global';
  
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
        const { type, label } = data;
        const keepAliveModuleName = `${STANDARD_TABLE_COMPONENT_PREFIX}.${data.value}.${data.id}`;
        
        routeTo({ type, info: { tableName: data.value, tableId: data.id } }, () => {
          this.hideMenu();
          this.increaseKeepAliveLists(keepAliveModuleName);
          this.increaseOpenedMenuLists({
            label,
            keepAliveModuleName
          });
        });
      },
    },
  };
</script>

<style scoped lang="less">
  .navigator-sub-menu {
    border-bottom: 1px solid #d1dbe5;
    width: calc(100% - 10px);
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
