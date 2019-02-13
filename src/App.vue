<template>
  <div style="height: 100%; width: 100%">
    <RouterView></RouterView>
  </div>
</template>

<script>
  import { hideMenu } from './__config__/event.config';
  
  export default {
    name: 'App',
    mounted() {
      hideMenu();
    }
  };
</script>
