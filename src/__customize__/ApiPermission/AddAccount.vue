<template>
  <div class="R3-add-acount">
    <div class="add-account-l">
      <span class="label">{{$t('messages.accountName')}}：</span>
      <Input
        v-model="value"
        class='input-name'
      />
    </div>
    <div class="add-account-r">
      <Button type="info">{{$t('buttons.cancel')}}</Button>
      <Button type="success">{{$t('buttons.save')}}</Button>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'R3AddAcount',

  data() {
    return {
      value: ''
    }
  },

  methods: {

  }
}
</script>

<style lang="scss" scoped>
</style>