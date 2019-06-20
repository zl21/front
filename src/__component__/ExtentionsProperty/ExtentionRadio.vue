<template>
  <div class="extentionRadio">
    <div class="description">{{option.description}}</div>
    <div class="content">
      <label
        class="radioItem"
        :for="`${option.key}-${index}`"
        v-for="(radio, index) in option.enumerateValue"
        :key="index"
      >
        <input :id="`${option.key}-${index}`" type="radio" :name="option.key" />
        {{radio.text}}
      </label>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Radio',
    props: {
      option: {
        type: Object,
        default: () => ({})
      }
    }
  };
</script>

<style lang="less">
  .extentionRadio {
    display: flex;
    flex-direction: column;
  }
</style>
