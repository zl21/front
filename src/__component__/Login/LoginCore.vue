<template>
  <div :class="classes">
    <div ref="container"
         :class="['container', {'loginPro': type && typeToggle === 1}, {'divErCode': type && typeToggle === 2}]">
      <slot name="logo"></slot>
      <keep-alive>
        <!--typeToggle===1-->
        <template v-if="!type || typeToggle === 1">
          <AccountLogin
                  :loginType="type"
                  :TypeToggle="typeToggle"
                  @toggle="toggle"
                  ref="AccountLogin"
          >
          </AccountLogin>
        </template>
        <!--typeToggle!==1-->
        <template v-else>
          <PhoneLogin
                  :phoneExp="phoneExp"
                  :loginType="type"
                  :TypeToggle="typeToggle"
                  @toggle="toggle"
                  ref="PhoneLogin"
          ></PhoneLogin>
        </template>
      </keep-alive>
      <div @click="login">
        <template v-if="$slots.loginBtn">
          <slot name="loginBtn"></slot>
        </template>
        <!-- <div  id="btn" class="btn"/> -->
        <Button v-else="!$slots.loginBtn" type="text" id="btn" class="btn">{{$t('buttons.login')}}</Button>
      </div>
      <Spin v-show="spinShow" fix>
        <div class="loader">
          <svg class="circular" viewBox="25 25 50 50">
            <circle class="path" fill="none" stroke-width="5" stroke-miterlimit="10"/>
          </svg>
        </div>
      </Spin>
    </div>

    <Select v-if="showChangeLang" v-model="lang" @on-change="changeLang" class="changeLang" placeholder="请选择语言">
      <Option value="zh" key="zh">中文</Option>
      <Option value="en" key="en">English</Option>
    </Select>
  </div>
</template>

