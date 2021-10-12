<template>
  <div v-if="visible">
    <img v-if="!codeLoading" :src="imgSrc" @click="getCode" class="codeimg">
    <div v-else class="codeimg" style="line-height: inherit"><Spin fix></Spin></div>
  </div>
</template>

<script>


import {checkTime} from "../../../__utils__/utils";
import network from "../../../__utils__/network";
import {enableGateWay, enableLoginPro} from '../../../constants/global';

export default {
  name: 'ErCode',
  data() {
    return {
      lastTime: '',
      codeLoading: false,
      globalServiceId: window.localStorage.getItem('serviceId') || '',
      imgSrc: '',
    }
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    if (enableLoginPro) {
      this.getCode();
    }
  },
  methods: {
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
          this.$emit('refresh', {
            imgSrc: res.data.img,
            key: res.data.key
          })
        }
      })
    },

  }
};
</script>
