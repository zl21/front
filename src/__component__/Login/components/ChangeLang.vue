<template>
  <Select
      v-if="showChangeLang"
      v-model="lang"
      @on-change="changeLang"
      class="changeLang"
      :placeholder="lang === 'zh' ? '请选择语言' : 'Please select a language' "
  >
    <Option v-for="item in langs" :value="item.value" :key="item.value">{{ item.key }}</Option>
  </Select>
</template>

<script>

import {enableChangeLang} from "../../../constants/global";

export default {
  name: 'ChangeLang',
  data() {
    return {
      showChangeLang: enableChangeLang || false,
      lang: 'zh'
    }
  },
  props: {
    langs: {
      type: Array,
      default: () => ([
        { key: '中文', value: 'zh' },
        { key: 'English', value: 'en' }
      ])
    }
  },
  created() {
    const localLang = localStorage.getItem('r3-lang');
    if (localLang) {
      this.lang = localLang;
    }
  },
  methods: {
    changeLang(val) {
      if (!val) return false;
      R3I18n && R3I18n(val);
    }

  }
};
</script>
