<template>
    <div class="filterTreeContainer">
        <Input
                :placeholder="placeholder"
                :clearable="clearable"
                icon="ios-search"
                @on-clear="searchInputClear"
                @on-change="searchInputChange"
        >
        <span slot="prepend">检索</span>
        </Input>
        <div class="menuContainer">
            <Tree
                    ref="menuTree"
                    v-bind="treeAttribute"
                    v-on="treeEvent"
                    :query="treeQuery"></Tree>
        </div>
    </div>
</template>

<script>
  export default {
    data() {
      return {
        menuTreeData: [], // 菜单树数据
        menuTreeQuery: '', // 菜单树检索的值
      };
    },
    name: '',
    components: {},
    watch: {},
    computed: {
      treeQuery() {
        return this.treeAttribute && this.treeAttribute.query ? this.treeAttribute.query : this.menuTreeQuery;
      }
    },
    props: {
      treeAttribute: {
        type: Object,
        default() {
          return {};
        }
      }, // 树的属性
      treeEvent: {
        type: Object,
        default() {
          return {};
        }
      }, // 树绑定的方法
      clearable: {
        type: Boolean,
        default() {
          return true;
        }
      }, // 搜索输入框的clearable
      placeholder: {
        type: String,
        default() {
          return '请输入';
        }
      } // 搜索输入框的placeholder
    },
    methods: {
      searchInputChange(e) {
        this.menuTreeQuery = e.target.value;
        this.$emit('on-search-change', e, this);
      }, // 检索输入框值改变
      searchInputClear() {
        this.menuTreeQuery = '';
        this.$emit('on-search-clear', this);
      }, // 检索输入框清空
    }
  };
</script>

<style lang="less">
    .filterTreeContainer {
        width: 240px;
        height: 100%;
        padding: 10px;
        border: solid 1px #d8d8d8;
        border-radius: 6px;
        margin-right: 10px;
        display: flex;
        flex-direction: column;
        .menuContainer {
            flex: 1;
            margin-top: 10px;
            overflow-y: auto;

            .ark-tree-title {
                width: 100%;
                font-size: 12px;
                line-height: 26px;
            }
            .ark-tree-title-selected, .ark-tree-title-selected:hover {
                background-color: rgb(196, 226, 255);
            }
        }
    }
</style>
