<template>
  <div style="height: 100%; width: 100%">
    <RouterView />
  </div>
</template>

<script>
  import { hideMenu } from './__config__/event.config';
  import network from './__utils__/network';
  
  export default {
    name: 'App',
    mounted() {
      hideMenu();
    },
    created() {
      this.getUserInfo();
    },
    methods: {
      getUserInfo() {
        network.get('/p/cs/hello').then((res) => {
          if (res.status === 200 && res.data.code === 0) {
            this.$store.commit('global/updataUserInfoMessage', {
              userInfo: res.data
            });
          }
        });
      }
    },
  };
</script>
