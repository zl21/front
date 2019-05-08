<template>
  <div>
    <input
      ref="username"
      type="text"
      value="root"
    >
    <br>
    <input
      ref="password"
      type="password"
      value="123"
    >
    <br>
    <input
      type="button"
      value="点击登录"
      @click="login"
    >
  </div>
</template>

<script>
  import network, { urlSearchParams } from '../__utils__/network';
  
  export default {
    name: 'Login',
    methods: {
      
      login() {
        network.post('/p/c/getCaptcha').then((res) => {
          network.post('/p/c/login', urlSearchParams({
            username: this.$refs.username.value,
            password: this.$refs.password.value,
            captcha: res.data.captcha,
            rememberMe: false,
            lang: 'zh_CN',
          })).then((r) => {
            if (r.status === 200 && r.data.code === 0) {
              window.location.href = window.location.origin;
            }
          });
        });
      }
    }
  };
</script>

<style scoped>

</style>
