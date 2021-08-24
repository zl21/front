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
      validateValue() {
        this.ruleList = [];
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
