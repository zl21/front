<template>
  <div style="height: 100%; width: 100%">
    <RouterView />
  </div>
</template>

<script>
  import { hideMenu, launchNetworkMonitor } from './__config__/event.config';
  import { emptyRecord, emptySearch } from './__utils__/indexedDB';
  import network from './__utils__/network';
  import { enableInitializationRequest, cbs, dateStorageTime } from './constants/global';
  import DispatchEvent from './__utils__/dispatchEvent';


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
      emptyRecord(Date.now() - Number(dateStorageTime() ? dateStorageTime() : 1) * 24 * 1000 * 60 * 60);
    },
    created() {
      this.getUserInfo();
    },
    methods: {
      getUserInfo() {
        if (enableInitializationRequest()) {
          network.get('/p/cs/hello').then((res) => {
            // 此方法用于向外界（JFlow）提供用户信息。供外部处理自己的需要逻辑。
            DispatchEvent('userReady', {
              detail: {
                userInfo: JSON.parse(JSON.stringify(res.data))
              }
            });
            if (res.status === 200 && res.data.code === 0) {
              this.$store.commit('global/updataUserInfoMessage', {
                userInfo: res.data
              });
              window.localStorage.setItem('userInfo', JSON.stringify(res.data));
            }
          });
        }
      }
    },
  };
</script>
