export default {
  name: "Base",
  data() {
    return {
      // render: "Base Render"
    };
  },
  template:'<div>2121212</div>',
  computed: {
    render() {
      return this.aa
    }
  },
  beforeCreate() {
   
  },
  created() {
    
  },
  beforeMount() {
   
  },
  mounted() {
    console.log("==============Base mounted==================");
    console.log(this.render);
  },
 
};


