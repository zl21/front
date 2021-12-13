<template>
  <div
    class="r3-notice-content"
    v-if="info"
  >
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

    <div
      class="notice-body"
      @click="handleClick"
    >
      <div class="notice-body-l">
        <Icon
          type="ios-checkmark-circle-outline"
          size="24"
          class="notice-success"
          v-if="isSuccess"
        />
        <Icon
          type="ios-close-circle-outline"
          size="24"
          class="notice-error"
          v-else
        />

      </div>
      <div class="notice-body-r">
        <div class="notice-task">{{noticeMessage}}{{this.isSuccess && this.isExport ? `，${$t('messages.seeDetails')}` : ''}}
          <a :href="link"  color="#1200F5" download  v-if="this.isSuccess && this.isExport" @click.stop="readTask">【{{$t('messages.downloadFile')}}】</a>
        </div>
        <!-- <div class="notice-status one-line-flow" :title="content">{{content}}！</div> -->
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import i18n from '../../assets/js/i18n/index'
import network, { urlSearchParams } from '../../__utils__/network';
import {
  Version,
  enableGateWay,
} from '../../constants/global';

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

  computed: {
    statusMessage() {
      return this.info.MESSAGE && this.info.MESSAGE.val || (this.info.CONTENT && this.info.CONTENT.val)
    },

    // 是否是导出任务
    isExport() {
      if(Version() === '1.3') {
        return this.info.TASKTYPE.val === '导出'
      } else {
        return this.info.TITLE.val === 'excel导出'
      }
    },

    isSuccess() {
      return (this.info.TASK_STATE && this.info.TASK_STATE.refobjval === 2) || (this.info.TASKSTATE && this.info.TASKSTATE.val === '已完成')
    },

    noticeMessage() {
      const beginTime =  Version() === '1.3' ?  this.info.BEGINTIME.val : this.info.CREATIONDATE.val
      return `${beginTime} ${this.$t('messages.operated')}【${this.info.MENU.val}】【${this.isExport ? this.$t('buttons.export') : this.$t('buttons.import')}】${this.statusMessage}`
    },

    // 下载用的a标签
    link() {
      let url = ''
      const serviceId = window.localStorage.getItem('serviceId')
      const fileUrl = Version() === '1.3' ? this.info.URL.val : this.info.FILE_URL.val // 接口返回的下载地址
      if(fileUrl) {
        url = serviceId ? `/${serviceId}${JSON.parse(fileUrl)[0].url}` : JSON.parse(fileUrl)[0].url
      }
      return url
    }
  },

  methods: {
    // 我的任务单条跳转单对象界面
    handleClick() {
      this.jump(this.info)
    },

    // 将任务设置为已读
    async readTask() {
      const url = Version() === '1.4' ? '/p/cs/u_note/ignoreMsg': '/p/cs/ignoreMsg'
      const data = Version() === '1.4' ? { id: this.info.ID.val } : urlSearchParams({ id: this.info.ID.val })
      await network.post(url, data,{
        serviceId: Version() === '1.4' && enableGateWay() ? 'asynctask' : ''
      })
    }
  },
}
</script>