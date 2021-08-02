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
  import {enableGateWay, Version, encryptedPassword, classFix, enableLoginPro} from '../../constants/global';
  import network, {urlSearchParams} from '../../__utils__/network';
  import ModalPwd from './ModalPwd';

  export default {
    name: 'Login',
    components: {AccountLogin, PhoneLogin, ModalPwd},
    data() {
      return {
        globalServiceId: window.localStorage.getItem('serviceId') || '',
        type: enableLoginPro,
        spinShow: false, // loading是否显示
        typeToggle: 1, // 1用户 2验证码
        flag: 1,
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
      login() {
        this.spinShow = true;
        const globalServiceId = window.localStorage.getItem('serviceId');
        const randomKey = btoa(`${Math.random() * 10000000000}`).substring(0, 5);
        let message = {};
        if (!this.type) {
          const {username, password} = this.$refs.AccountLogin.$refs;
          if (username.value === '') {
            message = {
              title: '错误',
              content: '请输入用户名',
              mask: true,
            };
            this.spinShow = false;
            this.$Modal.fcError(message);
          } else if (password.value === '') {
            message = {
              title: '错误',
              content: '请输入密码',
              mask: true,
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
            this.loginNet('/p/c/login', globalServiceId, param)
          }
        } else {
          if (this.typeToggle === 1) {
            if (this.$refs.AccountLogin.$refs.username.value === '') {
              message = {
                title: '错误',
                content: '请输入用户名',
                mask: true,
              };
              this.spinShow = false;
              this.$Modal.fcError(message);
            } else if (this.$refs.AccountLogin.$refs.password.value === '') {
              message = {
                title: '错误',
                content: '请输入密码',
                mask: true,
              };
              this.spinShow = false;
              this.$Modal.fcError(message);
            } else if (!this.$refs.AccountLogin.$refs.code.value) {
              this.spinShow = false;
              this.$Modal.fcError({
                title: '错误',
                content: '请输入验证码',
                mask: true,
              });
            } else {
              const param = {
                username: this.$refs.AccountLogin.$refs.username.value,
                password:this.$refs.AccountLogin.$refs.password.value,
                code:this.$refs.AccountLogin.$refs.code.value,
                key:this.$refs.AccountLogin.key,
                flag: this.flag
              };
              this.loginNet('/p/c/code/login', globalServiceId, param)
            }
          }
          if (this.typeToggle === 2) {
            if (!this.$refs.PhoneLogin.$refs.phone.value) {
              this.spinShow = false;
              this.$Modal.fcError({
                title: '错误',
                content: '请输入手机号',
                mask: true,
              });
            } else if (!this.$refs.PhoneLogin.$refs.sendcode.value) {
              this.spinShow = false;
              this.$Modal.fcError({
                title: '错误',
                content: '请输入短信验证码',
                mask: true,
              });
            } else {
              const param = {
                phone: this.$refs.PhoneLogin.$refs.phone.value,
                code: this.$refs.PhoneLogin.$refs.sendcode.value,
                flag: this.flag
              };
              this.loginNet('/p/c/message/login', globalServiceId, param)
            }
          }
        }
      },
      toggle(num) {
        this.typeToggle = num;
      },
      getCaptcha(globalServiceId) {
        return new Promise(resolve => {
          network.post(enableGateWay() ? `/${globalServiceId}/p/c/getCaptcha` : '/p/c/getCaptcha').then(res => resolve(res))
        })
      },

      // 普通模式登录
      async loginNet(url, globalServiceId, param) {
        this.spinShow = true;
        const captcha = await this.getCaptcha(globalServiceId);
        const limit = Object.assign({}, param, {captcha: captcha.data.captcha});

        const r = await this.loginCore(enableGateWay() ? `/${this.globalServiceId}${url}` : url, limit);
        console.log('r', r.data.data)
        console.log('r', JSON.stringify(r.data.data))
        if (this.type) {
          if (r.data.code === 100) {
            const code = await this.checkLogined(r.data);
            // console.log('code', code)
            if (code === 1001) {
              this.flag = 2;
              return this.login()
            }
          }
          if (r.data.code === 0) {
            const exp = r.data.data.isPasswordExpire;
            if (exp) {
              const tips = await this.checkPwdDays();
            }
          }
        }
        this.logined(r)
      },
      checkLogined(data) {
        return new Promise((resolve, reject) => {
          return this.$Modal.fcWarning({
            title: '安全提示',
            content: '当前账号登录中，是否继续登录？',
            mask: true,
            showCancel: true,
            onOk: () => resolve(1001),
            onCancel: () => resolve(1002)
          })
        })
      },
      // 登录中间层对接口返回进行处理-判断当前账号密码修改时间是否大于30天
      checkPwdDays(code) {
        return new Promise(resolve => {
          return this.$Modal.fcWarning({
              title: '安全提示',
              content: '当前密码1个月未修改，为保数据安全请立即修改',
              mask: true,
              onOk: () => resolve()
            })
        })
      },

      loginCore(url, limit) {
        return new Promise(resolve => network.post(url, urlSearchParams(limit)).then(r => resolve(r)).catch(() => this.spinShow = false))
      },

      // 登录成功后的处理
      logined(r) {
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
      }
    }
  };
</script>
