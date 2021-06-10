<template>
  <div class="batchChangePassword">
    <div class="clonePopUp">
      <div class="pop-title">
        <div class="pop-input">
          <ul style="list-style:none;">
            <li>
              <span>输入密码：</span>
              <input
                    id="newPwd"
                    v-model="newpaswd"
                    :class="{'borderactive':inconformity2}"
                    type="password"
                    @blur="blur()"
                    @input="changwd()"
                    @focus="focus($event,2)">
              <input type="password" name="password1" style="display:none">
              <p v-show="pawdgrade1" :style="{ color: errorpawdgrade1}">{{ this.newHint }}</p>
              <p v-show="pawdgrade">密码安全程度：<b :style="{ color: activeColor}">{{ grade }}</b></p>
            </li>
            <li>
              <span>确认密码：</span>
              <input
                    v-model="againpaswd"
                    :class="{'borderactive':inconformity3}"
                    type="password"
                    @focus="focus($event,3)">
              <input type="password" name="password1" style="display:none">
              <p v-show="inconformity3" :style="{ color: error}">两次输入的密码不一致</p>
            </li>
          </ul>
        </div>
        <div class="pop-btn">
          <span class="sav-btn" @click="save()">确认</span>
          <span class="cancel-btn" @click="()=>{this.$emit('closeActionDialog',false)}">取消</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
  import network from '../../__utils__/network';

  export default {
    name: 'batchChangePassword',
    data() {
      return {
        title: '用户修改密码', // 标题
        newpaswd: '',
        pawdgrade2: false,
        errorpawdgrade: 'red',
        errorpawdgrade1: '#818181',
        newHint: '密码必须由6位以上数字、字母组成',
        againpaswd: '',
        pop_dialog: false,
        activeColor: 'red', // 控制密码强度的时候，颜色
        error: 'red',
        grade: '低', // 密码等级
        pawdgrade: false, // 显示密码等级
        pawdgrade1: true, // 密码长度
        inconformity1: false, // input错误border颜色class
        inconformity2: false, // input错误border颜色class
        inconformity3: false, // input错误border颜色class
      };
    },
    props: {
      idArray: {// 获取ID用于多选
        type: [Array, Object],
        default: () => {}
      },
      itemId: {// 获取当前子表表名
        type: String,
        default: () => ''
      }
    },
    mounted() {
      document.getElementById('newPwd').focus();
    },
    methods: {
      changwd() { // 修改密码，显示密码强度
        this.pawdgrade = false;
        this.pawdgrade1 = true;
        if (this.newpaswd.length > 0) {
          this.pawdgrade = true;
          if (/^(?:\d+|[a-zA-Z]+|[!@#$%^&*]+)$/.test(this.newpaswd)) {
            this.grade = '低';// 纯数字，纯字母，纯特殊字符
            this.activeColor = '#e80000';
          } else if (/^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*]+$)[a-zA-Z\d!@#$%^&*]+$/.test(this.newpaswd)) {
            this.grade = '中';// 字母+数字，字母+特殊字符，数字+特殊字符
            this.activeColor = '#09a155';
          } else if (/[-\da-zA-Z=\\;',./~!@#$%^&*()_+|{}:<>?]*((\d+[a-zA-Z]+[-=\;',./~!@#$%^&*()_+|{}:<>?]+)|(\d+[-=\\;',./~!@#$%^&*()_+|{}:<>?]+[a-zA-Z]+)|([a-zA-Z]+\d+[-=\;',./~!@#$%^&*()_+|{}:<>?]+)|([a-zA-Z]+[-=\\;',./~!@#$%^&*()_+|{}:<>?]+\d+)|([-=\;',./~!@#$%^&*()_+|{}:<>?]+\d+[a-zA-Z]+)|([-=\\;',./~!@#$%^&*()_+|{}:<>?]+[a-zA-Z]+\d+))[-\da-zA-Z=\;',./~!@#$%^&*()_+|{}:<>?]*/.test(this.newpaswd)) {
            this.activeColor = '#09a155';
            this.grade = '高'; // 字母+数字+特殊字符
          }
        }
      },
      blur() { // 失焦时判断密码
        if (this.newpaswd === '') {
          this.pawdgrade1 = true;
          this.errorpawdgrade1 = 'red';
          this.inconformity2 = true;
          this.newHint = '请输入新密码';
        } else if (this.newpaswd.length > 5) {
          if (!/[A-Za-z]/.test(this.newpaswd) || !/[0-9]/.test(this.newpaswd)) {
            this.newHint = '密码必须由6位以上数字、字母组成';
            this.errorpawdgrade1 = 'red';
            this.inconformity2 = true;
            this.pawdgrade1 = true;
          }
          this.errorpawdgrade1 = '#818181';
          this.newHint = '密码必须由6位以上数字、字母组成';
        } else {
          this.newHint = '密码必须由6位以上数字、字母组成';
          this.errorpawdgrade1 = 'red';
          this.inconformity2 = true;
          this.pawdgrade1 = true;
        }
      },
      focus(e, num) { // 聚焦清除提示
        switch (num) {
          case 2:
            this.pawdgrade = false;
            this.pawdgrade1 = true;
            this.inconformity2 = false;
            this.errorpawdgrade1 = '#818181';
            this.newHint = '密码必须由6位以上数字、字母组成';
            break;
          default:
            this.inconformity3 = false;
        }
      },
      save() { // 保存
        if (this.newpaswd === '') { // 新密码为空
          this.pawdgrade1 = true;
          this.errorpawdgrade1 = 'red';
          return false;
        }
        if (this.newpaswd.length < 5) { // 密码长度小于6
          this.pawdgrade = false;
          this.errorpawdgrade1 = 'red';
          this.pawdgrade1 = true;
          return false;
        }
        if (this.againpaswd === '') { // 再次输入密码为空
          this.inconformity3 = true;
          return false;
        }
        if (!/[A-Za-z]/.test(this.newpaswd) || !/[0-9]/.test(this.newpaswd)) { // 只要有一位数字、一位字母，其他四位不管是啥
          this.pawdgrade = false;
          this.errorpawdgrade1 = 'red';
          this.pawdgrade1 = true;
          return false;
        }
        if (this.newpaswd !== this.againpaswd) { // 两次密码不一样
          this.inconformity3 = true;
          return false;
        }
        const param = {
          new_password: this.newpaswd,
          confirm_password: this.againpaswd
        };
        if (this.idArray && this.idArray.length > 0) {
          param.user_ids = this.idArray
        } else {
          return this.$Message.info('请勾选需要重置的用户')
        }
        network.post('/p/cs/modifyPwd', param).then((res) => {
          if (res.data.code === 0) {
            const message = {
              title: '成功',
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
<style lang="less" scoped>
  .batchChangePassword {
    width: 380px;
    .clonePopUp {
      font-size: 12px;
      line-height: 25px;

      .pop-title {
        box-sizing: border-box;
      }

      .pop-input {
        li {
          margin-bottom: 18px;

          &:last-child {
            margin-bottom: 10px;
          }
        }

        span {
          display: inline-block;
          width: 65px;
          text-align: right;
        }

        input {
          border: 1px solid #d8d8d8;
          width: 200px;
          height: 22px;
          padding: 0 5px;
          border-radius: 2px;
          font-size: 12px;
          color: #575757;
          transition: border-color .2s ease;
        }

        .borderactive {
          border-color: #e80000
        }

        p {
          height: 14px;
          padding-left: 67px;
          margin: 2px 0;
          color: #818181;
          line-height: 14px;

          i {
            margin-left: 10px;
            margin-right: 4px;
            font-weight: 0;
          }

          .icon-cha {
            color: rgb(232, 0, 0);
          }

          .icon-right-copy {
            color: #09a115;
          }

          b {
            color: #09a115;
          }
        }

        input:focus {
          border-color: #0F8EE9;
        }
      }

      .pop-btn {

        text-align: left;
        padding: 0px 0px 0 65px;

        .sav-btn, .cancel-btn {
          cursor: pointer;
          padding: 4px 18px;
          box-sizing: border-box;
          background-color: #fff;
          border: 1px solid #FD6442;
          color: #FD6442;
          font-size: 12px;
          border-radius: 2px;

          span {
            color: #FD6442;
          }
        }

        .cancel-btn {
          margin-left: 6px
        }

        .sav-btn:hover, .cancel-btn:hover {
          opacity: 0.6;
        }
      }
    }
  }

</style>
