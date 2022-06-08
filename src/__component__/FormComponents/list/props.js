export class SetListProps {
    constructor(item) {
      this.item = item;
      this.configuration = {
         // 列表查询条件需要展示的
         webconf:['queryrule','placeholder','ispositive','required','refcolval', 'dateShortcut','inputWithSelectOption']
      }
   }
   filterData(){
      if(window.ProjectConfig.listFormWebconf){
         this.configuration.webconf = this.configuration.webconf.concat(window.ProjectConfig.listFormWebconf);
      }
      if(this.item.webconf){
       Object.keys(this.item.webconf).forEach((x)=>{
          let check = this.configuration.webconf.includes(x);
          if(!check){
               delete this.item.webconf[x];
          }else{
             if(x==='refcolval'){
                this.item.refcolval = this.item.webconf[x]
             }
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
