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

    watch: {
      '$route'(to, from) {
        // 检查系统升级
        const { enableSystemUpdate } = window.ProjectConfig
        if(enableSystemUpdate) {
          const isFromUpDate = from.path === 'R3UpdateSystem' && to.path === '/' // 从升级界面跳转到主界面
          const isFromLogin = from.path === 'login' && to.path === '/' // 从升级界面跳转到主界面
          if(!(isFromUpDate || isFromLogin)) {
            this.checkUpdate()
          }
        }
      }
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
              window.localStorage.setItem('sessionCookie',res.data.sessionCookie);
            }
          });
        }
      },

      // 检查系统是否升级完毕
      checkUpdate() {
        network.post(`/p/cs/retail/queryLiquibaseExeStatus?hash=${new Date().getTime()}`).then(result => {
          const res = result.data
          if (res.code === 0 && res.data.needUpdate) {
            this.$router.push({ path:'/R3UpdateSystem'})
          } 
        })
      }
    },
  };
</script>
