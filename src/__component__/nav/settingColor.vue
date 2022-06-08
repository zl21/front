<template>
  <div :class="classes" v-if="showColorSetting && userInfo.isadmin">
    <!-- 切换布局结构 -->
    <div class="panel-item">
      <p>
        <i class="iconfont iconmd-map explanatory" />
        {{ $t('messages.SwitchToShow') }}
        <i-switch
          v-model="switchToShow"
          class="switch"
          @on-change="updatesystemcolor($event, 'is_up_down')"
        />
      </p>
    </div>
    <!-- 换肤功能 -->
    <changeTheme
      ref="changeTheme"
      @on-change="updatesystemcolor($event, 'color')"
      :name="$t('changeTheme.title')"
      :value="themeColor"
    />
  </div>
</template>

<script>
import { classFix, Version } from '../../constants/global';
import network from '../../__utils__/network';
import '../../assets/svg/iconfont';
// import changeTheme from 'webpack-theme-color-replacer-syman/src/views/ChangeTheme/ChangeTheme.vue';
import {mapState} from 'vuex';

export default {
  name: 'OutLink',
  data() {
    return {
      switchToShow: false, // 默认是水平，true 是垂直结构
      themeColor: '',
      changeThemeComponent:'',// 换肤插件
      showColorSetting: false, // 是否显示
    };
  },
  components: {
    // changeTheme
  },
  computed: {
    ...mapState('global', {
      userInfo: ({userInfo}) => userInfo,
    }),
    classes() {
      return [`${classFix}setting-color`];
    },
  },
  methods: {
    updatesystemcolor(value, key) {
      // 换肤 切换展现形式
      let param = {
        is_up_down: this.switchToShow,
        color: this.themeColor ,
      };
      param[key] = value;
      network.post('/p/cs/updatesystemcolor', param).then(() => {
        if (key === 'is_up_down') {
          this.$Message.info({
                content: this.$t('feedback.RefreshThePrompt'),
                duration: 1,
            });
            setTimeout(()=>{
              window.location.reload();
            },500)
        } else {
          this.themeColor = value;
        }
        window.ProjectConfig.layoutDirection = this.switchToShow;
        localStorage.setItem('layoutDirection', this.switchToShow);
      });
    },
    getsystemcolor() {
      // 获取设置的颜色和展现形式
      network.post('/p/c/getsystemcolor').then((res) => {
        let data = res.data.data;
        if (data.is_up_down !== this.switchToShow) {
          this.switchToShow = data.is_up_down;
          // this.$Message.info({
          //       content: this.$t('feedback.RefreshThePrompt'),
          //       duration: 1,
          //   });
          //   setTimeout(()=>{
          //     window.location.reload();
          //   },500)
        }
        this.themeColor = data.color;
        
        if(window['_R3_CHANGETHEME']){
            window['_R3_CHANGETHEME'](this.themeColor, this).then((res) => {
                  document.querySelector('body').style.opacity = '1';
            });
        }
        window.ProjectConfig.layoutDirection = this.switchToShow;
        localStorage.setItem('layoutDirection', this.switchToShow);
      });
    },
  },
  beforeCreate(){
      let { showColorSetting } = window.ProjectConfig;
      if(showColorSetting){
        document.querySelector('body').style.opacity = '0';
        setTimeout(()=>{
          document.querySelector('body').style.opacity = '1';
        },1000)
      }
  },
  mounted() {
    let { showColorSetting } = window.ProjectConfig;
    //
    if (Version() === '1.4' && showColorSetting) {
      this.showColorSetting = true;
      this.switchToShow = localStorage.getItem('layoutDirection') === 'true';
      this.getsystemcolor();


    }
  },
};
</script>
