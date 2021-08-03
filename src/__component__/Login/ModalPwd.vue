<template>
  <Modal
          v-model="modalShow"
          title="修改密码"
          :footer-hide="true"
  >
    <Form ref="formValidate" :model="limit" :rules="limitValite" :label-width="80">
      <FormItem label="旧密码" prop="oldPwd">
        <Input v-model="limit.oldPwd" placeholder="请输入旧密码"></Input>
      </FormItem>
      <FormItem label="新密码" prop="newPwd">
        <Input type="password" v-model="limit.newPwd" placeholder="请输入新密码"></Input>
      </FormItem>
      <FormItem label="重复密码" prop="repeatPwd">
        <Input type="password" v-model="limit.repeatPwd" placeholder="请再次输入密码"></Input>
      </FormItem>
      <FormItem>
        <Button type="fcdefault" @click="ok">确定</Button>
        <Button type="fcdefault" @click="cancel">取消</Button>
      </FormItem>
    </Form>
  </Modal>
</template>

<script>
  export default {
    name: 'ModalPwd',
    props: {
      loginType: {
        type: Boolean,
        default: false
      },
      TypeToggle: {
        type: Number,
        default: 1
      },
    },
    data() {
      const validatePwd = (rule, value, callback) => {
        const reg = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,18}$/);
        if (value === '') {
          callback(new Error('请输入密码'));
        } else if(!reg.test(value)) {
          callback(new Error('您输入的密码不规范'));
        } else {
          callback();
        }
      };
      const validatecheckPwdPwd = (rule, value, callback) => {
        if (this.limit.repeatPwd === '') {
          callback(new Error('请输入密码'));
        } else if(this.limit.newPwd !== this.limit.repeatPwd) {
          callback(new Error('两次密码输入不一致'));
        } else {
          callback();
        }
      };
      return {
        modalShow: false,
        limit: {
          oldPwd: '',
          newPwd: '',
          repeatPwd: '',
        },
        limitValite: {
          oldPwd: [
            { required: true, message: '请输入旧密码', trigger: 'blur' }
          ],
          newPwd: [
            {required: true, validator: validatePwd, trigger: 'blur'},
          ],
          repeatPwd: [
            {required: true, validator: validatecheckPwdPwd, trigger: 'blur'},
          ],
        }
      }
    },
    methods: {
      ok() {
        console.log('limit', this.limit);
        this.$refs['formValidate'].validate((valid) => {
          if (valid) {
            this.$Message.success('Success!');
          } else {
            this.$Message.error('Fail!');
          }
        })
      },
      cancel() {
        this.modalShow = false;
      },
      open() {
        this.modalShow = true;
      },
    }
  }

</script>
