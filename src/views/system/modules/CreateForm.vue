<template>
  <a-modal
    :title="model && model.id ?'修改角色':'新建角色'"
    :width="640"
    :visible="visible"
    :confirmLoading="loading"
    @ok="() => { $emit('ok') }"
    @cancel="() => { $emit('cancel') }"
  >
    <a-spin :spinning="loading">
      <a-form :form="form" v-bind="formLayout">
        <a-form-item label="名称">
          <a-input v-decorator="['name', {rules: [{required: true, min: 2, max: 16, message: '请输入2~16个字符的名称！'}]}]" />
        </a-form-item>
        <a-form-item label="状态">
          <a-select :options="statusOptions" v-decorator="['status', {rules: [{required: true, message: '请选择状态！'}]}]">
          </a-select>
        </a-form-item>
        <a-form-item label="备注">
          <a-input v-decorator="['notes', {rules: [{required: false, max: 32, message: '备注不能超出16个字符！'}]}]" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'

// 表单字段
const fields = ['id', 'name', 'status', 'notes']

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
       console.log(this.cmd)
      this.model && this.form.setFieldsValue(pick(this.model, fields))
    })
  }
}
</script>
