<template>
  <component
    :is="params.renderComponent"
    v-on="$listeners"
    v-bind="$attrs"
    :params="params"
  />
</template>

<script type="text/ecmascript-6">
export default {
  name: 'AgCellRender',

  inheritAttrs: false,

  data() {
    return {

    }
  },

  methods: {

  }
}
</script>
