<template>
  <span :title="params.value || ''">
    <span
      :title="params.value || ''"
      v-if="params.value &&(params.data && params.data.ID.val === $t('tips.summation') || params.data.ID.val === $t('tips.total'))"
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
import i18n from '../../../utils/i18n'

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

  },

  beforeCreate() {
    this.$t = i18n.t.bind(i18n)
  },
}
</script>

<style lang="scss" scoped>
.ag-syman-hover {
  cursor: pointer;
}
</style>