<template>
  <span>
    <template v-if="Object.prototype.toString.call(value) === '[object Array]' && getDocFileWebConf">
      <span
        class="attachment-wrapper"
        v-for="d in value"
        :key="d.name"
      ><a
          class="attachment"
          :href="`${getDocFileWebConfUrl}?url=${d.url || ''}`"
          target="_blank"
        ><i class="iconfont iconmd-document"></i> {{d.name}} {{d.Size ? `(${d.Size})` : ''}}</a></span>&nbsp;
    </template>
    <template v-if="Object.prototype.toString.call(value) === '[object Array]' && !getDocFileWebConf">
      <span
        class="attachment-wrapper"
        v-for="d in value"
        :key="d.name"
      ><a
          class="attachment"
          :href="`${d.url || ''}`"
        ><i class="iconfont iconmd-document"></i> {{d.name}} {{d.Size ? `(${d.Size})` : ''}}</a></span>&nbsp;
    </template>
  </span>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'AgAttachmentComponent',

  data() {
    return {
      getDocFileWebConfUrl: '',
      getDocFileWebConf: false,
      value: null
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
    const { value } = this.params;
    this.value = JSON.parse(value)

    // webconf配置docFile则走docFile配置程序，点击上传的文件取消下载功能，改为预览功能
    // const getCurrentKeepAliveModuleName = store.state[getKeepAliveModuleName(router.currentRoute)]
     const getCurrentKeepAliveModuleName = {
       webConf: null
     }
    if (getCurrentKeepAliveModuleName.webConf && getCurrentKeepAliveModuleName.webConf.docFile && getCurrentKeepAliveModuleName.webConf.docFile.isPreview) {
      this.getDocFileWebConf = getCurrentKeepAliveModuleName.webConf.docFile.isPreview;
      this.getDocFileWebConfUrl = getCurrentKeepAliveModuleName.webConf.docFile.url;
    }

  }
}
</script>

<style lang="scss" scoped>
</style>