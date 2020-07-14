<template>
    <div class="selectTreeContainer">
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
    computed: {},
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

<style lang="less">
    .selectTreeContainer {
        height: 100%;
        .transferRight {
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 24px;
        }
        .selectContent {
            height: 100%;
            display: flex;
            padding: 10px;
            border-left: solid 1px #d8d8d8;
            border-top: solid 1px #d8d8d8;
            border-bottom: solid 1px #d8d8d8;
            border-radius: 6px 0 0 6px;
            .menuContainer {
                flex: 1;
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
            .transferLeft {
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                font-size: 24px;
            }
        }
    }
</style>
