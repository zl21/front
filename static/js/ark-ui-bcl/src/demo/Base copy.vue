<script>
export default {
  name: "Base",
  data() {
    return {
      // render: "Base Render"
    };
  },
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
</script>


