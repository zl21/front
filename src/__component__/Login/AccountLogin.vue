<template>
  <div>
    <span class="titleTOP">{{$t('tips.accountLogin')}}</span>
    <div class="divAccount">
      <img src="../../assets/image/account.png" class="icon">
      <input ref="username" type="text" value="" class="username" :placeholder="$t('messages.enterUserName')">
    </div>
    <div class="divMima">
      <img src="../../assets/image/password.png" class="icon">
      <input ref="password" type="password" value="" class="pwd" :placeholder="$t('messages.enterPassword')">
    </div>
    <div class="divCode" v-if="loginType">
      <img src="../../assets/image/code.png" class="icon">
      <input ref="code" value="" class="pwd code" :placeholder="$t('messages.enterCode')">
    </div>
    <ErCode ref="ercode" :visible="loginType" @refresh="getNewCode" />
    <MoveBar ref="movebar"   v-if="moveBarshow" @on-change="moveChange"/>

    <div class="divToggle" v-if="loginType">
      <span class="sanjiao" >
        <img src="../../assets/image/phone.png" class="toggle phone" @click="toggles">
      </span>
    </div>

  </div>
</template>

<script>
  import network from '../../__utils__/network';
  import ErCode from "./components/ErCode";
  import MoveBar from "../Login/MoveBar.vue";

  export default {
    name: 'AccountLogin',
    components: { ErCode ,MoveBar},
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
        key: '',
        moveBarshow:window.ProjectConfig &&  window.ProjectConfig.moveBar,
        verifyBar:false  // 滑动条
      }
    },
    methods: {
      login() {
        this.$parent.login()
      },
      toggles() {
        this.$emit('toggle', 2)
      },
      getNewCode(obj) {
        const { key } = obj;
        this.key = key
      },
      moveChange(val){
        // 滑动条
        this.verifyBar = val
      }
    }
  }

</script>
