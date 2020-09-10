<template>
  <div
    class="waterMarkContainer"
    :style="waterMarkStyle"
  >
    <i class="iconfont iconbj_docstate" />
    <div
      class="textTip"
      :style="position"
      :class="{ smallText: textArr.length >= 5 }"
    >
      <div
        v-for="(item, index) in textArr"
        :key="index"
      >
        {{ item }}
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {};
    },
    name: 'WaterMark',
    props: {
      color: {
        type: String,
        default: 'red'
      },
      text: {
        type: String,
        default: '文字'
      },
      width: {
        type: String,
        default: '80px'
      },
      top: {
        type: String,
        default: '42px'
      },
      left: {
        type: String,
        default: '11px'
      }
    },
    components: {},
    methods: {},
    watch: {},
    computed: {
      waterMarkStyle() {
        return { color: this.color };
      },
      textArr() {
        return this.text.split('');
      },
      position() {
        return { width: this.width, top: this.top, left: this.left };
      }
    }
  };
</script>

<style lang="less">
    .waterMarkContainer {
        position: relative;
        i {
            font-size: 104px;
        }
        .textTip {
            position: absolute;
            transform: rotate(-30deg);
            font-size: 20px;
            // top: 42px;
            // left: 11px;
            // width: 80px;
            display: flex;
            justify-content: space-around;
            flex-wrap: wrap;
        }
        .smallText {
          font-size: 14px;
        }
    }
</style>
