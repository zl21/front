<template>
  <div>
    <Modal :value="show"
           v-bind="ModalProps"
           ref="preview"
           :styles="{position: 'absolute', top: '32%'}"
           @on-cancel="cancel">
      <viewer ref="viewer"
              :options="options"
              :images="images"
              class="viewer"
              @inited="inited">
        <template slot-scope="scope">
          <figure class="images">
            <div v-for="({URL},index) in scope.images"
                 :key="index"
                 class="image-wrapper">
              <img class="image"
                   :src="URL"
                   :data-source="URL">
            </div>
          </figure>
        </template>
      </viewer>
    </Modal>
  </div>
</template>
<script>

const sourceImages = [];
const base = parseInt((Math.random() * 60), 10) + 10;
for (let i = 0; i < 10; i++) {
  sourceImages.push({
    thumbnail: `https://picsum.photos/id/${base + i}/346/216`,
    source: `https://picsum.photos/id/${base + i}/1440/900`
  });
}
import Config from '../../../config/nameConfig';
const prefixCls = `${Config.prefixCls}PreviewPicture`;

export default {
  name: prefixCls,
  props: {
    show:{
      type:Boolean,
      default:()=>{
        return false
      }
    },
    images: {
      type: Array,
      default: () => []
    },
    defaultIndex: {
      type: Number,
      default: 0
    },
    ModalProps: {  // 弹窗属性
      type: Object,
      default: () => {
        return {
          closable: true,
          width: 500,
          height: 300,
          draggable: true,
          title: '图片预览',
          'z-index': 10001,
          'footer-hide': true
        }

      }
    },
    mountedDom: {
      type: HTMLElement,
    }
  },
  watch:{

  },
  data () {
    return {
      options: {
        inline: true,
        button: true,
        navbar: true,
        title: false,
        toolbar: true,
        tooltip: true,
        movable: true,
        zoomable: true,
        rotatable: true,
        scalable: true,
        transition: true,
        fullscreen: true,
        keyboard: true,
        url: 'data-source'
      },
    };
  },
  methods: {
    cancel () {
      this.$emit('on-cancel');
    },
    getOffset (el) {
      el = el.getBoundingClientRect();
      return {
        left: el.left + window.scrollX,
        top: el.top + window.scrollY
      };
    },
    inited (viewer) {
      this.$viewer = viewer;
      this.$viewer.view(Number(this.defaultIndex) - 1);
      setTimeout(() => {
        // 模拟弹窗拖拽，处理fixed在transform下失效的问题
        const dom = this.mountedDom || this.$parent.$el.getElementsByClassName('ark-modal-body')[0]
        const offset = this.getOffset(dom);
        const a = {
          clientX: offset.left + 0.1,
          clientY: offset.top + 0.1
        };
        this.$parent.handleMoveStart && this.$parent.handleMoveStart(a);
        this.$parent.handleMoveEnd && this.$parent.handleMoveEnd();
      }, 500);
    },
  },
  mounted(){
    // console.log('images', this.images)
  }
};
</script>
<style lang="less" >
.viewer-wrapper {
  position: relative;
  background: #333;
  height: 100%;
}
.viewer {
  height: 300px;
  width: 100%;
  overflow: hidden;
  .images {
    height: 100%;
    display: flex;
    justify-content: center;
    align-content: center;
    align-items: center;
    flex-wrap: wrap;
    padding: 5px;
    .image-wrapper {
      display: inline-block;
      width: calc(33% - 20px);
      margin: 5px 5px 0 5px;
      .image {
        width: 100%;
        cursor: pointer;
        display: inline-block;
      }
    }
  }
}
</style>
