<template>
  <div :class="classes">
    <div class="R3-button-group">
      <Button
        v-for="(item) in buttonsData"
        :id="item.eName"
        :key="item.webid"
        :ref="item.ref"
        type="fcdefault"
        @click="btnclick(item)"
        v-text="item.webdesc"
      />
    </div>
  </div>
</template>
<script>

  import { classFix } from '../constants/global';

  export default {
    name: 'ButtonList',
    props: {
      buttonsData: {// 获取自定义按钮组
        type: Array,
        default: () => []
      },
    },
    mounted() {
    },
    computed: {
      classes() {
        return [
          `${classFix}R3-buttonList"`,
        ];
      },
    },
    components: {
    },
    methods: {
      btnclick(obj) {
        this.$emit('btnclick', obj);
      }
    },
    data() {
      return {

      };
    },
  };
</script>
