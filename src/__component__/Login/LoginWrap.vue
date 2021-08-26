<template>
  <div :class="classes">
    <LoginCore>
      <template slot="logo">
        <img v-if="$i18n.locale === 'zh'" src="../../assets/image/logo.1.png" alt="logo" class="logo">
        <img v-if="$i18n.locale === 'en'" src="../../assets/image/logo1en.png" alt="logo" class="logo">
      </template>
    </LoginCore>
  </div>
</template>

<script>
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
    },
  };
</script>
