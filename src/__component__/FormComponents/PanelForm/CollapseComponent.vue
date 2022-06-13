<template>

  <Collapse :value="value" :data-name="name">
    <Panel title-type="center" 
           :isTitleShow="isTitleShow"
           :name="name">
            {{parentdesc}}
            <div slot="content">
                  <slot></slot>
            </div>
    </Panel>
  </Collapse>

</template>
<script>

export default {
  name: 'collapseComponent',
  props: {
    value: {
      type: [Array],
      default: []
    },
    isTitleShow: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      default: ''
    },
    keyName:{
      type: String,
      default: ''
    },
    parentdesc: {
      type: String,
      default: ''
    },
    tableName:{
    // 当前主表表明
      type: String,
      default: ''
    },
    isMainTable:{
      // 是否是主子表
      type: Boolean,
      default: false
    }

  },
  mounted(){
    let TransformPanelFormConfig = window.ProjectConfig && window.ProjectConfig.TransformPanelFormConfig || [];
    // TransformPanelFormConfig 是否移动到子表下面
    if(TransformPanelFormConfig.includes(this.keyName) && /\/V\//.test(this.$route.path) && this.tableName === this.$route.params.tableName ){
        document.querySelector('#verticalTabs_panelForm').appendChild(this.$el);
    }
  }
};
</script>
