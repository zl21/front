<template>
  <div :class="classes">
    <LoginCore>
      <template slot="logo">
        <img src="../../assets/image/logo.1.png" alt="logo" class="logo">
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
