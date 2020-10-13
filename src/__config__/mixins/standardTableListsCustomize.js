
export default () => ({
  data() {
    return {
      a: 1
    };
  },
  created() {
 
  },
  mounted() {
    console.log(this);
    // this.$refs.agTableElement.bigBackground = null;
    // this.$nextTick(() => {
    //   console.log(213123);
    //   this.$refs.agTableElement.datas.tabth = [];
    //   setTimeout(() => {
    //     const ag = JSON.parse(JSON.stringify(this.$store.state['S.GUIGEZU.24442'].ag));
    //     ag.datas.tabth = [];
    //     console.log(ag);
    //     this.$store.commit('S.GUIGEZU.24442/updateTableData', ag.datas);
    //   }, 2000);
    // });
  },
  methods: {
    optionsClick(row) {
      console.log(row);
    }
  },
  computed: {
   
  },
  activated() {
   
  },
  beforeDestroy() {
   
  },
  destroyed() {
    
  }
});
