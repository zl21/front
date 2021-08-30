<template>
  <div :class="classes">
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
  import { classFix } from '../../constants/global';

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
      classes() {
        return [
          `${classFix}filterTreeContainer`,
        ];
      },
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
          return this.$t('form.inputPlaceholder');
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
