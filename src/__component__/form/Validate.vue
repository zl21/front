<template>
  <div>
    <slot />
    <div
      v-if="result.msg"
      class="validate-msg"
    >
      {{ result.msg }}
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      validateFunction: {
        type: Function
      },
      data: {}
    },

    name: '',

    watch: {
      data: {
        handler() {
          this.validateValue();
        },
        immediate: true
      }
    },

    data() {
      return {
        ruleList: [],
        result: {
          isPass: true,
          msg: ''
        }
      };
    },

    methods: {
      // 检查空值
      checkVoid() {
        if (this.data === null || this.data === undefined || this.data === '') {
          return {
            isPass: false,
            msg: '请填入具体值'
          };
        } 
        return {
          isPass: true,
          msg: ''
        };
      },

      validateValue() {
        this.ruleList = [];
        // this.ruleList.push(this.checkVoid);
        if (this.validateFunction && typeof this.validateFunction === 'function') {
          this.ruleList.push(this.validateFunction);
        }

        this.ruleList.every((validateRuleFn) => {
          this.result = validateRuleFn();
          return this.result.isPass;
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
  .validate-msg {
      margin-top: 4px;
      margin-bottom: 10px;
      color: red;
      font-size: 12px;
    }
</style>
