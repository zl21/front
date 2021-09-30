<template>
  <div
    class="R3-accout-item"
    :class="[currentPermissionsIndex === index ? 'hight-light' : '']"
    @mouseenter="mouseenter"
    @mouseleave="mouseleave"
  >
    <div class='accout-item-l'>
      <div class='accout-row'>
        <span class="label">{{$t('messages.accountName')}}：</span>
        <span class="value">{{itemInfo.name}}</span>
      </div>
      <div class='app-wrap'>
        <div class="app-info key">
          <span class="label">appKey：</span><span class="value ">{{itemInfo.credentialKey}}</span>
        </div>
        <div class="app-info">
          <span class="label">appSecret：</span><span class="value serect">{{itemInfo.credentialSecret}}</span>
          <Tooltip
            :content="$t('messages.refreshKey')"
            placement="top"
          >
            <span
              class="refresh"
              @click="refresh"
              :title="$t('messages.refreshKey')"
            >
              <img
                src="../../assets/image/refresh.png"
                class="refresh-icon"
                alt=""
              >
            </span>
          </Tooltip>

        </div>
      </div>
    </div>

    <div
      class="accout-item-r"
      v-show="showButtons"
    >
      <Button
        type="fcdefault"
        size="small"
        @click="deleteAccount"
      >{{$t('messages.deleteAccount')}}</Button>
      <Button
        type="posdefault"
        size="small"
        @click="manageAuthority"
      >{{$t('messages.managementAuthority')}}</Button>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'R3AccoutItem',

  props: {
    index: {
      type: Number
    },

    itemInfo: {
      type: Object
    },
    // 激活的索引
    currentPermissionsIndex: {
      type: Number
    }
  },

  data() {
    return {
      showButtons: false
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
      this.$Modal.fcWarning({
        mask: true,
        showCancel: true,
        title: this.$t('feedback.alert'),
        content: this.$t('messages.confirmDeleteAccount'),
        onOk: () => {
          this.$emit('comfirmDelete', this.itemInfo)
        },
        onCancel: () => {
          this.$emit('cancelDelete')
        }
      });
    },

    // 管理权限
    manageAuthority() {
      this.$emit('manageAuthority', {
        index: this.index,
        item: this.itemInfo
      })
    },

    // 更新密钥
    refresh() {
      this.$Modal.fcWarning({
        mask: true,
        showCancel: true,
        title: this.$t('feedback.alert'),
        content: this.$t('messages.confirmRefreshSecret'),
        onOk: () => {
          this.$emit('comfirmRefresh', this.itemInfo)
        },
        onCancel: () => {
          this.$emit('cancelRefresh')
        }
      });
    }
  }
}
</script>

<style lang="scss" scoped>
</style>