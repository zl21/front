<template>
  <div class="ag-image-component ">
    <img
      v-if="url"
      :src="url"
      alt=""
      class="ag-syman-hover"
      @mouseenter="mouseenter"
      @mouseleave="mouseleave"
      @dblclick="dblclick"
    >
    <pictureViewer
      :images="url?[{URL:url}]: []"
      :show="showViewer"
      :mountedDom="mountedDom"
      @on-cancel="closePreview"
    ></pictureViewer>
  </div>
</template>

<script type="text/ecmascript-6">
import pictureViewer from '../../preview-picture'
function isIE() {
  return window.navigator.userAgent.indexOf('MSIE') >= 1
}

export default {
  name: 'AgImageComponent',

  props: {
    params: {
      type: Object,
    }
  },

  components: {
    pictureViewer
  },

  computed: {
    url() {
      let url = '';
      try {
        url = JSON.parse(this.params.value)[0].URL;
      } catch (e) {
        url = this.params.value;
      }
      return url
    }
  },

  data() {
    return {
      config: {
        smallImageSize: 20, // 图片缩略图最小尺寸
        previewImageSize: 150, // 图片预览图尺寸
      },
      showViewer: false, // 大图预览
      mountedDom: document.body
    }
  },

  methods: {
    // 悬停预览
    mouseenter(e) {
      const { target } = e;
      const { agGridDiv } = this.params;
      if (!target) {
        return
      }

      this.imagePreviewBox = document.createElement('div');
      const imagePreviewBox = this.imagePreviewBox
      imagePreviewBox.innerHTML = '<img alt="" style="width: 100%; height: 100%" />';
      imagePreviewBox.classList.add('image-preview-box');
      const config = this.config
      const offsetLeft = target.getBoundingClientRect().left - agGridDiv.getBoundingClientRect().left;
      const offsetTop = target.getBoundingClientRect().top - agGridDiv.getBoundingClientRect().top;
      imagePreviewBox.childNodes[0].setAttribute('src', `${this.url}?x-oss-process=image/resize,w_${config.previewImageSize}`)
      imagePreviewBox.style.left = `${offsetLeft + (config.smallImageSize * 2)}px`
      imagePreviewBox.style.top = `${offsetTop - (config.previewImageSize - config.smallImageSize) / 2}px`
      agGridDiv.appendChild(imagePreviewBox)
    },

    mouseleave(e) {
      const { agGridDiv } = this.params;
      this.imagePreviewBox && agGridDiv.removeChild(this.imagePreviewBox)
    },

    // 双击大图预览
    dblclick(e) {
      if (isIE()) {
        return
      }

      this.showViewer = true
      e.stopPropagation();
      e.preventDefault()
    },

    // 关闭预览
    closePreview() {
      this.showViewer = false
    }
  },

  mounted() {
    // console.log('组件--',this.params);
  }
}
</script>

<style lang="scss" scoped>
.ag-image-component {
  height: 100%;
  position: relative;
  > img {
    height: 20px;
    width: 20px;
    vertical-align: middle;
  }
}

.image-preview-box {
  width: 150px;
  height: 150px;
  border: 0 solid black;
  position: absolute;
  bottom: 0;
  right: 10000px;
  background-color: #fff;
  z-index: 999999;
  box-shadow: 0 0 1px gray;
  transition-duration: 0.3s;
}
</style>