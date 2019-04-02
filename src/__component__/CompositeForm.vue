<!--suppress ALL -->
<template>
    <div>
        <template  v-if="type === 'PanelForm'">
            <Collapse
                    v-for="(item,index) in computdefaultData" active-key="index" :key="index"
                >
                <Panel key="index" title-type="center" >
                    {{item.parentdesc}}
                    <div slot="content">
                        <FormItemComponent
                                :form-item-lists="FormLists(item.childs)"
                        >
                        </FormItemComponent>
                    </div>
                </Panel>
            </Collapse>
        </template>
        <template  v-if="type === ''">
            <FormItemComponent>

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
        type: Array,
        default() {
          return [];
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
        newdefaultData:[]
      };
    },
    computed: {
      computdefaultData(){
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
                    title: current.coldesc,
                    field: current.colname,
                    value: this.defaultValue(current),
                    inputname: current.inputname,
                    props: {},
                    event: {},
                    validate: {
                    }
                  };
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
        if (!item.display || item.display === 'text') {
          str = 'input';
        }
        if (item.display === 'OBJ_SELECT') {
          str = 'select';
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
        return item.valuedata;
      },
      propsType(){


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
