<template>
  <div class="panelForm compositeAllform">
    <div v-for="(item,index) in Object.keys(formItemLists)"
         :key="index">
      <Collapse :value="collapseValue">
        <Panel title-type="center"
               :isTitleShow="formItemLists[item].parentdesc?true:false"
               :name="formItemLists[item].parentname">
          {{ formItemLists[item].parentdesc }}
          <div slot="content"
               :style="setWidth"
               class="content R3masterForm">
            <div v-for="(temp,index) in Object.keys(formItemLists[item].childs)"
                 :key="formItemLists[item].childs[temp]._index"
                 :index="index"
                 :style="formItemLists[item].childs[temp].styles">
              <keep-alive>
                <component ref="formItem"
                           :id="formItemLists[item].childs[temp].colname"
                           :is="formItemLists[item].childs[temp].component"
                           :items="formItemLists[item].childs[temp]"
                           :label-width="120" />
              </keep-alive>
            </div>
          </div>
        </Panel>

      </Collapse>
    </div>
  </div>
</template>
<script>
import panelFormVue from './panelFormVue.js'
export default panelFormVue;
</script>

<style lang="less" >
.panelForm {
  .content {
    display: grid;
  }
}
</style>