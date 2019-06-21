<template>
  <div class="radioItemWrapper">
    <label
      class="radioItem"
      v-for="(radio, index) in option.enumerateValue"
      :for="`${option.key}-${guid}-${index}`"
      :key="index"
    >
      <input
        :id="`${option.key}-${guid}-${index}`"
        type="radio"
        :name="`${option.key}-${guid}`"
        :value="radio.value"
        @change="radioValueChange(radio.value)"
      />
      {{radio.text}}
    </label>
    <!-- 清空项   -->
    <label
      class="radioItem"
      :for="`${option.key}-${guid}-clean`"
    >
      <input
        type="radio"
        :id="`${option.key}-${guid}-clean`"
        :name="`${option.key}-${guid}`"
        @change="radioValueChange('')">
      <span style="color: red;">清除此配置项</span>
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
    }
  };
</script>

<style scoped>

</style>
