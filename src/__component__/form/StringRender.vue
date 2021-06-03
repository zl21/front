<template>
  <div
    v-html="customizedDefaultValue || value"
    :style="options.webconf && options.webconf.styleForString"
    class="string-wrap"
  >
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: '',

  model: {
    props: 'value',
    event: 'change'
  },

  props: {
    // 双向绑定值
    value: {
      type: [String, Array],
    },
    // 外部传入的所有参数
    options: {
      type: Object,
      default: () => { }
    },
    customizedDefaultValue: {
      type: String,
      default: ''
    }
  },

  data() {
    return {

    }
  },

  methods: {

  }
}
</script>

<style lang="scss" scoped>
.string-wrap {
  height: 26px;
  line-height: 26px;
}
</style>