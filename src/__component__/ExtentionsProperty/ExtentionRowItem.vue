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

<style lang="scss" scoped>
.row {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 5px;
  &:first-child {
    margin-top: 0px;
  }
  .btn-group {
    flex: 50px 0 0;
    .operate-button {
      background-color: transparent;
      outline: none;
      font-size: 16px;
      border: 1px solid lightgrey;
      width: 20px;
      display: inline-block;
      height: 20px;
      line-height: 0px;
      border-radius: 50%;
      color: grey;
      &:hover {
        color: #000;
        cursor: pointer;
        opacity: 0.8;
      }
    }
  }
}

  .col {
    flex: 1;
    margin-right: 5px;
    &:last-child {
      margin-right: 0;
    }
  }

// label样式
.row-title {
  flex: 135px 0 0;
  display: flex;
  justify-content: flex-end;
}

.label-placeholder {
  margin-right: 5px;
}

.error-tip {
  color: red;
  display: flex;
}

.required-remark {
  position: relative;
  &::before {
    content: '*';
    color: red;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: -8px;
  }
}

.tw-mt-10 {
  margin-top: 10px
}

.tw-inline-block {
  display: inline-block
}
</style>
