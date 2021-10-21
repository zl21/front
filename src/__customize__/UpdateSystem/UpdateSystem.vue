<template>
  <div class="r3-update-progress ">
    <div
      class="preloader"
      id="loader-wrapper"
    >
      <div class="preloader__status">
        <div
          status
          class="preloader__status-text"
        >版本更新中 <span class="per">{{loaded}}</span>%</div>
        <div class="preloader__status-loader">
          <div
            loader
            :style="loadStyle"
            class="preloader__status-bar"
          ></div>
        </div>
      </div>

      <div class="r3-loading">
        <div> L </div>
        <div> O </div>
        <div> A </div>
        <div> D </div>
        <div> I </div>
        <div> N </div>
        <div> G </div>
        <div> </div>
        <div> </div>
        <div> </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import network from '../../__utils__/network';

export default {
  name: 'R3UpdateSystem',

  data() {
    return {
      loaded: 0,
      loading: null,
      loadStyle: {
        width: '0%'
      },
      loader: $('[loader]'),
      body: $('body'),
      progressTotal: 0
    }
  },

  async mounted() {
    this.preloader = $('.preloader');
    await this.requestUpdate()
    this.checkProgress()
  },
  watch: {
    loaded() {
      this.loadStyle.width = `${this.loaded}%`;
    }
  },

  beforeDestroy() {
    if (this.loaded) {
      this.doneLoading()
    }
  },

  methods: {
    startLoading() {
      this.loading = setInterval(this.load, 200);
    },

    load() {
      // 升级进读到100%才跳转走
      if (this.loaded >= 100) {
        this.doneLoading()
        this.goto()
      }
      if (this.loaded < this.progressTotal) {
        this.loaded++
      }
    },

    doneLoading() {
      clearInterval(this.loading);
      this.updateStatus();
    },

    updateStatus() {
      this.loader.fadeOut();
    },

    // 检查更新进度
    async checkProgress() {
      const res = await this.requestProgress()
      this.startLoading();

      // 没升级完成就循环请求
      if (res) {
        this.progressTimer = setInterval(async () => {
          const res = await this.requestProgress()
          if (!res) {
            clearInterval(this.progressTimer)
            this.progressTimer = null
            this.progressTotal = 100
          } else {
            // 如果后端没升级完，最终就停在99
            if (this.progressTotal < 100) {
              const value = this.progressTotal + Math.floor(Math.random() * 5)
              this.progressTotal = Math.min(value, 99)
            } else {
              this.progressTotal = 99
            }
          }
        }, 1000)
      } else {
        this.progressTotal = 100
      }
    },

    // 请求进度接口
    async requestProgress() {
      // needUpdate为false直接进系统
      return new Promise((resolve) => {
        network.post('/p/cs/retail/queryLiquibaseExeStatus').then(result => {
          const res = result.data
          console.log("🚀 ~ ", res, res.data)
          if (res.code === 0) {
            resolve(res.data.needUpdate)
          } else {
            resolve(true)
            // this.$router.push({ path:'/Login'})
          }
        }).catch(() => {
          resolve(true)
          // this.$router.push({ path:'/Login'})
        })
      })
    },

    // 请求更新
    async requestUpdate() {
      return new Promise((resolve) => {
        network.post('/p/cs/retail/exeLiquibaseUpdate').then(() => {
        }).finally(() => {
          resolve()
        })
      })
    },

    // 界面跳转
    async goto() {
      const { loginCallback } = window.ProjectConfig;
      if (!loginCallback) {
        window.location.href = window.location.origin;
        return
      }
      if (typeof loginCallback !== 'function') {
        throw new Error('登录回调必须是一个函数')
      };
      const res = await loginCallback();
      delete window.ProjectConfig.loginCallback
      if (res) {
        window.location.href = window.location.origin;
      };
    }
  }
}
</script>

<style lang="less">
@import url('../../assets/styles/components/UpdateSystem.less');
</style>