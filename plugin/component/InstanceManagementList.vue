<template>
    <div class="InstanceManagementList">
    <div class="content">
      <Tabs :value="tabalive" @on-click="onClick">
          <TabPane label="待办流程" name="待办流程"><todoProcess></todoProcess></TabPane>
          <TabPane label="历史流程" name="历史流程"><HistoricalProcess></HistoricalProcess></TabPane>
      </Tabs>
      <i class="iconfont iconmd-close InstanceManagementListDelete" @click="closeLists"></i>
    </div>


    </div>
</template>
// <script>
import todoProcess from './TodoProcess';
import HistoricalProcess from './HistoricalProcess';
export default {
    name:'InstanceManagementList',
    components:{todoProcess,HistoricalProcess},
    data(){
        return{
            tabalive:"待办流程",//tab切换默认值
            tabConfig:[{
                label:'待办流程',
                name:'待办流程'
            },{
                label:'历史流程',
                name:'历史流程'
            }]
        }
    },
    methods:{
        routeClick(val){
            if(val === 1){
                this.tabalive = '待办流程';
            } else if (val === 2) {
                this.tabalive = '历史流程';
            }
        },
        //tab切换点击事件
        onClick(val){
            this.tabalive=val;
            // if(val==='历史流程'){
            //  window.history.replaceState({}, '', "/InstanceManagementList?type=2");
            // }else{
            //  window.history.replaceState({}, '', "/InstanceManagementList?type=1");
            // }

        },
        closeLists () {  //关闭待办列表
          window.jflowPlugin.todoListsFun(false)
        }
    },
    created(){
        let path=window.location.pathname;
       this.routeClick(path.split('=')[1]);
    }

}
</script>
<style lang="less" >
@keyframes myfirst
{
  from {
    height:0%;
    top: 100%;
  }
  to {
    height:100%;
    top:0;
  }
}
.InstanceManagementList{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    z-index: 2000;
    background: rgba(0,0,0,0.3);
    padding: 60px 10px 10px 10px;
    display: flex;
    flex-direction: column;



    .content{
      flex: 1;
      display: flex;
      background: white;
      padding: 10px;
      position: relative;
      animation:myfirst 1s ease;

      .InstanceManagementListDelete{
        width: 12px;
        position: absolute;
        top: 0;
        right: 0;
        top: 12px;
        right: 14px;
        font-size: 20px;
        cursor: pointer;
      }
    }

    .burgeon-breadcrumb{
        font-size:18px;
        margin-bottom: 12px;
    }
    .burgeon-tabs{

        flex:1;
        display: flex;
       -webkit-box-direction: column;
        flex-direction: column;
        background: white;
        .burgeon-tabs-bar{
            height: 27px;
        }
        .burgeon-tabs-content-animated{
          flex:1;
        .burgeon-tabs-tabpane{
            display: flex;
        }
    }
    }

}
</style>

