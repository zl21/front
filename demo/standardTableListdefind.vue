/* eslint-disable vue/html-indent */
/* eslint-disable vue/html-self-closing */
<template>
  <div
    class="hh"
    style="height:100px"
  >
    <!-- <div>测试新增语言---{{$t('newlang.test')}}</div> -->
    <div>哈哈哈，这个是测试啦啦啦</div>
    <button @click="toggleSetting">显示设置</button>
    <button @click="toggleMessages">显示消息</button>
    <!-- <div>测试已有语言扩展----{{$t('extend.test')}}</div> -->

    <Setting v-model="showSetting"></Setting>

    <MessageList v-model="showMessages"></MessageList>

    <RadioGroup
      v-model="radioValue"
      :options="radioOptions"
    ></RadioGroup>

    <CheckboxGroup
      v-model="selectValue"
      :options="selectOptions"
    ></CheckboxGroup>
  </div>
</template>
<script>
import R3 from '../r3.publish/r3.min';

export default {
  inheritAttrs: false,

  components: {
    Setting: R3.components.Setting,
    RadioGroup: R3.components.RadioGroup,
    CheckboxGroup: R3.components.CheckboxGroup,
    MessageList: R3.components.MessageList
  },

  data() {
    return {
      radioValue: '2',
      radioOptions: {
        combobox: [
          {
            limitdesc: 1,
            limitval: '1'
          },
          {
            limitdesc: 2,
            limitval: '2'
          },
          {
            limitdesc: 3,
            limitval: '3'
          }
        ],
      },
      selectValue: '1,2',
      selectOptions: {
        combobox: [
          {
            limitdesc: '1',
            limitval: '1'
          },
          {
            limitdesc: '2',
            limitval: '2'
          },
          {
            limitdesc: '3',
            limitval: '3'
          }
        ],
      },
      showSetting: false,
      showMessages: false
    }
  },

  methods: {
    toggleSetting() {
      this.showSetting =!this.showSetting
    },

    toggleMessages() {
      this.showMessages = !this.showMessages
    }
  }
}
</script>
