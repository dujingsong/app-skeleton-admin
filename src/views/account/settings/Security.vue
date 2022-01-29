<template>
  <div>
    <a-list
      itemLayout="horizontal"
    >
      <a-list-item>
        <a-list-item-meta>
          <a slot="title">{{ $t('account.settings.security.password') }}</a>
          <span slot="description">
            <span class="security-list-description">经常更换密码有助于提升账号安全性</span>
          </span>
        </a-list-item-meta>
        <template>
          <a @click="showModal">{{ $t('account.settings.security.modify') }}</a>
        </template>

      </a-list-item>
    </a-list>

    <a-modal v-model="visible" title="修改密码" @ok="onSubmit">
      <a-form-model
        ref="form"
        :model="form"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item label="原密码" prop="oldPassword">
          <a-input type="password" autocomplete="off" v-model="form.oldPassword" />
        </a-form-model-item>
        <a-form-model-item label="新密码" prop="newPassword">
          <a-input type="password" autocomplete="off" v-model="form.newPassword" />
        </a-form-model-item>
        <a-form-model-item label="确认新密码" prop="confirmNewPassword">
          <a-input type="password" autocomplete="off" v-model="form.confirmNewPassword" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>

import { updatePassword } from '@/api/user'

export default {
  data () {
    const validateConfirmNewPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入新密码'))
      } else if (value !== this.form.newPassword) {
        callback(new Error('两次输入的新密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      visible: false,
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
      form: {
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      },
      rules: {
        oldPassword: [
          { required: true, message: '请输入原密码', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, max: 20, message: '新密码长度需为6~20个字', trigger: 'blur' }
        ],
        confirmNewPassword: [
          { required: true, message: '请再次输入新密码', trigger: 'blur' },
          { min: 6, max: 20, message: '新密码长度需为6~20个字', trigger: 'blur' },
          { validator: validateConfirmNewPassword, trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    showModal () {
      this.visible = true
    },
    handleOk (e) {
      this.visible = false
    },
    onSubmit () {
      this.$refs.form.validate(valid => {
        if (!valid) {
          return false
        }
        updatePassword(this.form).then(res => {
          if (res.code !== '0') {
            this.$message.error(res.msg || '更新失败')
          } else {
            this.$message.info('更新成功')
            this.visible = false
          }
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
