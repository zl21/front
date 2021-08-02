<template>
  <div :title="params.value || ''" class="ag-text-component">
    <!-- <template v-if="params.colDef.type && params.colDef.type.toLocaleLowerCase() === 'string' && params.value && params.value.length > 1000">
      <span class="ag-text-component-content">{{params.value.substring(0, 50)}}...</span>
    </template> -->
    <template>
      <div
        v-if="width"
        class="one-line-flow ag-text-component-content"
        :style="`width:${width}`"
      ><span :title="`${params.value || ''}`">{{params.value || ''}}</span></div>
      <div
        v-else
        class="one-line-flow ag-text-component-content"
      ><span :title="`${params.value || ''}`">{{params.value || ''}}</span></div>
    </template>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'AgTextComponent',

  props: {
    params: {
      type: Object,
    }
  },

  data() {
    return {
      width: 0
    }
  },

  methods: {

  },

  mounted() {
    const paddingWidth = 22
    const standard_width = this.params.column.colDef.webconf && this.params.column.colDef.webconf.standard_width
    this.width = standard_width ? `${Math.max(standard_width - paddingWidth, 0)}px;` : ''
  }
}
</script>

<style lang="scss" scoped>
.ag-text-component {
  overflow: hidden;
}
.ag-text-component-content {
  width: 100%;
}
</style>