<template>
  <div style="height: 100%">
    <iframe
      v-if="urlName"
      id="iframe"
      :src="urlName"
      :class="urlNameCls"
    />
  </div>
</template>

<script>
  import { classFix } from '../constants/global';

  export default {
    // name: 'LinkPage',
    data() {
      return {

      };
    },
    props: {
      urlName: {
        type: String,
        default: ''
      },
    },
    computed: {
      urlNameCls: () => `${classFix}urlName`,
    },
    activated() {
      // const { linkModuleId } = this.$route.params;
      // this.$store.dispatch('global/updateAccessHistory', { type: 'action', id: linkModuleId });
    }
  };
</script>
