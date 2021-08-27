<template>
  <div>
    <span class="titleTOP">账号登录</span>
    <div class="divAccount">
      <img src="../../assets/image/account.png" class="icon">
      <input ref="username" type="text" value="" class="username" placeholder="请输入用户名">
    </div>
    <div class="divMima">
      <img src="../../assets/image/password.png" class="icon">
      <input ref="password" type="password" value="" class="pwd" placeholder="请输入密码">
    </div>
    <div class="divCode" v-if="loginType">
      <img src="../../assets/image/code.png" class="icon">
      <input ref="code" value="" class="pwd code" placeholder="请输入验证码">
    </div>
    <img v-if="loginType && !codeLoading" :src="imgSrc" @click="getCode" class="codeimg">
    <div v-if="loginType && codeLoading" class="codeimg" style="line-height: inherit"><Spin fix></Spin></div>
    <div class="divToggle" v-if="loginType">
      <span class="sanjiao" >
        <img src="../../assets/image/phone.png" class="toggle phone" @click="toggles">
      </span>
    </div>

  </div>
</template>

<script>
  import network from '../../__utils__/network';
  import { checkTime } from "../../__utils__/utils";
  import {enableGateWay, enableLoginPro} from '../../constants/global';
  export default {
    name: 'AccountLogin',
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
        codeSrc: '',
        globalServiceId: window.localStorage.getItem('serviceId') || '',
        imgSrc: '',
        key: '',
        codeLoading: false,
        lastTime: '',
      }
    },
    mounted() {
      if (enableLoginPro) {
        this.getCode();
      }
    },
    methods: {
      login() {
        this.$parent.login()
      },
      toggles() {
        this.$emit('toggle', 2)
      },
      // 获取验证码
      getCode() {
        if (this.lastTime && checkTime(this.lastTime)) {
          this.codeLoading = false;
          return false
        }
        this.lastTime = new Date().getTime();
        this.codeLoading = true;
        network.post(enableGateWay() ? `/${this.globalServiceId}/p/c/getcCode` : '/p/c/getcCode').then(res => {
          if (res && res.data) {
            this.codeLoading = false;
            this.imgSrc = res.data.img;
            this.key = res.data.key;
          }
        })
      },
    }
  }

</script>
