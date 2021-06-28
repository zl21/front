<template>
  <iframe
    id="printframe"
    name="printframe"
    width="1000px"
    height="600px"
    :src="src"
  />
</template>
<script>
  import { mapState } from 'vuex';
  import router from '../../__config__/router.config';
  import { MODULE_COMPONENT_NAME } from '../../constants/global';
  import network from '../../__utils__/network';

  export default {
    name: 'PrintPreview',
    inject: [MODULE_COMPONENT_NAME],

    data() {
      return {
        src: ''
      };
    },
    props: {
      objList: {
        type: Array,
        default: () => []
      },
      idArray: {
        type: [Array, Object],
        default: () => ({})
      },
      itemId: {// 获取当前子表表明细ID
        type: String,
        default: () => ''
      },
      // clickPrint: {// 用于调取打印方法
      //   type: Boolean,
      //   default: () => false
      // },

    },
    watch: {

    },
    computed: {
      ...mapState('global', {
        userInfo: ({ userInfo }) => userInfo,
      }),

    },
    methods: {

    },
    mounted() {
      this.src = '';
      const userId = this.userInfo.id;// 用户ID
      const { tableName } = router.currentRoute.params;// 明细ID
      let printIds = [] || '';
      if (this[MODULE_COMPONENT_NAME][0] === 'S') {
        printIds = this.idArray;
      } else {
        const { itemId } = this.$route.params;
        printIds = itemId;
        // printIds = this.itemId;
      }
      this.src = `/api/rpt/preview?tableName=${tableName}&objIds=${printIds}&userId=${userId}`;

      // const dom = document.getElementById('printframe');
      // if (dom.attachEvent) {
      //   dom.attachEvent('onload', () => { // IE
      //     this.$R3loading.hide();
      //   });
      // } else {
      //   dom.onload = () => { // 非IE
      //     this.$R3loading.hide();
      //   };
      // }

      // network.get(`/api/rpt/preview?tableName=${tableName}&objIds=${printIds}&userId=${userId}`).then((res) => {
      //   if (res.status === 200 && res.statusText === 'OK') {
      //     this.src = `/api/rpt/preview?tableName=${tableName}&objIds=${printIds}&userId=${userId}`;
      //   }
      // }).catch(() => {
      //   this.$emit('closeActionDialog', false); // 关闭弹框
      // });
    },
    destroyed() {
      this.$emit('clearSelectIdArray');
    }

  };
</script>
