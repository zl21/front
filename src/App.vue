<template>
  <div style="height: 100%; width: 100%">
    <RouterView />
  </div>
</template>

<script>
  import { hideMenu, launchNetworkMonitor } from './__config__/event.config';
  import { emptyRecord } from './__utils__/indexedDB';
  import network from './__utils__/network';
  import { enableInitializationRequest, cbs } from './constants/global';

  
  export default {
    name: 'App',
    mounted() {
      const loginTime = window.sessionStorage.getItem('loginTime');
      if (loginTime && ((Date.now() - parseInt(loginTime)) < 3000)) {
        if (cbs() && typeof (cbs().loginCb) === 'function') {
          cbs().loginCb();
        }
      }
      hideMenu();
      launchNetworkMonitor();
      emptyRecord(Date.now() - 1000 * 60 * 60);
    },
    created() {
      this.getUserInfo();
    },
    methods: {
      getUserInfo() {
        if (enableInitializationRequest()) {
          network.get('/p/cs/hello').then((res) => {
            if (res.status === 200 && res.data.code === 0) {
              this.$store.commit('global/updataUserInfoMessage', {
                userInfo: res.data
              });
            }
          });
        }
      }
    },
  };
</script>
