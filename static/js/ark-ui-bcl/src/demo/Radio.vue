<template>
  <div>
    <h5>radio单选框</h5>
    <ak-radio :options="options" @change="changeFn"></ak-radio>
  </div>
</template>

<script type="text/ecmascript-6">
import AkRadio from '../components/radio'

export default {
  name: '',

  components: {
    AkRadio
  },

  data() {
    return {
      options: {
        defaultValue: 'b',
        selectOptions: [
          {
            label: 'a',
            value: 1
          },
          {
            label: 'b',
            value: 2
          },
          {
            label: 'c',
            value: 3
          }
        ]
      }
    }
  },

  methods: {
      changeFn(value) {
        console.log(value);
      }
  }
}
</script>

<style lang="scss" scoped>
  
</style>