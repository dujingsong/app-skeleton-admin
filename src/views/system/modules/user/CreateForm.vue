<template>
  <a-modal
    :title="title ? title : cmd && cmd === 'view' ? '查看' : model && model.id ?'修改':'新建'"
    :width="640"
    :visible="visible"
    :confirmLoading="loading"
    :ok-button-props="{ props: { disabled: cmd && cmd === 'view' } }"
    @ok="() => { $emit('ok') }"
    @cancel="() => { $emit('cancel') }"
  >
    <a-spin :spinning="loading">
      <a-form :form="form" v-bind="formLayout">
        <a-form-item label="名称">
          <a-input :readOnly="cmd && cmd === 'view'" v-decorator="['name', {rules: [{required: true, min: 2, max: 16, message: '请输入2~16个字符的名称！'}]}]" />
        </a-form-item>
        <a-form-item label="用户名">
          <a-input :readOnly="cmd && cmd === 'view'" v-decorator="['username', {rules: [{required: true, min: 2, max: 16, message: '请输入2~16个字符的用户名！'}]}]" />
        </a-form-item>
        <a-form-item label="密码" v-if="cmd && cmd === 'add'">
          <a-input :readOnly="cmd && cmd === 'view'" v-decorator="['password', {rules: [{required: true, min: 6, max: 32, message: '请输入6~32个字符的密码！'}]}]" />
        </a-form-item>
        <a-form-item label="状态">
          <a-select :disabled="cmd && cmd === 'view'" :options="statusOptions" v-decorator="['status', {rules: [{required: true, message: '请选择状态！'}]}]">
          </a-select>
        </a-form-item>
        <a-form-item label="邮箱">
          <a-input :readOnly="cmd && cmd === 'view'" v-decorator="['email', {rules: [{required: false}]}]" />
        </a-form-item>
        <a-form-item label="简介">
          <a-input :readOnly="cmd && cmd === 'view'" v-decorator="['profile', {rules: [{required: false}]}]" />
        </a-form-item>
        <a-form-item label="备注">
          <a-input :readOnly="cmd && cmd === 'view'" v-decorator="['notes', {rules: [{required: false, max: 32, message: '备注不能超出16个字符！'}]}]" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'

// 表单字段
const fields = ['id', 'name', 'username', 'password', 'status', 'email', 'profile', 'notes']

export default {
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    loading: {
      type: Boolean,
      default: () => false
    },
    model: {
      type: Object,
      default: () => null
    },
    cmd: {
      type: String,
      default: () => null
    },
    title: {
      type: String,
      default: () => null
    }
  },
  data () {
    this.formLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      }
    }
    return {
      statusOptions: [{
        title: '启用',
        value: 0
      }, {
        title: '禁用',
        value: 1
      }],
      form: this.$form.createForm(this)
    }
  },
  created () {
    // 防止表单未注册
    fields.forEach(v => this.form.getFieldDecorator(v))

    // 当 model 发生改变时，为表单设置值
    this.$watch('model', () => {
      this.model && this.form.setFieldsValue(pick(this.model, fields))
    })
  }
}
</script>
