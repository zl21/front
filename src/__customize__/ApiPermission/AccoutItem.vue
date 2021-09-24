<template>
  <div
    class="R3-accout-item"
    @mouseenter="mouseenter"
    @mouseleave="mouseleave"
  >
    <div class='accout-item-l'>
      <p>
        <span class="label">{{$t('messages.accountName')}}：</span>
        <span class="value">测试赛搜索</span>
      </p>
      <div>
        <span class="label">appKey： </span><span class="value key">DCSDC</span>
        <span class="label">appSecret： </span><span class="value serect">3232jkjlj2323</span>
        <span class="refresh">
          <img
            src="../../assets/image/refresh.png"
            class="refresh-icon"
            alt=""
          >
        </span>
      </div>
    </div>

    <div
      class="accout-item-r"
      v-show="showButtons"
    >
      <Button
        type="error"
        size="small"
        @click="deleteAccount"
      >{{$t('messages.deleteAccount')}}</Button>
      <Button
        type="info"
        size="small"
      >{{$t('messages.managementAuthority')}}</Button>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'R3AccoutItem',

  data() {
    return {
      showButtons: true
    }
  },

  methods: {
    // 鼠标移入,显示按钮
    mouseenter() {
      this.showButtons = true
    },

    // 鼠标移除,隐藏按钮
    mouseleave() {
      this.showButtons = false
    },

    // 删除账号
    deleteAccount() {
      this.$Modal.confirm({
        mask: true,
        title: this.$t('feedback.error'),
        content: `111`,
        onOk: () => {
          console.log('ok');
        },
        onCancel: () => {
          console.log('cancel')
        }
      });
    }
  }
}
</script>

<style lang="scss" scoped>
</style>