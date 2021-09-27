<template>
  <Drawer
    v-model="show"
    :closable="false"
  >
    <SetPanel
      :panel="setPanel"
      @changePwdBox="changePwdBox"
    />
    <Dialog
      ref="dialogRef"
      :title="dialogConfig.title"
      :mask="dialogConfig.mask"
      :content-text="dialogConfig.contentText"
      :footer-hide="dialogConfig.footerHide"
      :confirm="dialogConfig.confirm"
      :dialog-component-name="dialogComponentName"
    />
  </Drawer>
</template>

<script type="text/ecmascript-6">
import SetPanel from '../SetPanel';
import Dialog from '../Dialog.vue'

export default {
  name: 'Setting',

  components: {
    SetPanel,
    Dialog
  },

  model: {
    props: 'value',
    event: 'change'
  },

  props: {
    // 双向绑定值
    value: {
      type: Boolean,
      default: false
    },
  },

  watch: {
    // 打开设置
    value(newVal) {
      if(newVal) {
        this.show = newVal
      }
    },

    // 关闭设置
    show(newVal) {
      if(!newVal) {
        this.$emit('change',false)
      }
    }
  },

  data() {
    return {
      show: false,
      setPanel: {
        show: true,
        list: [],
      },
      dialogConfig: {
        title: this.$t('feedback.alert'),
        mask: true,
        footerHide: false,
        contentText: '',
        confirm: () => {
        },
      },
      dialogComponentName: null,
    }
  },

  methods: {
    changePwdBox() {
      this.show = false;
      this.$refs.dialogRef.open();
      this.dialogConfig.title = this.$t('tips.changePassword');
      this.dialogConfig.footerHide = true;
      this.dialogComponentName = 'ChangePassword';
    },
  }
}
</script>

<style lang="scss" scoped>
</style>