/* eslint-disable vue/html-indent */
/* eslint-disable vue/html-self-closing */
<template>
  <div
    class="hh"
    style="height:500px"
  >
    <!-- <div>测试新增语言---{{$t('newlang.test')}}</div> -->
    <div>哈哈哈，这个是测试啦啦啦</div>
    <!-- <div>测试已有语言扩展----{{$t('extend.test')}}</div> -->

    <pannel @changePwdBox="changePwdBox"></pannel>

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
    pannel: R3.components.setPanel,
    RadioGroup: R3.components.RadioGroup,
    CheckboxGroup: R3.components.CheckboxGroup
  },

  watch: {
    radioValue() {
      console.log(this.radioValue);
    }
  },

  data() {
    return {
      radioValue: 2,
      radioOptions: {
        combobox: [
          {
            limitdesc: 1,
            limitval: 1
          },
          {
            limitdesc: 2,
            limitval: 2
          },
          {
            limitdesc: 3,
            limitval: 3
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
    }
  },

  methods: {
    changePwdBox() {
      console.log(this);
      alert(12)
    }
  }
}
</script>
