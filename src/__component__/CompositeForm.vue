<!--suppress ALL:form-item-lists="FormLists(item.childs)" -->
<template>
    <div>
        <template  v-if="type === 'PanelForm'">
            <Collapse
                    v-for="(item,index) in computdefaultData" active-key="index"
                    v-model="item.hrdisplay"
                    @on-change="CollapseClose(index,item.hrdisplay)"
                >
                <Panel :key="index" title-type="center"  :name="item.hrdisplay" >
                    {{item.parentdesc}}
                    <div slot="content">
                        <FormItemComponent
                          :form-item-lists = "item.childs"
                          :defaultColumn="computdefaultData.objviewcol"
                        >
                        </FormItemComponent>
                    </div>
                </Panel>
            </Collapse>
        </template>
        <template  v-if="type === ''">
            <FormItemComponent  >
                :form-item-lists="FormLists(computdefaultData.inpubobj)"
            </FormItemComponent>
        </template>
    </div>
</template>

<script>
  import FormItemComponent from './FormItemComponent';
  import ItemComponent from './ItemComponent';

  export default {
    name: "CompositeForm",
    components: {
      FormItemComponent
    },
    props: {
      defaultData: {
        type: Object,
        default() {
          return {};
        }
      },
      type: {
        // 判断是否需要 面板 =PanelForm
        type: String,
        default() {
          return '';
        }
      }
    },
    data() {
      return {
        newdefaultData:{},
        expand:'expand'
      };
    },
    computed: {
      computdefaultData(){
        let items = [];
        if(this.type && Object.prototype.hasOwnProperty.call(this.defaultData,'addcolums')){
          items = this.defaultData.addcolums.reduce((array, current, itemIndex) =>{
            let tem = [];
            if(Object.prototype.hasOwnProperty.call(current,'childs') ){
              tem = current.childs.reduce((array2, current2, itemIndex2) =>{
                  let option = this.reduceForm(array2, current2, itemIndex2);
                  array2.push(option);
                  return array2;
                },[]);
              }
            array.push({
              childs:tem,
              hrdisplay:current.hrdisplay,
              parentdesc:current.parentdesc,
              parentname:current.parentname
            });
            return array;
          },[]);
          this.newdefaultData = items;
          this.newdefaultData.objviewcol = this.defaultData.objviewcol;
        }
        return this.newdefaultData;
      }
    },
    methods:{
      CollapseClose(index,hrdisplay){
        this.newdefaultData[index].hrdisplay = '';
      },
      reduceForm(array, current, itemInde){
        let obj = {} ;
        obj.row = current.row ? current.row : 1;
        obj.col = current.col ? current.col : 1;
        obj.component = ItemComponent;
        obj.item = {
          type: this.checkDisplay(current),
          title: current.name,
          field: current.colname,
          value: this.defaultValue(current),
          inputname: current.inputname,
          props: {...current},
          event: {},
          validate: {
          }
        };
        // 属性赋值
        this.propsType(current,obj.item);

        return obj;
      },
      checkDisplay(item) {
        let str = '';
        if (!item.display || item.display === 'text' || item.display === 'textarea') {
          str = 'input';
        }
        if (item.display === 'OBJ_SELECT') {
          str = 'select';
        }
        //check
        if (item.display === 'check') {
          str = 'checkbox';
        }
        if (item.display === 'text') {
          switch (item.fkdisplay) {
            case 'drp':
              str = 'DropDownSelectFilter';
              break;
            case 'mrp':
              str = 'DropDownSelectFilter';
              break;
            case 'pop':
              str = 'AttachFilter';
              break;
            case 'mop':
              str = 'AttachFilter';
              break;
            default: break;
          }
        }

        if (item.display === 'OBJ_DATENUMBER' || item.display === 'OBJ_DATE') {
          str = 'DatePicker';
        }

        if (item.display === 'OBJ_TIME') {
          str = 'TimePicker';
        }

        return str;
      },
      defaultValue(item) { // 设置表单的默认值
        if(item.valuedata === 'N'){
          return false;
        }else if(item.valuedata === 'Y'){
          return true;
        }else {
          return item.valuedata;
        }
      },
      propsType(current,item){
        // input
        if (!item.display || item.display === 'text') {
              item.props.type = 'text';
              if( item.display === 'textarea' ){
                item.props.type = 'textarea';
              }
              if( current.isnotnull === true){
                item.required = true;
              }

        }
        // 外键的单选多选判断

        if (current.combobox) {
          const arr = current.combobox.reduce((sum, item) => {
            sum.push({
              label: item.limitdesc,
              value: item.limitval
            });
            return sum;
          }, []);
          item.options = arr;
          return item;
        }
        // 多状态合并的select
        if (current.conds && current.conds.length > 0) {
          let sumArray = [];
          current.conds.map((item) => {
            sumArray = sumArray.concat(item.combobox.reduce((sum, temp) => {
              sum.push({
                label: temp.limitdesc,
                value: `${item.colname}|${temp.limitval}`
              });
              return sum;
            }, []));
            return item;
          });
          obj.item.options = sumArray;
          return item;
        }

        //check
        if (current.display === 'check') {
          item.props.type = 'checkbox';
        }
        // textarea
        if (current.display === 'textarea') {
          item.props.type = 'textarea';
        }
        // 日期控件属性控制
        if (current.display === 'OBJ_DATENUMBER') {
          item.props.type = 'date';
        }
        if (current.display === 'OBJ_DATE') {
            item.props.type = 'date';
        }
        if (current.display === 'OBJ_TIME') {
            item.props.type = 'date';
        }

        // 属性isuppercase控制
        if (current.isuppercase) {

        }
        if (current.display === 'OBJ_FK') {
          switch (current.fkobj.searchmodel) {
            case 'drp':
              item.props.single = true;
              item.props.defaultSelected = this.defaultValue(current);
              break;
            case 'mrp':
              item.props.single = false;
              item.props.defaultSelected = this.defaultValue(current);
              break;
            case 'pop':
              item.props.fkobj = current.fkobj;
              item.props.Selected = [];
              break;
            case 'mop':
              item.props.fkobj = current.fkobj;
              item.props.datalist = [];
              item.props.Selected = [];
              break;
            default: break;
          }
        }
        return item;
      }
  },
    mounted() {

    },
    created() {

    },
  }
</script>

<style scoped>

</style>
