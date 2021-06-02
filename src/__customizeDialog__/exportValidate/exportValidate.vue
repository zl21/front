<template>
  <div>
    导出校验
    <i-switch
      v-model="switchV"
      @on-change="change"
    />

    <div class="pop-btn">
      <button
        class="sav-btn"
        @click="save"
      >
        <span>自定义确定</span>
      </button>
      <button
        class="cancel-btn"
        @click="cancel"
      >
        <span>取消</span>
      </button>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: '',

    props: {
      // 给内容组件的所有参数
      externalOptions: {
        type: Object,
        default: () => {}
      }
    },

    data() {
      return {
        switchV: false
      };
    },

    mounted() {
      console.log(this);
    },

    methods: {
      change(status) {
        this.switchV = status;
      },

      save() {
        if (this.switchV) {
          this.$emit('ok');
        }
      },

      cancel() {
        this.$emit('cancel');
      }
    }
  };
</script>
