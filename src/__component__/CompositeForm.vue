<template>
    <div>
        <Collapse  v-if="type === 'PanelForm'"  v-for="(item,index) in computdefaultData" active-key="index" :key="index">
            <Panel key="index" title-type="center" >
                {{item.parentdesc}}
                <div slot="content">
                   <FormItemComponent>

                   </FormItemComponent>
                </div>
            </Panel>
        </Collapse>
        <template  v-if="type === ''">
            <FormItemComponent>

            </FormItemComponent>
        </template>
    </div>
</template>

<script>
  import FormItemComponent from './FormItemComponent';

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
      }
    },
    mounted() {
    },
    created() {
          console.log(this.computdefaultData,this.type);
    },
  }
</script>

<style scoped>

</style>
