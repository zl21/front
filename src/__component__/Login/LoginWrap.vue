<template>
  <div :class="classes">
    <div ref="container"
         :class="['container', {'loginPro': type && typeToggle === 1}, {'divErCode': type && typeToggle === 2}]">
      <img src="../../assets/image/logo.1.png" alt="logo" class="logo">
      <!--typeToggle===1-->
      <template v-if="!type || typeToggle === 1">
        <AccountLogin
                :loginType="type"
                :TypeToggle="typeToggle"
                @toggle="toggle"
                ref="AccountLogin"
        ></AccountLogin>
      </template>
      <!--typeToggle!==1-->
      <template v-else>
        <PhoneLogin
                :loginType="type"
                :TypeToggle="typeToggle"
                @toggle="toggle"
                ref="PhoneLogin"
        ></PhoneLogin>
      </template>
      <Spin v-show="spinShow" fix>
        <div class="loader">
          <svg class="circular" viewBox="25 25 50 50">
            <circle class="path" fill="none" stroke-width="5" stroke-miterlimit="10"/>
          </svg>
        </div>
      </Spin>
    </div>
    <!--修改密码弹窗-->
    <ModalPwd ref="pwd"/>
  </div>
</template>

<script>
  import AccountLogin from './AccountLogin';
  import PhoneLogin from './PhoneLogin';
  import {enableGateWay, Version, encryptedPassword, classFix} from '../../constants/global';
  import network, {urlSearchParams} from '../../__utils__/network';
  import ModalPwd from './ModalPwd';

  export default {
    name: 'Login',
    components: {AccountLogin, PhoneLogin, ModalPwd},
    data() {
      return {
        globalServiceId: window.localStorage.getItem('serviceId') || '',
        type: window.ProjectConfig.enableLoginPro,
        spinShow: false, // loading是否显示
        typeToggle: 1, // 1用户 2验证码
      }

    },
    created() {
      document.onkeydown = (e) => {
        const key = e.keyCode;
        if (key === 13) {
          // TODO
          this.login();
        }
      };
      // pro模式下获取验证码
      if (window.ProjectConfig.enableLoginPro) {
        this.initPro();
      }
    },
    mounted() {
      // this.$refs.pwd.open()
    },
    computed: {
      classes() {
        return [
          `${classFix}login`,
        ];
      },
    },
    methods: {
      async initPro() {
        // TODO

      },
      login() {
        this.spinShow = true;
        const type = window.ProjectConfig.enableLoginPro;
        const globalServiceId = window.localStorage.getItem('serviceId');
        const randomKey = btoa(`${Math.random() * 10000000000}`).substring(0, 5);
        let message = {};
        if (!type) {
          const {username, password} = this.$refs.AccountLogin.$refs;
          if (username.value === '') {
            message = {
              title: '错误',
              content: '请输入用户名'
            };
            this.spinShow = false;
            this.$Modal.fcError(message);
          } else if (password.value === '') {
            message = {
              title: '错误',
              content: '请输入密码'
            };
            this.spinShow = false;
            this.$Modal.fcError(message);
          } else {
            const param = {
              username: username.value,
              password: encryptedPassword() ? `${randomKey}${btoa(password.value)}` : password.value,
              captcha: '',
              encrypted: encryptedPassword(),
              rememberMe: false,
              lang: 'zh_CN',
            };
            this.loginNet(globalServiceId, param)
          }
        } else {
          if (this.typeToggle === 1) {
            if (this.$refs.AccountLogin.$refs.username.value === '') {
              message = {
                title: '错误',
                content: '请输入用户名'
              };
              this.spinShow = false;
              this.$Modal.fcError(message);
            } else if (this.$refs.AccountLogin.$refs.password.value === '') {
              message = {
                title: '错误',
                content: '请输入密码'
              };
              this.spinShow = false;
              this.$Modal.fcError(message);
            } else if (!this.$refs.AccountLogin.$refs.code.value) {
              this.spinShow = false;
              this.$Modal.fcError({
                title: '错误',
                content: '请输入验证码'
              });
            } else {
              const param = {
                username: this.$refs.AccountLogin.$refs.username.value,
                password:this.$refs.AccountLogin.$refs.password.value,
                code:this.$refs.AccountLogin.$refs.code.value,
                key:this.$refs.AccountLogin.key
              };
              this.codeLogin(globalServiceId, param)
            }
          }
          if (this.typeToggle === 2) {
            if (!this.$refs.PhoneLogin.$refs.phone.value) {
              this.spinShow = false;
              this.$Modal.fcError({
                title: '错误',
                content: '请输入手机号'
              });
            } else if (!this.$refs.PhoneLogin.$refs.sendcode.value) {
              this.spinShow = false;
              this.$Modal.fcError({
                title: '错误',
                content: '请输入短信验证码'
              });
            } else {
              const param = {
                phone: this.$refs.PhoneLogin.$refs.phone.value,
                code: this.$refs.PhoneLogin.$refs.sendcode.value
              };
              this.phoneLogin(globalServiceId, param)
            }
          }
        }
      },
      toggle(num) {
        console.log('toggle-num', num)
        this.typeToggle = num;
      },
      loginCheck() {
        // 检验是否登录
        // 达到30天未换密码
      },
      getCaptcha(globalServiceId) {
        return new Promise(resolve => {
          network.post(enableGateWay() ? `/${globalServiceId}/p/c/getCaptcha` : '/p/c/getCaptcha').then(res => resolve(res))
        })
      },
      async loginNet(globalServiceId, param) {
        this.spinShow = true;
        const captcha = await this.getCaptcha(globalServiceId);
        const limit = Object.assign({}, param, {captcha: captcha.data.captcha});
        network.post(enableGateWay() ? `/${globalServiceId}/p/c/login` : '/p/c/login', urlSearchParams(limit)).then((r) => {
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
      },

      // 1验证码登录
      async codeLogin(globalServiceId, param) {
        this.spinShow = true;
        const captcha = await this.getCaptcha(globalServiceId);
        const limit = Object.assign({}, param, {captcha: captcha.data.captcha});
        console.log('limit', limit)
        network.post(enableGateWay() ? `/${globalServiceId}/p/c/code/login` : '/p/c/code/login', urlSearchParams(limit)).then(r => {

        }).catch(() => this.spinShow = false)
      },

      // 2手机登录
      async phoneLogin(globalServiceId, param) {
        this.spinShow = true;
        const captcha = await this.getCaptcha(globalServiceId);
        const limit = Object.assign({}, param, {captcha: captcha.data.captcha});
        network.post(enableGateWay() ? `/${globalServiceId}/p/c/message/login` : '/p/c/message/login', limit)
      },
      // 登录中间层对接口返回进行处理-判断当前账号密码修改时间是否大于30天
      checkPwdDays() {

      }

    }
  };
</script>
