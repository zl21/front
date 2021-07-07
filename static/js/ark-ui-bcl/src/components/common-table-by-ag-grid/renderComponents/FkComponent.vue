<template>
  <span :title="params.value || ''">
    <span
      :title="params.value || ''"
      v-if="params.value &&(params.data && params.data.ID.val === '合计' || params.data.ID.val === '总计')"
    >{{params.value || ''}}</span>
    <template v-else>
      <i
        v-if="params.value"
        :class="['iconfont' ,cssFeatures.hover, 'iconbj_link']"
        data-target-tag="fkIcon"
        style="color: #0f8ee9; font-size: 12px"
      ></i>
      <span :title="params.value || ''">{{params.value || ''}}</span>
    </template>
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
  name: 'AgFkComponent',

  data() {
    return {
      cssFeatures
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

  }
}
</script>

<style lang="scss" scoped>
.ag-syman-hover {
  cursor: pointer;
}
</style>