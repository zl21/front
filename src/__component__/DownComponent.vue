<template>
    <div
            ref="dwonComponent"
            class="dwonComponent"
            :style="dwonComponent"
    >
        <div
                v-if="searchFoldnum>0"
                class="tag-close"
        >
            <Icon
                    :class="className"
                    @click="toggle"
            />
        </div>
        <div
                v-if="title"
                class="downComponent-h5"
                @click="toggle"
        >
            {{ title }}<Icon :class="icon" />
        </div>
        <div :class="dwonContent">
            <slot name="dwonContent" />
        </div>
    </div>
</template>

<script>

  export default {
    name: 'DwonComponent',
    props: {
      index: {
        type: Number,
        default() {
          return 0;
        }
      },
      setHeight: {
        type: Number,
        default() {
          return 0;
        }
      },
      searchFoldnum: {
        type: [Number, String],
        default() {
          return 0;
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
      };
    },
    computed: {
      className() {
        return `${this.dowClass === false ? ' iconfont  icon-xiajiantou' : 'iconfont  icon-xiajiantou icon-xiadown'}`;
      },
      dwonComponent() {
        return `${this.dowClass === false ? `max-height: ${this.searchFoldnum * this.setHeight + 16}px; transition:max-height 0.3s;` : 'max-height:30000px;'}`;
      },
      icon() {
        return `${this.dowClass === false ? 'iconfont icon-triangle-copy-copy-copy1 ' : 'iconfont icon-triangle-copy-copy-copy1 icon-xiadown'}`;
      },
      dwonContent() {
        return `${this.title ? 'down-contain ' : 'down-contain down-right'}`;
      }
    },
    methods: {
      toggle() {
        this.dowClass = !this.dowClass;
      }
    }

  };
</script>

<style lang="less">
    .dwonComponent{
        position: relative;
        border: 1px solid #d8d8d8;
        transition: height .5s;
        box-sizing: border-box;
        overflow: hidden;
        margin:0  17px;
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
