<template>
  <div :class="[classes,name]">
     <div class="v-object-list">
         <slot name="v-object-button"></slot>
         <Button type="primary" size="small" @click="next">下一步</Button>
     </div>
   <slot name="v-object-from"></slot>    
   <div class="step">
       <Steps :current="tabCurrentIndex" 
       >
        <Step v-for="(item,i) in tabPanels" :key="i" 
          :title="item.label" content="测试哈哈哈"></Step> 
    </Steps>
      <div class="verticalTableDetailContent" ref="detailContent">
         <!-- <slot name="v-object-from" ></slot> -->
         <slot name="v-object-TabPanels"></slot>
      </div>
    </div>
    
  </div>
</template>
<script>
  import { mapState } from 'vuex';

 export default {
  name: '',
  props:{

  },
  computed: {
      ...mapState(window.vm.$route.meta.moduleName, {
        tabPanels: ({ tabPanels }) => tabPanels,
      }),
  },
  data(){
     return {
        name:'test',
     }
  },
  methods:{
     next(){
        if(this.tabCurrentIndex+1 < this.tabPanels.length){
            this.tabCurrentIndex  = this.tabCurrentIndex+1;
            this.$parent.$refs.tabPanel.activeKey = this.tabCurrentIndex ;
             this.$parent.tabClick( this.tabCurrentIndex)
        }else{
            this.tabCurrentIndex  = -1;
        }
     }
  },
  mounted(){
     console.log(this,'============');
    
  }

}
</script>
<style lang="less">
.test {
   display: flex;
   .ark-steps-vertical{
      width: 150px;
   }
   .ark-tabs-panels-nav-scroll{
       opacity: 0;
   }
}
.v-object-list{
   display: flex;
}

</style>
