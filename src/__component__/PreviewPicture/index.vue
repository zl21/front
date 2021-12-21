<template>
  <viewer
    ref="viewer"
    :options="options"
    :images="images"
    :class="viewerCls"
    @inited="inited"
  >
    <template slot-scope="scope">
      <figure class="images">
        <div
          v-for="({NAME, URL},index) in scope.images"
          :key="index"
          class="image-wrapper"
        >
          <img
            class="image"
            :src="URL"
            :data-source="URL"
          >
        </div>
      </figure>
    </template>
  </viewer>
</template>
<script>
  const sourceImages = [];
  const base = parseInt16((Math.random() * 60), 10) + 10;
  for (let i = 0; i < 10; i++) {
    sourceImages.push({
      thumbnail: `https://picsum.photos/id/${base + i}/346/216`,
      source: `https://picsum.photos/id/${base + i}/1440/900`
    });
  }
  import { classFix } from '../../constants/global';

  export default {
    name: 'PreviewPicture',
    props: {
      images: {
        type: Array,
        default: () => []
      },
      defaultIndex: {
        type: Number,
        default: 0
      }
    },
    data() {
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
    computed: {
      viewerCls: () => `${classFix}viewer`,
    },
    methods: {
      getOffset(el) {
        el = el.getBoundingClientRect();
        return {
          left: el.left + window.scrollX,
          top: el.top + window.scrollY
        };
      },
      inited(viewer) {
        this.$viewer = viewer;
        this.$viewer.view(Number(this.defaultIndex) - 1);
        setTimeout(() => {
          // 模拟弹窗拖拽，处理fixed在transform下失效的问题
          const offset = this.getOffset(this.$parent.$el.getElementsByClassName('ark-modal-content')[0]);
          const a = {
            clientX: offset.left + 0.1,
            clientY: offset.top + 0.1
          };
          this.$parent.handleMoveStart(a);
          this.$parent.handleMoveEnd();
        }, 500);
      },
    }
  };
</script>
