<template>
  <div v-if="imgAssets.welcome" :style="bg" class="r3-welcome"></div>
  <div :class="classes" v-else/>
</template>

<script>
  import { mapGetters } from 'vuex';
  import { classFix } from '../constants/global';

  export default {
    name: 'WelcomePage',
    computed: {
      classes() {
        return this.$i18n.locale === 'zh' ? `${classFix}welcomepage`: `${classFix}welcomepage welcomepage-en-bg`
      },
      ...mapGetters('global', ['imgAssets']),
      bg() {
        return this.imgAssets.welcome ? `width: 100%;height: 100%;background: url(${this.imgAssets.welcome}) center / 90% no-repeat;` : ''
      }
    }
  };
</script>
