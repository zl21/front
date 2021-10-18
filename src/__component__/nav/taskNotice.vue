<template>
  <div class="r3-notice-content">
    <div class="notice-header">
      <div class="notice-header-l">
        <span>{{$t('tips.message')}}</span>
      </div>
      <div class="notice-header-r">
        <a
          href="javascript:void(0);"
          @click="close"
        >
          <Icon
            type="ios-close"
            size="22"
          ></Icon>
        </a>
      </div>
    </div>

    <div class="notice-body" @click="handleClick">
      <div class="notice-body-l">
        <Icon
          type="ios-checkmark-circle-outline"
          size="24"
          class="notice-success"
          v-if="info.TASK_STATE.refobjval === 2"
        />
        <Icon
          type="ios-close-circle-outline"
          size="24"
          class="notice-error"
          v-else
        />

      </div>
      <div class="notice-body-r">
        <div class="notice-task">[{{$t('tips.asyncTask')}}]{{$t('tips.task')}}：{{ info.MENU.val }}</div>
        <div class="notice-status">{{info.MESSAGE.val}}！</div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import i18n from '../../assets/js/i18n/index'

export default {
  name: '',

  props: {
    info: {
      type: Object,
      required: true
    },
    close: {
      type: Function,
      required: true,
    },
    jump: {
      type: Function,
      required: true,
    }
  },

  beforeCreate() {
    this.$t = i18n.t.bind(i18n)
  },

  data() {
    return {

    }
  },

  methods: {
    // 我的任务单条跳转单对象界面
    handleClick() {
      this.jump(this.info)
    },
  },
}
</script>