<template>
  <div class="R3-add-acount">
    <div class="add-account-wrap">

      <div class="add-account-l">
        <span class="label">{{$t('messages.accountName')}}：</span>
        <Input
          v-model="value"
          class='input-name'
          @on-focus="handlerFocus"
        />
      </div>

      <div class="add-account-r">
        <Button
          type="fcdefault"
          @click="cancel"
        >{{$t('buttons.cancel')}}</Button>
        <Button
          type="posdefault"
          @click="save"
        >{{$t('buttons.save')}}</Button>
      </div>
    </div>

    <!-- 校验提示 -->
    <div class="error-tip" v-show="showMessage">{{$t('messages.enterAccountName')}}</div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'R3AddAcount',

  data() {
    return {
      value: '',
      showMessage: false
    }
  },

  methods: {
    save() {
      if (!this.value) {
        this.showMessage = true
        return
      }
      this.showMessage = false
      this.$emit('save', this.value)
    },

    handlerFocus() {
      this.showMessage = false
    },

    cancel() {
      this.$emit('cancel')
    }
  }
}
</script>

<style lang="scss" scoped>
</style>