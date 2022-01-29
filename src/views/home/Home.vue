<template>
  <page-header-wrapper>
    <template v-slot:content>
      <div class="page-header-content">
        <div class="avatar">
          <a-avatar size="large" :src="avatar" />
        </div>
        <div class="content">
          <div class="content-title">
            {{ timeFix }}，{{ user.name }}<span class="welcome-text">，{{ welcome }}</span>
          </div>
          <div>{{ user.profile }}</div>
        </div>
      </div>
    </template>
    <template v-slot:extraContent>
      <div class="extra-content custom-extra-content">
        <p>上次登录</p>
        <p>{{ user.lastLoginTime ? $moment(user.lastLoginTime).format('yyyy-MM-DD HH:mm:ss') : '' }}</p>
      </div>
    </template>

    <div>
      <a-row :gutter="24">
        <a-col :xl="24" :lg="24" :md="24" :sm="24" :xs="24">

          <a-card :loading="loading" title="公告" :bordered="false">
            <a-list>
              <a-list-item :key="index" v-for="(item, index) in activities">
                <a-list-item-meta>
                  <a-avatar slot="avatar" size="small" :src="item.user.avatar" />
                  <div slot="title">
                    <span>{{ item.user.nickname }}</span
                    >&nbsp; 发布了&nbsp; {{ item.project.event }}
                  </div>
                  <div slot="description">{{ item.time }}</div>
                </a-list-item-meta>
              </a-list-item>
            </a-list>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </page-header-wrapper>
</template>

<script>
import { timeFix } from '@/utils/util'
import { mapState } from 'vuex'
import { PageHeaderWrapper } from '@ant-design-vue/pro-layout'

export default {
  name: 'Home',
  components: {
    PageHeaderWrapper
  },
  data () {
    return {
      timeFix: timeFix(),
      avatar: '',
      user: {},

      loading: true,
      activities: []
    }
  },
  computed: {
    ...mapState({
      nickname: state => state.user.nickname,
      welcome: state => state.user.welcome
    }),
    userInfo () {
      return this.$store.getters.userInfo
    }
  },
  created () {
    this.user = this.userInfo
    this.avatar = this.$appProp.fileStorePath + this.$appProp.avatarPath + this.userInfo.avatar
  },
  mounted () {
    this.getActivity()
  },
  methods: {
    getActivity () {
      this.activities = [{
        id: 1,
        user: {
          nickname: '@name',
          avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png'
        },
        project: {
          name: '白鹭酱油开发组',
          action: '更新',
          event: '番组计划'
        },
        time: '2018-08-23 14:47:00'
      },
        {
          id: 1,
          user: {
            nickname: '蓝莓酱',
            avatar: 'https://gw.alipayobjects.com/zos/rmsportal/jZUIxmJycoymBprLOUbT.png'
          },
          project: {
            name: '白鹭酱油开发组',
            action: '更新',
            event: '番组计划'
          },
          time: '2018-08-23 09:35:37'
        },
        {
          id: 1,
          user: {
            nickname: '@name',
            avatar: '@image(64x64)'
          },
          project: {
            name: '白鹭酱油开发组',
            action: '创建',
            event: '番组计划'
          },
          time: '2017-05-27 00:00:00'
        },
        {
          id: 1,
          user: {
            nickname: '曲丽丽',
            avatar: '@image(64x64)'
          },
          project: {
            name: '高逼格设计天团',
            action: '更新',
            event: '六月迭代'
          },
          time: '2018-08-23 14:47:00'
        },
        {
          id: 1,
          user: {
            nickname: '@name',
            avatar: '@image(64x64)'
          },
          project: {
            name: '高逼格设计天团',
            action: 'created',
            event: '六月迭代'
          },
          time: '2018-08-23 14:47:00'
        },
        {
          id: 1,
          user: {
            nickname: '曲丽丽',
            avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png'
          },
          project: {
            name: '高逼格设计天团',
            action: 'created',
            event: '六月迭代'
          },
          time: '2018-08-23 14:47:00'
        }
      ]
      this.loading = false
    }
  }
}
</script>

<style lang="less" scoped>
@import './Home.less';

.custom-extra-content {
  font-size: 12px;
}
</style>
