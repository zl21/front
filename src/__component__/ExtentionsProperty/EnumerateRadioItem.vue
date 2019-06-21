<template>
  <div class="radioItemWrapper">
    <label
      class="radioItem"
      :for="`${option.key}-${index}`"
      v-for="(radio, index) in option.enumerateValue"
      :key="index"
    >
      <input
        :id="`${option.key}-${index}`"
        type="radio"
        :name="option.key"
        :value="radio.value"
        @change="radioValueChange(radio.value)"
      />
      {{radio.text}}
    </label>
  </div>
</template>

<script>
  export default {
    name: 'EnumerateRadioItem',
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
      }
    }
  };
</script>

<style scoped>

</style>
