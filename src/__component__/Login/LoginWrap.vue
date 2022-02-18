<template>
  <div :class="classes">
    <LoginCore>
      <template slot="logo">
        <img :src="logo" alt="logo" class="logo" v-if="logo">
        <div v-else :class="logoBg"></div>
      </template>
    </LoginCore>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import LoginCore from './LoginCore';
  import {classFix} from '../../constants/global';

  export default {
    name: 'Login',
    components: {LoginCore},
    computed: {
      classes() {
        return [
          `${classFix}login`,
        ];
      },
      ...mapGetters('global', ['imgAssets']),
      logo() {
        return this.imgAssets.login
      },

      logoBg() {
        return this.$i18n.locale === 'zh' ? 'r3-login-zh': 'r3-login-en'
      },
    },
  };
</script>
