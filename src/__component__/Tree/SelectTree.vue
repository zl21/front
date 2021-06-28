<template>
  <div :class="classes">
    <i v-if="!show" class="iconfont iconbj_transfer_right transferRight" @click="transferRight()"></i>
    <div class="selectContent" v-if="show" :style="selectContentStyle">
      <div class="menuContainer">
        <Tree
                ref="menuTree"
                v-bind="treeAttribute"
                v-on="treeEvent"></Tree>
      </div>
      <i class="iconfont iconbj_transfer_left transferLeft" @click="transferLeft()"></i>
    </div>
  </div>
</template>

<script>
  import { classFix } from '../../constants/global';

  export default {
    data() {
      return {
        show: false,
      };
    },
    name: '',
    components: {},
    watch: {
      showTree(val) {
        this.showTree = val;
      }
    },
    computed: {
      classes() {
        return [
          `${classFix}selectTreeContainer`,
        ];
      },
    },
    mounted() {
      this.show = this.showTree;
    },
    props: {
      selectContentStyle: {
        type: Object,
        default() {
          return {
            width: '200px'
          };
        }
      }, // 树选择区域的样式
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
      showTree: {
        type: Boolean,
        default() {
          return false;
        }
      }, // 是否显示树
    },
    methods: {
      transferRight() {
        this.show = true;
        this.$emit('on-show', this);
      }, // 向右侧的icon点击
      transferLeft() {
        this.show = false;
        this.$emit('on-hide', this);
      }, // 向左侧的icon点击
    }
  };
</script>
