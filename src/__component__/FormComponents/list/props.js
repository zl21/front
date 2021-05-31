export class SetListProps {
    constructor(item) {
      this.item = item;
      this.configuration = {
         // 列表查询条件需要展示的
         webconf:['queryrule','placeholder','ispositive','required']
      }
   }
   filterData(){
      if(this.item.webconf){
       Object.keys(this.item.webconf).forEach((x)=>{
          let check = this.configuration.webconf.includes(x);
          if(!check){
               delete this.item.webconf[x];
          }
       })
      }
    //this.item.webconf

   }
   init(){
      this.filterData()
      return this.item;
   }


}
    