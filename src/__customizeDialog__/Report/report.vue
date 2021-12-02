<template>
  <!-- 报表模版，report -->
  <div :class="classes">
    <div class="pop-title">
      <div class="pop-input">
        <ul>
          <li class="resTop">
            <span>{{$t('tips.environment')}}:</span>
            <Select
              v-model="envValue"
              style="width:228px"
            >
              <Option
                v-for="(item,index) in env"
                :key="index"
                :value="item"
              >
                {{ item }}
              </Option>
            </Select>
          </li>
        </ul>
      </div>
      <div class="pop-btn">
        <button
          class="sav-btn"
          @click="save"
        >
          <span>{{ chineseName.CONFIRM }}</span>
        </button>
        <button
          class="cancel-btn"
          @click="cancel"
        >
          <span>{{ chineseName.CANCEL }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
  import ChineseDictionary from '../../assets/js/ChineseDictionary';
  import network, { urlSearchParams } from '../../__utils__/network';
  // import window.vm.$router.from '../../__config__/router.config';
  import { classFix } from '../../constants/global';

  export default {
    name: 'Report',
    props: {
      objList: {
        type: Array,
        default: () => []
      },
      idArray: {// 获取ID用于多选
        type: [Array, Object],
        default: () => {}
      },
    },
    data() {
      return {
        env: [],
        envValue: ''
      };
    },
    components: {},
    computed: {
      classes() {
        return [
          `${classFix}publishContent`,
        ];
      },
    },
    methods: {
      getEnvs() {
        network
          .get('/p/cs/getEnvs')
          .then((res) => {
            if (res.data.code === 0) {
              this.env = res.data.data;
            }
          });
      },
      save() {
        if (!this.envValue) {
          const data = {
            mask: true,
            title: this.$t('feedback.warning'),
            content: `${this.$t('form.selectPlaceholder')}${this.$t('tips.environment')}`
          };
          this.$Modal.fcWarning(data);
          return;
        }
        const searchdata = {
          env: this.envValue,
        };
        const { tableName } = window.vm.$router.currentRoute.params;

        if (this.idArray.length === 0) {
          const data = {
            mask: true,
            title: this.$t('feedback.warning'),
            content: this.$t('publishPrintTemplate.continueCover'),
            showCancel: true,
            onOk: () => {
              const datas = {
                tableName,
                searchdata
              };
              this.publish(datas);
            }
          };
          this.$Modal.fcWarning(data);
        } else {
          searchdata.ids = this.idArray.map(d => parseInt(d));
          const datas = {
            tableName,
            searchdata
          };
          this.publish(datas);
        }
      }, // 确定
      publish(data) {
        this.$R3loading.show(this.loadingName);
        network.post('/p/cs/report/release', urlSearchParams(data.searchdata))
          .then((res) => {
            this.$R3loading.hide(this.loadingName);

            if (res.data.code !== 0) {
              return;
            }
            if (res.data.code === 0) {
              const message = res.data.message;
              const datas = {
                mask: true,
                title: this.$t('feedback.success'),
                content: message
              };
              this.$Modal.fcSuccess(datas);
              this.$emit('closeActionDialog', true); // 关闭弹框
            }
          }).catch(() => {
            this.$R3loading.hide(this.loadingName);
          });
      },
      cancel() {
        this.$emit('closeActionDialog', false); // 关闭弹框
      }, // 取消
    },
    created() {
      this.loadingName = this.$route.meta.moduleName.replace(/\./g, '-');
      this.chineseName = ChineseDictionary;
    },
    mounted() {
      // this.$emit('setTitle', '环境'); // 关闭弹框

      this.getEnvs();
    },

  };
</script>
