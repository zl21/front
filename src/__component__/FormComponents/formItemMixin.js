export default {
  mounted () {
    // 处理初始化的联动逻辑以及映射关系
    
    this.$_live_completeRender(this.items.colname).then(res => {
      console.log(res)
      console.log('formItem mounted:处理映射关系')
      // if(!res.items.linkage){
      //   res.items.linkage = {}
      //   res.items.linkage.hidecolumn = {
      //     target: this.items.colname,
      //     refval: this.items.hidecolumn.refval
      //   }
      // }else{
      //   res.items.linkage.hidecolumn = {
      //     target: this.items.colname,
      //     refval: this.items.hidecolumn.refval
      //   }
      // }
    })
  }
}