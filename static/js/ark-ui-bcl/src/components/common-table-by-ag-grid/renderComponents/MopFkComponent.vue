<template>
  <span :title="params.value || ''">
    <span
      v-if="data && data[columnName] && data[columnName].refobjid"
      v-html="params.value"
    >
    </span>
  </span>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'AgMopFkComponent',

  data() {
    return {
      data: null,
      columnName: null
    }
  },

  props: {
    params: {
      type: Object,
    }
  },

  methods: {

  },

  mounted() {
    const { data, column } = this.params
    this.columnName = column.colId
    this.data = data
  }
}
</script>

<style lang="scss" scoped>
</style>