<template>
    展示form
</template>

<script>
  export default {
    name: "CompositeForm",
    props: {
      defaultData: {
        type: Array,
        default() {
          return [];
        }
      },
      type: {
        type: String,
        default() {
          return '';
        }
      }
    }
  }
</script>

<style scoped>

</style>
