<template>
     <Alert type="warning" v-if="show" class="R3-Alert" show-icon closable>
       <slot>为了更好的操作体验，推荐使用谷歌浏览器访问。</slot>
    </Alert>
</template>

<script>
export default {
    data(){
        return {
            show:false
        }
    },
    created(){
        let { R3BrowserPrompt } = window.ProjectConfig;
        // 根据配置是否显示
        if(!R3BrowserPrompt){
            return;
        }
        let  userAgent = window.navigator && window.navigator.userAgent; 
        // 取得浏览器的userAgent字符串
        let BrowserVersion = ['Firefox','Opera','Edg',]
        if(userAgent.indexOf('Chrome') > -1){
            this.show = false;
            BrowserVersion.some((item)=>{
                if(userAgent.indexOf(item) > -1){
                   this.show = true;
                }
            })
        }else{
            this.show = true
        }
    }

}
</script>

<style>


</style>