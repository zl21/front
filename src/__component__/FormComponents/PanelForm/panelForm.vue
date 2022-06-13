<template>
  <div :class="classes" :id="id">
    <div v-for="(item,index) in Object.keys(formItemLists)"
         :key="index">
      <component :is="CollapseComponent"  :id="`Collapse_${item}`"  
        :value="collapseValue"
        :tableName="tableName"
        :isMainTable="isMainTable"
        :isTitleShow="formItemLists[item].parentdesc?true:false"
        :parentdesc="formItemLists[item].parentdesc"
        :keyName="`${formItemLists[item].parentdesc}`"
        :name="formItemLists[item].parentname"
      >   
      <!-- <Collapse :value="collapseValue">
        <Panel title-type="center"
               > -->
          <!-- {{ formItemLists[item].parentdesc }} -->
          <div
               :style="setWidth"
               class="content R3masterForm">
            <div v-for="(temp,index) in Object.keys(formItemLists[item].childs)"
                 :key="formItemLists[item].childs[temp]._index"
                 :index="index"
                 :style="formItemLists[item].childs[temp].styles">
              <keep-alive>
                <component ref="formItem"
                           @on-keydown="enterForm"
                           :id="formItemLists[item].childs[temp].colname"
                           :is="formItemLists[item].childs[temp].component"
                           :items="formItemLists[item].childs[temp]"
                           :label-width="120" />
              </keep-alive>
            </div>
          </div>
          </component>
        <!-- </Panel>

      </Collapse> -->
    </div>
  </div>
</template>
<script>
import panelFormVue from './panelFormVue.js'
export default panelFormVue;
</script>
