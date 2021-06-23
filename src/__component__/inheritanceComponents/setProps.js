
/**
   *处理Placeholder
   */
export class SetPlaceholder {
    constructor(item){
        this.item = item;
    }
    init(){
        const placeholder = this.item.webconf && this.item.webconf.placeholder ? this.item.webconf.placeholder : null;
        return  placeholder || `请输入${this.item.coldesc}`;
    }

}
export class SetDisable {
    constructor(item){
        this.item = item;
    }
    init(){
        return  this.item.readonly  &&  (this.item.webconf ? !this.item.webconf.ignoreDisableWhenEdit : true);
    }

}