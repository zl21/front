<template>
  <div class="aa">Children1</div>
</template>

<script>
import Base from "./Base";
export default {
  name: "Children1",
  extends: Base,
  data() {
    return {
      // render: 'Children1 Render'
      aa: 'Children1 Render'
    };
  },
  mounted() {
    console.log(this);
  }
};
</script>

<style scoped>
.aa {
  color: red;
}
</style>
