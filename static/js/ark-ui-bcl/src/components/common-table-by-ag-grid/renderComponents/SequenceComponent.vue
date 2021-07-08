<template>
  <span ref="sequence">
    <template v-if="valueOfId === '合计' || valueOfId === '总计'">{{valueOfId}}</template>
    <span
      v-else
      style="color: #0f8ee9"
      data-target-tag="rowIndex"
    >{{(params.data[AG_SEQUENCE_COLUMN_NAME] && params.data[AG_SEQUENCE_COLUMN_NAME].val) || '' + parseInt(params.options.datas.start, 10)}}</span>
  </span>
</template>

<script type="text/ecmascript-6">
const AG_SEQUENCE_COLUMN_NAME = '__ag_sequence_column_name__';

const cssFeatures = {
  hover: 'ag-syman-hover',
  imagePreviewBox: 'image-preview-box',
  tooltipBox: 'tooltip-box',
  tooltipTopBox: 'tooltip-top-box',
  textRight: 'text-right',
  attachment: 'attachment',
};

export default {
  name: 'AgSequenceComponent',

  data() {
    return {
      valueOfId: null,
      AG_SEQUENCE_COLUMN_NAME
    }
  },

  props: {
    params: {
      type: Object,
    }
  },

  methods: {
    mouseenter(e) {
      const {
        agGridDiv, tooltipBox, options, value, failIds,
      } = this.params;

      const { target } = e;
      const offsetLeft = target.getBoundingClientRect().left - agGridDiv.getBoundingClientRect().left;
      const offsetTop = target.getBoundingClientRect().top - agGridDiv.getBoundingClientRect().top;
      const offsetBottom = agGridDiv.getBoundingClientRect().bottom - target.getBoundingClientRect().bottom;
      tooltipBox.style.display = '';
      tooltipBox.style.left = `${offsetLeft + 22}px`;
      tooltipBox.style.top = `${offsetTop - (target.offsetHeight / 2)}px`;
      if (options && options.datas && options.datas.deleteFailInfo && Object.prototype.toString.call(options.datas.deleteFailInfo) === '[object Array]') {
        tooltipBox.innerText = options.datas.deleteFailInfo[failIds.indexOf(value)].message;
      }
      const offsetBottomCalibration = tooltipBox.offsetHeight - offsetBottom - 12;
      if (offsetBottomCalibration > 0) {
        tooltipBox.style.top = `${(offsetTop - (target.offsetHeight / 2)) - (offsetBottomCalibration)}px`;
        const pseudoStyle = document.createElement('style');
        pseudoStyle.setAttribute('type', 'text/css');
        pseudoStyle.setAttribute('id', 'pseudoStyle');
        pseudoStyle.innerText = `
        .${cssFeatures.tooltipBox}::before {
            top: ${8 + (offsetBottomCalibration)}px !important;
        }`;
        document.head.appendChild(pseudoStyle);
      }
    },
    mouseleave() {
      const {
        tooltipBox
      } = this.params;

      tooltipBox.style.display = 'none';
      const pseudoStyle = document.getElementById('pseudoStyle');
      if (pseudoStyle) {
        pseudoStyle.remove();
      }
    }
  },

  mounted() {
    this.valueOfId = this.params.data && this.params.data.ID ? this.params.data.ID.val : '';
    const {
      value, failIds,
    } = this.params;

    if (failIds && failIds.indexOf(`${value}`) > -1) {
      const toolTipIcon = document.createElement('i');
      toolTipIcon.setAttribute('class', `iconfont iconbj_listwarning ${cssFeatures.hover}`);
      toolTipIcon.style.color = 'red';
      toolTipIcon.onmouseenter = this.mouseenter;
      toolTipIcon.onmouseleave = this.mouseleave;
      this.$refs.sequence.appendChild(toolTipIcon);
    }
  }
}
</script>

<style lang="scss" scoped>
.ag-syman-hover {
  cursor: pointer;
}

.tooltip-box {
  pointer-events: none;
  background-color: black;
  position: absolute;
  z-index: 99999;
  color: #fff;
  font-size: 12px;
  padding: 5px 10px;
  border-radius: 4px;
  display: block;
  border: 1px solid black;
  max-width: 200px;
  word-break: break-all;
  text-align: left;
  left: -10000px;
}

.tooltip-box::before {
  pointer-events: none;
  display: block;
  content: '';
  top: 8px;
  float: left;
  position: absolute;
  left: -11px;
  border-right: 5px solid black;
  border-left: 5px solid transparent;
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
}
</style>