<template>
  <div :class="[classes,name]">
      <slot name="v-object-button"></slot>
      
  
   <div class="step">
         <Button type="primary" @click="next">下一步</Button>
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
        // this.$refs.tabPanel.activeKey = this.tabCurrentIndex;

     }
  },
  mounted(){
     console.log(this.tabClick,'============');
    
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
   .step{

   }
}

</style>
