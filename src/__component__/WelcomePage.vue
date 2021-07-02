<template>
  <div :class="classes" />
</template>

<script>
  import { classFix } from '../constants/global';

  export default {
    name: 'WelcomePage',
    computed: {
      classes: () => `${classFix}welcomepage`
    }
  };
</script>
