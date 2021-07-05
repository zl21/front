<template>
  <span>
    <span
      :class="cssFeatures.hover"
      style="text-decoration: underline; color: #0F8EE9; "
      data-target-tag="customerUrlText"
      :title="params.value || ''"
    >{{params.value || ''}}</span>
  </span>
</template>

<script type="text/ecmascript-6">
const cssFeatures = {
  hover: 'ag-syman-hover',
  imagePreviewBox: 'image-preview-box',
  tooltipBox: 'tooltip-box',
  tooltipTopBox: 'tooltip-top-box',
  textRight: 'text-right',
  attachment: 'attachment',
};

export default {
  name: 'AgCustomerUrlComponent',

  props: {
    params: {
      type: Object,
    }
  },

  data() {
    return {
      cssFeatures
    }
  },

  methods: {

  }
}
</script>

<style lang="scss" scoped>
.ag-syman-hover {
  cursor: pointer;
}
</style>