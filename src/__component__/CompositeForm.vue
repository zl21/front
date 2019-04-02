<!--suppress ALL:form-item-lists="FormLists(item.childs)" -->
<template>
    <div>
        <template  v-if="type === 'PanelForm'">
            <Collapse
                    v-for="(item,index) in computdefaultData.addcolums" active-key="index"
                    v-model="expand"
                >
                <Panel :key="index" title-type="center"  :name="item.hrdisplay" >
                    {{item.parentdesc}}
                    <div slot="content">
                        <FormItemComponent
                          :form-item-lists="FormLists(item.childs)"
                          :defaultColumn="computdefaultData.objviewcol"
                        >
                        </FormItemComponent>
                    </div>
                </Panel>
            </Collapse>
        </template>
        <template  v-if="type === ''">
            <FormItemComponent  >
                :form-item-lists="FormLists(computdefaultData)"
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
        newdefaultData:[],
        expand:'expand'
      };
    },
    computed: {
      computdefaultData(){
          console.log(this.defaultData);
          return this.defaultData;
      },
      FormLists(){
        return function (arr) {
          let items = [];
          items = JSON.parse(JSON.stringify(arr)).reduce((array, current, itemIndex) => {
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
                    props: {},
                    event: {},
                    validate: {
                    }
                  };

            // 带有combobox的添加到options属性中
            //obj.item.props.type = this.checkDisplay(current);

            if (current.combobox) {
              const arr = current.combobox.reduce((sum, item) => {
                sum.push({
                  label: item.limitdesc,
                  value: item.limitval
                });
                return sum;
              }, []);
              obj.item.options = arr;
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
            }

            //check
            if (current.display === 'check') {
              obj.item.props.type = 'checkbox';
            }
            // textarea
            if (current.display === 'textarea') {
              obj.item.props.type = 'textarea';
            }
            // 日期控件属性控制
            if (current.display === 'OBJ_DATENUMBER') {
              obj.item.props.type = 'date';
            }
            if (current.display === 'OBJ_DATE') {
              obj.item.props.type = 'date';
            }
            if (current.display === 'OBJ_TIME') {
              obj.item.props.type = 'date';
            }

            // 属性isuppercase控制
            if (current.isuppercase) {

            }
            if (current.display === 'OBJ_FK') {
              switch (current.fkobj.searchmodel) {
                case 'drp':
                  obj.item.props.single = true;
                  obj.item.props.defaultSelected = this.defaultValue(current);
                  break;
                case 'mrp':
                  obj.item.props.single = false;
                  obj.item.props.defaultSelected = this.defaultValue(current);
                  break;
                case 'pop':
                  obj.item.props.fkobj = current.fkobj;
                  obj.item.props.Selected = [];
                  break;
                case 'mop':
                  obj.item.props.fkobj = current.fkobj;
                  obj.item.props.datalist = [];
                  obj.item.props.Selected = [];
                  break;
                default: break;
              }
            }
                  array.push(obj);
                  return array;
          },[]);
          return items
        }
      }
    },
    methods:{
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
        if (item.display === 'OBJ_FK') {
          switch (item.fkobj.searchmodel) {
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
        if(item.valuedat === 'N'){
          return false;
        }else if(item.valuedat === 'Y'){
          return true;
        }else {
          return item.valuedata;
        }
      },
      propsType(){
        // 外键的单选多选判断



      }
    },
    mounted() {

    },
    created() {
          //console.log(this.computdefaultData,this.type);
    },
  }
</script>

<style scoped>

</style>
