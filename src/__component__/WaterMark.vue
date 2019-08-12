<template>
    <div class="waterMarkContainer" :style="waterMarkStyle">
        <i class="iconfont iconbj_docstate"></i>
        <div class="textTip">
            <div v-for="item in textArr">{{item}}</div>
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
            transform:rotate(-30deg);
            font-size: 20px;
            top: 42px;
            left: 11px;
            width: 80px;
            display: flex;
            justify-content: space-around;
        }
    }
</style>