<script>
  import AccountLogin from './AccountLogin';
  import PhoneLogin from './PhoneLogin';
  import {enableGateWay, Version, encryptedPassword, classFix, enableLoginPro, enableChangeLang} from '../../constants/global';
  import network, {urlSearchParams} from '../../__utils__/network';

  export default {
    name: 'LoginCore',
    components: {AccountLogin, PhoneLogin},
    data() {
      return {
        globalServiceId: window.localStorage.getItem('serviceId') || '',
        type: enableLoginPro,
        spinShow: false, // loading是否显示
        typeToggle: 1, // 1用户 2验证码
        flag: 1,
        lang: 'zh',
        showChangeLang: enableChangeLang || false,
      }

    },
    props: {
      loginSucCbk: {
        type: Function
      },
      phoneExp: {
        type: RegExp,
        default: () => /^\d{11,11}$/
      },

    },
    created() {
      document.onkeydown = (e) => {
        const key = e.keyCode;
        if (key === 13) {
          this.login();
        }
      };
      const localLang = localStorage.getItem('r3-lang');
      if (localLang) {
        this.lang = localLang;
      }
    },
    computed: {
      classes() {
        return [
          `${classFix}loginCore`,
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
              title: this.$t('feedback.error'),
              content: this.$t('messages.enterUserName'),
              mask: true,
            };
            this.spinShow = false;
            this.$Modal.fcError(message);
          } else if (password.value === '') {
            message = {
              title: this.$t('feedback.error'),
              content: this.$t('messages.enterPassword'),
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
                title: this.$t('feedback.error'),
                content: this.$t('messages.enterUserName'),
                mask: true,
              };
              this.spinShow = false;
              this.$Modal.fcError(message);
            } else if (this.$refs.AccountLogin.$refs.password.value === '') {
              message = {
                title: this.$t('feedback.error'),
                content: this.$t('messages.enterPassword'),
                mask: true,
              };
              this.spinShow = false;
              this.$Modal.fcError(message);
            } else if (!this.$refs.AccountLogin.$refs.code.value) {
              this.spinShow = false;
              this.$Modal.fcError({
                title: this.$t('feedback.error'),
                content: this.$t('messages.enterCode'),
                mask: true,
              });
            } else {
              const param = {
                username: this.$refs.AccountLogin.$refs.username.value,
                password: this.$refs.AccountLogin.$refs.password.value,
                code: this.$refs.AccountLogin.$refs.code.value,
                key: this.$refs.AccountLogin.key,
                flag: this.flag
              };
              this.loginNet('/p/c/code/login', globalServiceId, param)
            }
          }
          if (this.typeToggle === 2) {
            if (!this.$refs.PhoneLogin.$refs.phone.value) {
              this.spinShow = false;
              this.$Modal.fcError({
                title: this.$t('feedback.error'),
                content: this.$t('messages.enterPhone'),
                mask: true,
              });
            } else if (!(this.phoneExp.test(this.$refs.PhoneLogin.$refs.phone.value))) {
              this.spinShow = false;
              this.$Modal.fcError({
                title: this.$t('feedback.error'),
                content: this.$t('messages.enterValidPhone'),
                mask: true,
              })
            }else if (!this.$refs.PhoneLogin.$refs.sendcode.value) {
              this.spinShow = false;
              this.$Modal.fcError({
                title: this.$t('feedback.error'),
                content: this.$t('messages.enterSMS'),
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
        if (this.type) {
          if (r.code === 100) {
            const codes = await this.checkLogined();
            if (codes === 1001) {
              this.flag = 2;
              return this.login()
            }
          }
          if (r.code === -1) {
            if (this.typeToggle === 1) {
              this.$refs['AccountLogin'].getCode();
              this.flag = 1;
            }
            return this.$Modal.fcWarning({
              title: this.$t('feedback.safeWarning'),
              content: r.message,
              mask: true,
            })
          }
          if (r.data && r.data.code === -1) {
            this.flag = 1;
          }
          if (r.data && r.data.code === 0) {
            this.flag = 1;
            const exp = r.data.data.isPasswordExpire;
            if (exp) {
              await this.checkPwdDays()
            }
          }
        }
        this.logined(r)
      },
      checkLogined() {
        return new Promise((resolve, reject) => {
          return this.$Modal.fcWarning({
            title: this.$t('feedback.safeWarning'),
            content: this.$t('messages.continueLogin'),
            mask: true,
            showCancel: true,
            onOk: () => resolve(1001),
            onCancel: () => {
              this.flag = 1;
              resolve(1002)
            }
          })
        })
      },
      // 登录中间层对接口返回进行处理-判断当前账号密码修改时间是否大于30天
      checkPwdDays(code) {
        return new Promise(resolve => {
          return this.$Modal.fcWarning({
            title: this.$t('feedback.safeWarning'),
            content: this.$t('messages.changePasswordTip'),
            mask: true,
            onOk: () => resolve()
          })
        })
      },

      loginCore(url, limit) {
        return new Promise((resolve, reject) => network.post(url, urlSearchParams(limit)).then(r => resolve(r)).catch((err, er) => {
          this.spinShow = false
          console.log('err', err.response)
          const res = err.response;
          const {message} = res.data;
          resolve(JSON.parse(message));
        }))
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
            this.goto()
          } else {
            this.spinShow = false;
          }
        } else if (r.status === 200 && r.data.code === 0) {
          this.spinShow = false;
          window.sessionStorage.setItem('loginTime', `${Date.now()}`);
          this.goto()
        } else {
          this.spinShow = false;
        }
      },
      // 跳转前的回掉处理
      async goto() {
        this.showChangeLang && await R3I18n(this.lang,{enableApi: true});
        if (!this.loginSucCbk) return window.location.href = window.location.origin;
        if (typeof this.loginSucCbk !== 'function') throw new Error('loginSucCbk must be a function');
        const res = await this.loginSucCbk();
        if (!res) return;
        window.location.href = window.location.origin;
      },

      changeLang(val) {
        if (!val) return false;
        R3I18n && R3I18n(val);
      }
    }
  };
</script>
