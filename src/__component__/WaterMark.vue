<template>
  <div
    :class="waterMarkContainerCls"
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
  import { classFix } from '../constants/global';

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
      waterMarkContainerCls: () => `${classFix}waterMarkContainer`,
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
