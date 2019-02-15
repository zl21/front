<template>
  <h1>{{ $route.path }}</h1>
</template>

<script>
  export default {
    mounted() {
      console.log(this.$route.path, ' mounted .');
    }
  };
</script>

<style scoped>

</style>
