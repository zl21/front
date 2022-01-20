<template>
  <div :class="[classes,name]">
      <slot name="v-object-button"></slot>
      
  
   <div class="step">
       <Steps :current="2" direction="vertical" 
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
        name:'test'
     }
  },
  mounted(){
     console.log(this.tabPanels);
    
  }

}
</script>
<style lang="less">
.test {
   display: flex;
   .ark-steps-vertical{
      width: 100px;
   }
   .ark-tabs-panels-nav-scroll{
      display: none;
      opacity: 0;
   }
   .step{
    display: flex;
    flex-direction: row-reverse;

   }
}

</style>
