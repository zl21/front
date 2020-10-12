export default {
  data() {
    return {
      test: 123
    };
  },
  mounted() {
    console.log(this);
    this.test = 123123;
  },
  created() {
    console.log(1231312);
  }
};
