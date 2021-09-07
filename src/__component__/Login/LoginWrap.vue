<template>
  <div :class="classes">
    <LoginCore>
      <template slot="logo">
        <img :src="logo" alt="logo" class="logo">
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
      }
    },
  };
</script>
