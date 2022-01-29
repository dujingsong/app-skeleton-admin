<template>
  <div class="account-settings-info-view">
    <a-row :gutter="16" type="flex" justify="center">
      <a-col :order="isMobile ? 2 : 1" :md="24" :lg="16">

        <a-form-model
          layout="vertical"
          ref="form"
          :model="form"
          :rules="rules"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-form-model-item
            :label="$t('account.settings.basic.nickname')"
            prop="name"
          >
            <a-input
              :placeholder="$t('account.settings.basic.nickname-message')"
              v-model="form.name"
            />
          </a-form-model-item>
          <a-form-model-item
            :label="$t('account.settings.basic.profile')"
            prop="profile"
          >
            <a-textarea
              rows="4"
              :placeholder="$t('account.settings.basic.profile-message')"
              v-model="form.profile"
            />
          </a-form-model-item>

          <a-form-model-item
            :label="$t('account.settings.basic.email')"
            prop="email"
          >
            <a-input
              :placeholder="$t('account.settings.basic.email-message')"
              v-model="form.email"
            />
          </a-form-model-item>

          <a-form-model-item>
            <a-button type="primary" :loading="loading" @click="handleSubmit">{{ $t('account.settings.basic.update') }}</a-button>
          </a-form-model-item>
        </a-form-model>

      </a-col>
      <a-col :order="1" :md="24" :lg="8" :style="{ minHeight: '180px' }">
        <div class="ant-upload-preview" @click="$refs.modal.edit(1)" >
          <a-icon type="cloud-upload-o" class="upload-icon"/>
          <div class="mask">
            <a-icon type="plus" />
          </div>
          <img :src="option.img"/>
        </div>
      </a-col>

    </a-row>

    <avatar-modal ref="modal" @ok="setAvatar"/>

  </div>
</template>

<script>
import AvatarModal from './AvatarModal'
import { baseMixin } from '@/store/app-mixin'
import { mapGetters } from 'vuex'
import { updateBasicInfo } from '@/api/user'
import store from '@/store'

export default {
  mixins: [baseMixin],
  components: {
    AvatarModal
  },
  data () {
    return {
      // cropper
      preview: {},
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      option: {
        img: '',
        info: true,
        size: 1,
        outputType: 'jpeg',
        canScale: false,
        autoCrop: true,
        // 只有自动截图开启 宽度高度才生效
        autoCropWidth: 180,
        autoCropHeight: 180,
        fixedBox: true,
        // 开启宽度和高度比例
        fixed: true,
        fixedNumber: [1, 1]
      },
      loading: false,
      form: {},
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 3, max: 5, message: '名称长度为1-20个字符', trigger: 'blur' }
        ],
        profile: [
          { required: true, message: '请输入个性签名', trigger: 'change' },
          { max: 32, message: '个性签名不能超过32个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'change' },
          { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    userInfo () {
      return this.$store.getters.userInfo
    }
  },
  created () {
    this.form = JSON.parse(JSON.stringify(this.userInfo))
    this.option.img = this.$appProp.fileStorePath + this.$appProp.avatarPath + this.userInfo.avatar
  },
  methods: {
    setAvatar (url) {
      this.option.img = this.$appProp.fileStorePath + this.$appProp.avatarPath + url
      store.dispatch('GetInfo')
    },
    handleSubmit (e) {
      this.loading = true
      this.$refs.form.validate(valid => {
        if (!valid) {
          this.loading = false
          return false
        }
        updateBasicInfo(this.form).then(res => {
          this.loading = false
          if (res.code !== '0') {
            this.$message.error('更新失败')
          } else {
            this.$message.info('更新成功')
            store.dispatch('GetInfo')
          }
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>

  .avatar-upload-wrapper {
    height: 200px;
    width: 100%;
  }

  .ant-upload-preview {
    position: relative;
    margin: 0 auto;
    width: 100%;
    max-width: 180px;
    border-radius: 50%;
    box-shadow: 0 0 4px #ccc;

    .upload-icon {
      position: absolute;
      top: 0;
      right: 10px;
      font-size: 1.4rem;
      padding: 0.5rem;
      background: rgba(222, 221, 221, 0.7);
      border-radius: 50%;
      border: 1px solid rgba(0, 0, 0, 0.2);
    }
    .mask {
      opacity: 0;
      position: absolute;
      background: rgba(0,0,0,0.4);
      cursor: pointer;
      transition: opacity 0.4s;

      &:hover {
        opacity: 1;
      }

      i {
        font-size: 2rem;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -1rem;
        margin-top: -1rem;
        color: #d6d6d6;
      }
    }

    img, .mask {
      width: 100%;
      max-width: 180px;
      height: 100%;
      border-radius: 50%;
      overflow: hidden;
    }
  }
</style>
