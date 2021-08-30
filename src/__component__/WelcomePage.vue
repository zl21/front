<template>
  <div :class="classes" />
</template>

<script>
  import { classFix } from '../constants/global';

  export default {
    name: 'WelcomePage',
    computed: {
      classes() {
        return this.$i18n.locale === 'zh' ? `${classFix}welcomepage`: `${classFix}welcomepage welcomepage-en-bg`
      }
    }
  };
</script>
