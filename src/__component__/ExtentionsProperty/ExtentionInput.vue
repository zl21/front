<template>
  <div :class="classes">
    <Description
      :option="option"
      @removeOption="removeOption"
    />
    <div class="content">
      <LabelWithInput
        :item="option"
        :default-data="defaultData"
        @inputValueChange="inputValueChange"
      />
    </div>
  </div>
</template>

<script>
  import Description from './Description.vue';
  import LabelWithInput from './LabelWithInput.vue';
  import { classFix } from '../../constants/global';

  export default {
    name: 'ExtentionInput',
    components: {
      Description,
      LabelWithInput
    },
    methods: {
      removeOption(keyArray) {
        this.$emit('removeOption', keyArray || []);
      },
      inputValueChange({ key, value }) {
        this.$emit('dataChange', { key, value });
      }
    },
    computed: {
      classes: () => `${classFix}extentionCellInput`
    },
    props: {
      option: {
        type: Object,
        default: () => ({})
      },
      defaultData: {
        type: [String, Number, Array, Object],
        default: ''
      }
    }
  };
</script>
