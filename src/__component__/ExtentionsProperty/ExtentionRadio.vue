<template>
  <div :class="extentionRadioCls">
    <Description
      :option="option"
      @removeOption="removeOption"
    />
    <div class="content">
      <EnumerateRadioItem
        :default-data="defaultData"
        :option="option"
        @radioValueChange="radioValueChange"
      />
    </div>
  </div>
</template>

<script>
  import Description from './Description';
  import EnumerateRadioItem from './EnumerateRadioItem';
  import { classFix } from '../../constants/global';

  export default {
    name: 'ExtentionRadio',
    components: {
      Description,
      EnumerateRadioItem
    },
    methods: {
      removeOption(keyArray) {
        this.$emit('removeOption', keyArray || []);
      },
      radioValueChange({ key, value }) {
        this.$emit('dataChange', { key, value });
      }
    },
    computed: {
      extentionRadioCls: () => `${classFix}extentionRadio`,
    },
    props: {
      option: {
        type: Object,
        default: () => ({})
      },
      defaultData: {
        type: [Boolean, String],
        default: '__empty__'
      }
    }
  };
</script>

