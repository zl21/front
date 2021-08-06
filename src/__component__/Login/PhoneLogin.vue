<template>
  <div>
    <span class="titleTOP">手机登录</span>
    <div class="divAccount">
      <img src="../../assets/image/account.png" class="icon">
      <input ref="phone" type="text" value="" class="username" placeholder="请输入手机号">
    </div>
    <div class="divCode">
      <img src="../../assets/image/password.png" class="icon">
      <input ref="sendcode" value="" class="pwd code" placeholder="请输入短信验证码">
      <Button
              class="erCodeBtn"
              :disabled="sended"
              @click="sendErCode"
      >{{btnTips}}</Button>
    </div>
    <div class="divToggle" v-if="loginType">
      <span class="sanjiao" >
        <img src="../../assets/image/home.png" class="toggle home" @click="toggles">
      </span>
    </div>
  </div>
</template>

<script>
  import network, {urlSearchParams} from '../../__utils__/network';
  import {enableGateWay, Version, encryptedPassword, classFix} from '../../constants/global';
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
    },
    data() {
      return {
        btnTips: '获取验证码',
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
        if (!(/^1[3456789]\d{9}$/.test(phoneNo))) return this.$Modal.fcError({
          title: '错误',
          content: '请输入正确的手机号'
        });
        const code = await this.getMessageCode(phoneNo);
        if (!code.data || code.data.code !== 0) return false;
        this.sended = true;
        this.count = 59;
        this.setTimer();
        this.$Message.success('获取验证码成功');
      },
      setTimer() {
        this.timer = setTimeout(() => {
          this.count--;
          if (this.count === 0) {
            this.timer && clearTimeout(this.timer);
            this.timer = null;
            this.btnTips = '获取验证码';
            this.sended = false;
          } else {
            this.btnTips = `重新获取${this.count}s`;
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
