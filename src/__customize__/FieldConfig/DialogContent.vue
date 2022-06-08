<template>
  <div class="dialog-content">
    <div class="dialog-content-title">{{$t('fieldConfig.templateName')}}：</div>
    <div>
      <Input
        @on-change="change"
        :placeholder="$t('fieldConfig.pleaseEnter')"
      ></Input>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import i18n from '../../assets/js/i18n'

export default {
  name: 'DialogContent',

  beforeCreate() {
    this.$t = i18n.t.bind(i18n)
  },

  data() {
    return {

    }
  },

  methods: {
    change(e) {
      this.$emit('change', e)
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog-content {
  padding: 20px 10px;
  .dialog-content-title {
    margin-bottom: 8px;
  }
}
</style>