<template>
  <div>
    <span class="titleTOP">{{$t('tips.phoneLogin')}}</span>
    <div class="divAccount">
      <img src="../../assets/image/account.png" class="icon">
      <input ref="phone" type="text" value="" class="username" :placeholder="$t('messages.enterPhone')">
    </div>
    <div class="divCode">
      <img src="../../assets/image/password.png" class="icon">
      <input ref="sendcode" value="" class="pwd code" :placeholder="$t('messages.enterSMS')">
      <Button
              class="erCodeBtn"
              :disabled="sended"
              @click="sendErCode"
      >{{ btnTips === 1 ? $t('tips.getVerificationCode') : `${this.$t('messages.reacquire')}${this.count}s`}}</Button>
    </div>
    <div class="divToggle" v-if="loginType">
      <span class="sanjiao">
        <img src="../../assets/image/home.png" class="toggle home" @click="toggles">
      </span>
    </div>
  </div>
</template>

<script>
  import network from '../../__utils__/network';
  import {enableGateWay} from '../../constants/global';
  export default {
    name: 'PhoneLogin',
    props: {
      loginType: {
        type: Boolean,
        default: false
      },
      TypeToggle: {
        type: Number,
        default: 1
      },
      phoneExp: {
        type: RegExp
      },
    },
    data() {
      return {
        btnTips: 1,
        sended: false,
        timer: null,
        count: 0,
      }
    },
    methods: {
      login() {
        this.$parent.login()
      },
      toggles() {
        this.$emit('toggle', 1)
      },
      async sendErCode() {
        const phoneNo = this.$refs.phone.value;
        if (!(this.phoneExp.test(phoneNo))) return this.$Modal.fcError({
          title: this.$t('feedback.error'),
          content: this.$t('messages.enterValidPhone')
        });
        const code = await this.getMessageCode(phoneNo);
        if (!code.data || code.data.code !== 0) return false;
        this.sended = true;
        this.count = 59;
        this.setTimer();
        this.$Message.success(this.$t('messages.getCodeSuccess'));
      },
      setTimer() {
        this.timer = setTimeout(() => {
          this.count--;
          if (this.count === 0) {
            this.timer && clearTimeout(this.timer);
            this.timer = null;
            this.btnTips = 1;
            this.sended = false;
          } else {
            this.btnTips = 2;
            this.setTimer();
          }
        }, 1000);
      },

      // 手机登录验证码获取
      getMessageCode(phoneNo) {
        const globalServiceId = this.$parent.globalServiceId;
        return new Promise(resolve => {
          network.post(enableGateWay() ? `/${globalServiceId}/p/c/getMessageCode` : '/p/c/getMessageCode', { phone: phoneNo }).then(r => resolve(r))
        })
      },
    }
  }

</script>
