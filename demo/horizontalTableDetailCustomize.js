


  export default {
    watch:{
      ag: {
        handler() {
          if(this.ag.datas && this.ag.datas.tabth){
            this.ag.datas.tabth = this.ag.datas.tabth.splice(0,5)
          }

        },
        deep:true
      }

    },
    mounted () {
      this.tabBeforeLeave = function(){
        // alert('121212')
        // return false;
      }
      
    }
}