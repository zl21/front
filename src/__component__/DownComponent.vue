<template>
  <div
    ref="downComponent"
    class="downComponent-context"
  >
    <div
      v-if="rowAll > searchFoldnum"
      class="tag-close"
    >
      <Icon
        :class="className"
        @click="toggle"
      />
    </div>
    <div
      class="downComponent"
      :style="downComponent"
    >
      <div
        v-if="title"
        class="downComponent-h5"
        @click="toggle"
      >
        {{ title }}<Icon :class="icon" />
      </div>
      <div :class="downContent">
        <slot name="dwonContent" />
      </div>
    </div>
  </div>
</template>

<script>

  export default {
    name: 'DownComponent',
    props: {
      index: {// 暂无用到
        type: Number,
        default() {
          return 0;
        }
      },
      setHeight: {// 每行表单组件高度
        type: Number,
        default() {
          return 0;
        }
      },
      rowAll: {// 所有行数
        type: [Number, String],
        default() {
          return 0;
        }
      },
      searchFoldnum: {// 默认显示几行
        type: [Number, String],
        default() {
          return 0;
        }
      },
      defaultSpread: { // 是否全部展开
        type: Boolean,
        default() {
          return true;
        }
      },
      title: {
        type: String,
        default() {
          return '';
        }
      }
    },
    data() {
      return {
        dowClass: false,
        spread: true
      };
    },
    watch: {
      defaultSpread(val) {
        // 查看是否展开
        this.spread = val;
        if (this.spread === false) {
          this.dowClass = true;
        } else {
          this.dowClass = false;
        }
      }
    },
    computed: {
      className() {
        return `${this.dowClass === false ? ' iconfont  iconios-arrow-down' : 'iconfont  iconios-arrow-down icon-xiadown'}`;
      },
      downComponent() {
        if (this.spread) {
          return `${this.dowClass === false ? `max-height: ${this.searchFoldnum * this.setHeight + 8}px; transition:max-height 0.3s;` : 'max-height:30000px;transition:max-height 0.3s;'}`;
        }

        if (this.dowClass === true) {
          return 'max-height:30000px;transition:max-height 0.3s;';
        }
        return `max-height: ${this.searchFoldnum * this.setHeight + 8}px; `;
      },
      icon() {
        return `${this.dowClass === false ? 'iconfont icon-triangle-copy-copy-copy1 ' : 'iconfont icon-triangle-copy-copy-copy1 icon-xiadown'}`;
      },
      downContent() {
        return `${this.title ? 'down-contain ' : 'down-contain down-right'}`;
      }
    },
    methods: {
      toggle() {
        this.dowClass = !this.dowClass;
        // 调整ag表格高度
        this.$emit('on-toggle', this.dowClass);

        setTimeout(() => {
          const detailTable = document.querySelector('.detailTable');
          if (detailTable && detailTable.agTable) {
            detailTable.agTable.fixContainerHeight();
          }
        }, 300);
      }
    },
    mounted() {
      if (this.defaultSpread === false) {
        this.spread = this.defaultSpread;
      }
    }

  };
</script>

<style lang="less">
    .downComponent-context{
        position: relative;
    }
    .downComponent{
        border: 1px solid #d8d8d8;
        transition: height .5s;
        box-sizing: border-box;
        overflow: hidden;
        padding-bottom: 8px;
    }
    .down-right{
        padding-right: 28px;
    }
    .tag-close{
        width: 28px;
        height: 16px;
        position: absolute;
        top: 0;
        right: 0;
        margin-left: -20px;
        background-color: #fe6846;
        text-align: center;
        line-height: 16px;
        cursor: pointer;
        color: #fff;
        border-radius: 0 0 2px 2px;
        z-index: 9;
    }
    .icon-xiadown{
        transform: rotate(180deg);

    }
    .downComponent-h5{
        text-align: center;
        padding: 0;
        margin: 0;
        line-height: 24px;
        font-size: 12px;
        font-weight: 400;
        color: #1f2d3d;
        background: #f8f7f7;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
        border-bottom: 1px solid #b4b4b4;
    }
</style>
