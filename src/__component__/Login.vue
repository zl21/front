<template>
  <div :class="classes">
    <div
      ref="container"
      class="container"
    >
      <img
        src="../assets/image/logo.1.png"
        alt="logo"
        class="logo"
      >
      <span class="titleTOP">{{$t('tips.userLogin')}}</span>
      <div class="divAccount">
        <img
          src="../assets/image/account.png"
          class="icon"
        >
        <input
          ref="username"
          type="text"
          value=""
          class="username"
          :placeholder="$t('messages.enterUserName')"
        >
      </div>
      <div class="divMima">
        <img
          src="../assets/image/password.png"
          class="icon"
        >
        <input
          ref="password"
          type="password"
          value=""
          class="pwd"
          :placeholder="$t('messages.enterPassword')"
        >
      </div>

      <div
        id="btn"
        class="btn"
        @click="login"
      />
      <Spin
        v-show="spinShow"
        fix
      >
        <div class="loader">
          <svg
            class="circular"
            viewBox="25 25 50 50"
          >
            <circle
              class="path"
              fill="none"
              stroke-width="5"
              stroke-miterlimit="10"
            />
          </svg>
        </div>
      </Spin>
    </div>
  </div>
</template>

<script>
  import { enableGateWay, Version, encryptedPassword, classFix } from '../constants/global';
  import network, { urlSearchParams } from '../__utils__/network';
  import { getSessionObject, removeSessionObject } from '../__utils__/sessionStorage';

  export default {
    name: 'Login',
    data() {
      return {
        spinShow: false, // loading是否显示

      };
    },
    mounted() {
    },
    computed: {
      classes() {
        return [
          `${classFix}login`,
        ];
      },
    },
    methods: {

      login() {
        this.spinShow = true;

        let message = {};
        if (this.$refs.username.value === '') {
          message = {
            title: this.$t('feedback.error'),
            content: this.$t('messages.enterUserName')
          };
          this.spinShow = false;
          this.$Modal.fcError(message);
        } else if (this.$refs.password.value === '') {
          message = {
            title: this.$t('feedback.error'),
            content: this.$t('messages.enterPassword')
          };
          this.spinShow = false;
          this.$Modal.fcError(message);
        } else if (this.$refs.username.value !== '' && this.$refs.password.value !== '') {
          const globalServiceId = window.localStorage.getItem('serviceId');
          this.spinShow = true;
          console.log(enableGateWay() , `/${globalServiceId}`);
          network.post(enableGateWay() ? `/${globalServiceId}/p/c/getCaptcha` : '/p/c/getCaptcha').then((res) => {
            const randomKey = btoa(`${Math.random() * 10000000000}`).substring(0, 5);
            network.post(enableGateWay() ? `/${globalServiceId}/p/c/login` : '/p/c/login', urlSearchParams({
              username: this.$refs.username.value,
              password: encryptedPassword() ? `${randomKey}${btoa(this.$refs.password.value)}` : this.$refs.password.value,
              captcha: res.data.captcha,
              encrypted: encryptedPassword(),
              rememberMe: false,
              lang: 'zh_CN',
            })).then((r) => {
              if (Version() === '1.3') {
                if (r.status === 200 && r.data.code === 1) {
                  if (r.data && r.data.user && r.data.user.userenv) {
                    window.localStorage.setItem('userInfo', JSON.stringify(r.data.user.userenv));
                  }
                  window.sessionStorage.setItem('loginTime', `${Date.now()}`);
                  this.spinShow = false;
                  window.location.href = window.location.origin;
                } else {
                  this.spinShow = false;
                }
              } else if (r.status === 200 && r.data.code === 0) {
                this.spinShow = false;
                window.sessionStorage.setItem('loginTime', `${Date.now()}`);
                window.location.href = window.location.origin;

                // window.location.reload();
              } else {
                this.spinShow = false;
              }
            }).catch(() => {
              this.spinShow = false;
            });
          });
        }
      }
    },
    created() {
      document.onkeydown = (e) => {
        const key = e.keyCode;
        if (key === 13) {
          this.login();
        }
      };
    },
    mounted(){
      console.log(this,'========')
    }
  };
</script>
