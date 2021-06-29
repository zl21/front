<template>
  <div class="tw-mt-10">
    <div class="row">
      <div
        v-if="rowLabel"
        class="col row-title"
        :class="[rowLabelClass]"
      >
        <span :class="[isRequired?'required-remark': '']">{{ rowLabel }}：</span>
      </div>

      <slot />

      <div
        v-if="showOperationButton"
        class="col btn-group"
      >
        <button
          v-if="rowCount - 1 === rowIndex"
          class="operate-button"
          @click="addRow"
        >
          <i class="iconfont">&#xec3f;</i>
        </button>
        <button
          v-if="rowCount > 1"
          class="operate-button"
          @click="removeRow"
        >
          <i class="iconfont">&#xed15;</i>
        </button>
      </div>
    </div>
    <div
      v-if="errorTip"
      class="error-tip tw-mt-10"
    >
      <!-- 撑开和label一样的位置 -->
      <div
        class="tw-inline-block row-title label-placeholder"
        :class="[rowLabelClass]"
      />
      {{ errorTip }}
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: '',

    props: {
      // 行索引
      rowIndex: {
        type: Number,
        default: -1
      },
      // 总行数。用于控制按钮是否显示
      rowCount: {
        type: Number,
        default: -1
      },
      // 行的label样式
      rowLabelClass: {
        type: String,
        default: ''
      },
      // 行的label
      rowLabel: {
        type: String,
        default: ''
      },
      // 是否显示增删行的按钮
      showOperationButton: {
        type: Boolean,
        default: false
      },
      // 校验提示
      errorTip: {
        type: String,
        default: ''
      },
      // 是否是必填项
      isRequired: {
        type: Boolean,
        default: false
      },
    },

    data() {
      return {

      };
    },

    methods: {
      // 添加行
      addRow() {
        this.$emit('addRow');
      },

      // 删除行
      removeRow() {
        this.$emit('removeRow');
      },
    }
  };
</script>
