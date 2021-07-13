<template>
  <div
    ref="radioItemWrapper"
    class="radioItemWrapper"
  >
    <label
      v-for="(radio, index) in option.enumerateValue"
      :key="index"
      :for="`${option.key}-${guid}-${index}`"
      class="radioItem"
    >
      <input
        :id="`${option.key}-${guid}-${index}`"
        type="radio"
        :name="`${option.key}-${guid}`"
        :value="radio.value"
        @change="radioValueChange(radio.value)"
      >
      {{ radio.text }}
    </label>
    <!-- 清空项   -->
    <label
      class="radioItem"
      :for="`${option.key}-${guid}-clean`"
    >
      <input
        :id="`${option.key}-${guid}-clean`"
        type="radio"
        :value="'__empty__'"
        :name="`${option.key}-${guid}`"
        @change="radioValueChange('')"
      >
      <span>
        清除此配置项
      </span>
    </label>
  </div>
</template>

<script>
  const getGuid = () => Math.round(Math.random() * 10000000000);
  export default {
    name: 'EnumerateRadioItem',
    data() {
      return {
        guid: getGuid()
      };
    },
    methods: {
      radioValueChange(value) {
        this.$emit('radioValueChange', { key: this.option.key, value });
      }
    },
    props: {
      option: {
        type: Object,
        default: () => ({})
      },
      breakLine: {
        type: Boolean,
        default: true
      },
      defaultData: {
        type: [Boolean, String],
        default: '__empty__'
      }
    },
    mounted() {
      this.$refs.radioItemWrapper.querySelectorAll('input[type=radio]').forEach((e) => {
        if (`${e.value}` === `${this.defaultData}`) {
          e.checked = true;
        }
      });
    }
  };
</script>
