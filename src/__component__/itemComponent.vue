<template>
  <div>
    <Input
      id=""
      v-model="_items.value"
      type="text"
      name=""
      @on-change="inputChange"
    />
  </div>
</template>

<script>
  import dataProp from '../__config__/props.config';

  console.log(dataProp);

  export default {
    name: 'ItemComponent',
    props: {
      items: {
        type: Object,
        default() {
          return {};
        }
      },
      index: {
        type: Number,
        default() {
          return 0;
        }
      }
    },
    data() {
      return {
      };
    },
    computed: {
      _items() {
        return this.items;
      }
    },
    watch: {

    },
    methods: {
      inputChange(event) {
         console.log(this.index);
        this.$emit('inputChange', event.target.value, this.items, this.index);
      }
    },
    created() {

    }
  };
</script>

<style lang="less">

</style>
