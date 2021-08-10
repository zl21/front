<template>
  <div :class="classes">
    <div class="clonePopUp">
      <div class="pop-title">
        <div class="pop-input">
          <ul style="list-style:none;">
            <li>
              <span>旧密码：</span><input
                id="ativeFocus"
                v-model="oldpaswd"
                type="password"
                :class="{'borderactive':inconformity1}"
                @focus="focus($event,1)"
              ><input
                type="password"
                name="password1"
                style="display:none"
              >
              <p
                v-show="oldp"
                :style="{ color: errorpawdgrade}"
              >
                请输入旧密码
              </p>
            </li>
            <li>
              <span>新密码：</span><input
                v-model="newpaswd"
                :class="{'borderactive':inconformity2}"
                type="password"
                @blur="blur()"
                @input="changwd()"
                @focus="focus($event,2)"
              ><input
                type="password"
                name="password1"
                style="display:none"
              >
              <p
                v-show="pawdgrade1"
                :style="{ color: errorpawdgrade1}"
              >
                {{ this.newHint }}
              </p>
              <p v-show="pawdgrade">
                密码安全程度：<b :style="{ color: activeColor}">{{ grade }}</b>
              </p>
            </li>
            <li>
              <span>确认密码：</span><input
                v-model="againpaswd"
                :class="{'borderactive':inconformity3}"
                type="password"
                @focus="focus($event,3)"
              ><input
                type="password"
                name="password1"
                style="display:none"
              >
              <p
                v-show="inconformity3"
                :style="{ color: error}"
              >
                两次输入的密码不一致
              </p>
            </li>
          </ul>
        </div>
        <div class="pop-btn">
          <span
            class="sav-btn"
            @click="save()"
          >确认</span>
          <span
            class="cancel-btn"
            @click="()=>{this.$emit('closeActionDialog',false)}"
          >取消</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
  import network from '../../__utils__/network';
  import { classFix } from '../../constants/global';

  export default {
    name: 'ChangePassword',
    data() {
      return {
        title: '用户修改密码', // 标题
        oldpaswd: '',
        newpaswd: '',
        pawdgrade2: false,
        errorpawdgrade: 'red',
        errorpawdgrade1: '#818181',
        newHint: '密码必须由6-18个字符且数字、大小写字母同时存在',
        againpaswd: '',
        pop_dialog: false,
        activeColor: 'red', // 控制密码强度的时候，颜色
        error: 'red',
        grade: '低', // 密码等级
        oldp: false, // 旧密码是否错误
        pawdgrade: false, // 显示密码等级
        pawdgrade1: true, // 密码长度
        inconformity1: false, // input错误border颜色class
        inconformity2: false, // input错误border颜色class
        inconformity3: false, // input错误border颜色class
        reg: new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{6,18}$/)
    };
    },
    computed: {
      classes() {
        return [
          `${classFix}ChangePassword`,
        ];
      },
    },
    mounted() {
      document.getElementById('ativeFocus').focus();
    },
    methods: {
      changwd() { // 修改密码，显示密码强度
        this.pawdgrade = false;
        this.pawdgrade1 = true;
        // if (this.newpaswd.length > 0 && this.reg.test(this.newpaswd)) {
        //   this.pawdgrade = true;
        //   if (/^(?:\d+|[a-zA-Z]+)$/.test(this.newpaswd)) {
        //     this.grade = '低';// 纯数字，纯字母，纯特殊字符
        //     this.activeColor = '#e80000';
        //   } else if (/^[a-z0-9]+$/.test(this.newpaswd)) {
        //     this.grade = '中';// 字母+数字
        //     this.activeColor = '#09a155';
        //   } else if (this.reg.test(this.newpaswd)) {
        //     this.activeColor = '#09a155';
        //     this.grade = '高'; // 数字、大小写字母同时存在
        //   }
        // }
      },
      blur() { // 失焦时判断密码
        if (this.newpaswd === '') {
          this.pawdgrade1 = true;
          this.errorpawdgrade1 = 'red';
          this.inconformity2 = true;
          this.newHint = '请输入新密码';
        } else if (this.newpaswd.length >= 6 && this.newpaswd.length <= 18) {
          if (!this.reg.test(this.newpaswd)) {
            this.newHint = '密码必须由6-18个字符且数字、大小写字母同时存在';
            this.errorpawdgrade1 = 'red';
            this.inconformity2 = true;
            this.pawdgrade1 = true;
          }
          this.errorpawdgrade1 = '#818181';
          this.newHint = '密码必须由6-18个字符且数字、大小写字母同时存在';
        } else {
          this.newHint = '密码必须由6-18个字符且数字、大小写字母同时存在';
          this.errorpawdgrade1 = 'red';
          this.inconformity2 = true;
          this.pawdgrade1 = true;
        }
      },
      focus(e, num) { // 聚焦清除提示
        switch (num) {
        case 1: this.oldp = false; this.inconformity1 = false;
                break;
        case 2: this.pawdgrade = false; this.pawdgrade1 = true; this.inconformity2 = false; this.errorpawdgrade1 = '#818181'; this.newHint = '密码必须由6-18个字符且数字、大小写字母同时存在';
                break;
        default: this.inconformity3 = false;
        }
      },
      save() { // 保存
        if (!this.oldpaswd) { // 如果旧密码为空
          this.oldp = true;
          this.inconformity1 = true;
          return false;
        }
        if (this.newpaswd === '') { // 新密码为空
          this.pawdgrade1 = true;
          this.errorpawdgrade1 = 'red';
          return false;
        }
        if (this.newpaswd.length < 6) { // 密码长度小于6
          this.pawdgrade = false;
          this.errorpawdgrade1 = 'red';
          this.pawdgrade1 = true;
          return false;
        }
        if (this.newpaswd.length > 18) { // 密码长度大于18
          this.pawdgrade = false;
          this.errorpawdgrade1 = 'red';
          this.pawdgrade1 = true;
          return false;
        }
        if (this.againpaswd === '') { // 再次输入密码为空
          this.inconformity3 = true;
          return false;
        }
        if (!this.reg.test(this.newpaswd)) { // 只要有一位数字、一位字母，其他四位不管是啥
          this.pawdgrade = false;
          this.errorpawdgrade1 = 'red';
          this.pawdgrade1 = true;
          return false;
        }
        if (this.newpaswd !== this.againpaswd) { // 两次密码不一样
          this.inconformity3 = true;
          return false;
        }
        network.post('/p/cs/changechruserpwd', {
          oldpassword: this.oldpaswd,
          newpassword: this.newpaswd,
          confirmpassword: this.againpaswd
        }).then((res) => {
          if (res.data.code === 0) {
            const message = {
              title: this.$t('feedback.success'),
              content: res.data.message
            };
            this.$Modal.fcSuccess(message);
            this.newpaswd = '';
            this.againpaswd = '';
            this.$emit('closeActionDialog', true);
          }
        });
        return true;
      }
    }
  };
</script>
