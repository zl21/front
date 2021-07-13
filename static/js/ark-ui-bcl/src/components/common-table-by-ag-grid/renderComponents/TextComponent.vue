<template>
  <span :title="params.value || ''">
    <template v-if="params.colDef.type && params.colDef.type.toLocaleLowerCase() === 'string' && params.value && params.value.length > 1000">
      {{params.value.substring(0, 50)}}...
    </template>
    <template v-else>
      <div
        v-if="width"
        class="one-line-flow"
        :style="`width:${width}`"
      ><span :title="`${params.value || ''}`">{{params.value || ''}}</span></div>
      <span
        v-else
      ><span :title="`${params.value || ''}`">{{params.value || ''}}</span></span>
    </template>
  </span>
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
