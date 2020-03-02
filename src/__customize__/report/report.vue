<template>
  <div class="report">
    报表界面
  </div>
</template>
<script>
  import network, { urlSearchParams } from '../../__utils__/network';


  export default {
    methods: {
      axios() {
        network.post('接口名称', urlSearchParams(
          // 参数
        )).then((res) => {
         
        }).catch((error) => {
         
        });
      },
    }
  };
</script>
<style scoped>

</style>
