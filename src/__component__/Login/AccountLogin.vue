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
    <img v-if="loginType" :src="imgSrc" @click="getCode" class="codeimg">
    <div class="divToggle" v-if="loginType">
      <span class="sanjiao" >
        <img src="../../assets/image/phone.png" class="toggle phone" @click="toggles">
      </span>
    </div>

    <div id="btn" class="btn" @click="login"/>
  </div>
</template>

<script>
  import network, {urlSearchParams} from '../../__utils__/network';
  import {enableGateWay, Version, encryptedPassword, classFix} from '../../constants/global';
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
        host: window.ProjectConfig.target,
        imgSrc: '',
        key: ''
      }
    },
    mounted() {
      if (window.ProjectConfig.enableLoginPro) {
        this.getCode();
      }
    },
    methods: {
      login() {
        this.$parent.login()
      },
      toggles() {
        console.log(this.TypeToggle)
        this.$emit('toggle', 2)
      },
      // 获取验证码
      getCode() {
        network.post(enableGateWay() ? `/${this.globalServiceId}/p/c/getcCode` : '/p/c/getcCode').then(res => {
          if (res && res.data) {
            this.imgSrc = res.data.img;
            this.key = res.data.key;
          }
        })
      },
    }
  }

</script>
