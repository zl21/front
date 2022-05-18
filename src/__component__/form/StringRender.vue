<template>
  <div
    v-html="customizedDefaultValue || value"
    :title="customizedDefaultValue || value"
    :style="options.webconf && options.webconf.styleForString"
    class="string-wrap one-line-flow"
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
