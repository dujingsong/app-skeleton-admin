<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="用户名称">
                <a-input v-model="queryParam.keywords" placeholder=""/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="用户状态">
                <a-select v-model="queryParam.status" placeholder="请选择" default-value="0">
                  <a-select-option value="all">全部</a-select-option>
                  <a-select-option value="0">启用</a-select-option>
                  <a-select-option value="1">禁用</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="创建日期">
                  <a-range-picker
                    :show-time="{ format: 'HH:mm:ss' }"
                    format="YYYY-MM-DD HH:mm:ss"
                    :placeholder="['开始时间', '结束时间']"
                    @change="onChange"
                  />
                </a-form-item>
              </a-col>
            </template>
            <a-col :md="!advanced && 8 || 24" :sm="24">
              <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
                <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
                <a-button style="margin-left: 8px" @click="() => this.queryParam = {}">重置</a-button>
                <a @click="toggleAdvanced" style="margin-left: 8px">
                  {{ advanced ? '收起' : '展开' }}
                  <a-icon :type="advanced ? 'up' : 'down'"/>
                </a>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <div class="table-operator">
        <a-button type="primary" icon="plus" @click="handleAdd">新建</a-button>
        <a-dropdown v-action:edit v-if="selectedRowKeys.length > 0">
          <a-menu slot="overlay">
            <a-menu-item key="batchDelete" @click="batchDelete"><a-icon type="delete" />删除</a-menu-item>
            <!-- lock | unlock -->
            <a-menu-item key="batchEnable" @click="batchEnable"><a-icon type="unlock" />启用</a-menu-item>
            <a-menu-item key="batchDisable" @click="batchDisable"><a-icon type="lock" />禁用</a-menu-item>
          </a-menu>
          <a-button style="margin-left: 8px">
            批量操作 <a-icon type="down" />
          </a-button>
        </a-dropdown>
      </div>

      <s-table
        ref="table"
        size="default"
        rowKey="id"
        :columns="columns"
        :data="loadData"
        :alert="true"
        :rowSelection="rowSelection"
        showPagination="auto"
      >
        <span slot="serial" slot-scope="text, record, index">
          {{ index + 1 }}
        </span>
        <span slot="createTime" slot-scope="text">
          {{ moment(text).format('YYYY-MM-DD HH:mm:ss') }}
        </span>
        <span slot="status" slot-scope="text">
          <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />
        </span>
        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleView(record)" class="view_btn"><a-icon type="zoom-in" />查看</a>
            <a-divider type="vertical" />
            <a @click="handleEdit(record)"><a-icon type="edit" />修改</a>
            <a-divider type="vertical" />
            <a @click="handleGrant(record)"><a-icon type="key" />授权</a>
            <a-divider type="vertical" />
            <a @click="handleDelete(record)" class="delete_btn"><a-icon type="delete" />删除</a>
            <a-divider type="vertical" />
            <a @click="resetPassword(record)">重置密码</a>
          </template>
        </span>
      </s-table>

      <create-form
        ref="createModal"
        :visible="visible"
        :loading="confirmLoading"
        :model="mdl"
        :cmd="cmd"
        :title="title"
        @cancel="handleCancel"
        @ok="handleOk"
      />
      <step-by-step-modal ref="modal" @ok="handleOk"/>
      <a-modal
        v-model="grantVisible"
        width="80%"
        title="授权"
        @ok="handleGrantOk"
        @cancel="handleGrantCancel">
        <a-spin :spinning="spinning">
          <s-table
            v-if="grantVisible"
            ref="table"
            size="default"
            rowKey="id"
            :columns="roleColumns"
            :data="loadRoleData"
            :alert="false"
            :rowSelection="roleRowSelection"
            :showPagination="false"
          >
            <span slot="serial" slot-scope="text, record, index">
              {{ index + 1 }}
            </span>
            <span slot="createTime" slot-scope="text">
              {{ moment(text).format('YYYY-MM-DD HH:mm:ss') }}
            </span>
            <span slot="status" slot-scope="text">
              <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />
            </span>
          </s-table>
        </a-spin>
      </a-modal>
      <a-modal
        title="重置密码"
        :visible="resetPasswordModalVisible"
        @ok="doResetPassword"
        @cancel="cancelResetPassword"
      >
        <p>
          <a-input v-model="newPassword" placeholder="请输入新密码" />
        </p>
      </a-modal>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import moment from 'moment'
import { Ellipsis, STable } from '@/components'
import { findUser, addUser, editUser, deleteUser, resetUserPassword
  , batchDeleteUser, batchDisableUser
  , batchEnableUser, findRole
  , getUserGrantedRoles, grantUserRoles } from '@/api/manage'

import StepByStepModal from './modules/user/StepByStepModal'
import CreateForm from './modules/user/CreateForm'
import { checkResponse, showResponseErrMsg } from '@/utils/util'

const columns = [
  {
    title: '#',
    scopedSlots: { customRender: 'serial' }
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    scopedSlots: { customRender: 'createTime' },
    sorter: true
  },
  {
    title: '姓名',
    dataIndex: 'name'
  },
  {
    title: '用户名',
    dataIndex: 'username'
  },
  {
    title: '邮箱',
    dataIndex: 'email'
  },
  {
    title: '状态',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' }
  },
  {
    title: '备注',
    dataIndex: 'notes',
    scopedSlots: { customRender: 'notes' }
  },
  {
    title: '操作',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' }
  }
]

const roleColumns = [
  {
    title: '#',
    scopedSlots: { customRender: 'serial' }
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    scopedSlots: { customRender: 'createTime' },
    sorter: true
  },
  {
    title: '角色名称',
    dataIndex: 'name'
  },
  {
    title: '状态',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' }
  },
  {
    title: '备注',
    dataIndex: 'notes',
    scopedSlots: { customRender: 'notes' }
  }
]

const statusMap = {
  0: {
    status: 'processing',
    text: '启用'
  },
  1: {
    status: 'error',
    text: '禁用'
  }
}

export default {
  name: 'RoleTableList',
  components: {
    STable,
    Ellipsis,
    CreateForm,
    StepByStepModal
  },
  data () {
    return {
      moment: moment,
      // create model
      visible: false,
      grantVisible: false,
      confirmLoading: false,
      mdl: null,
      cmd: null,
      title: null,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      columns: columns,
      roleColumns: roleColumns,
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        const requestParameters = Object.assign({}, parameter, this.queryParam)
        if (requestParameters['status'] === 'all') {
          delete requestParameters['status']
        }
        return findUser(requestParameters)
          .then(res => {
            const body = res['body']
            const records = body['records']
            return {
              data: records,
              pageSize: body['size'],
              pageNo: body['current'],
              totalPage: body['pages'],
              totalCount: body['total']
            }
          })
      },
      // 加载数据方法 必须为 Promise 对象
      loadRoleData: parameter => {
        const requestParameters = {}
        return findRole(requestParameters)
          .then(res => {
            const records = res['body']
            return {
              data: records
            }
          })
      },
      selectedRowKeys: [],
      selectedRoleRowKeys: [],
      selectedRows: [],
      selectedRoleRows: [],
      roleData: [],
      selectedKeys: [],
      checkedKeys: [],
      waitGrantRoleUser: null,
      spinning: false,
      resetPasswordModalVisible: false,
      currentRecord: null,
      newPassword: null
    }
  },
  filters: {
    statusFilter (type) {
      return statusMap[type].text
    },
    statusTypeFilter (type) {
      return statusMap[type].status
    }
  },
  created () {
  },
  mounted () {
    this.loadPermissionTree()
  },
  computed: {
    rowSelection () {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange
      }
    },
    roleRowSelection () {
      return {
        selectedRoleRowKeys: this.selectedRoleRowKeys,
        onChange: this.onRoleSelectChange,
        getCheckboxProps: record => ({
          props: {
            defaultChecked: this.roleChecked(record.id)
          }
        })
      }
    }
  },
  methods: {
    roleChecked (roleId) {
      if (!this.selectedRoleRowKeys || !this.selectedRoleRowKeys.length) return false
      let contains = false
      for (let i = 0; i < this.selectedRoleRowKeys.length; i++) {
        if (this.selectedRoleRowKeys[i] === roleId) {
          contains = true
          break
        }
      }
      return contains
    },
    loadPermissionTree () {
      findRole({}).then(res => {
        if (checkResponse(res)) {
          showResponseErrMsg(res, '加载角色数据失败')
          return
        }
        const roleData = res['body']
        this.roleData = roleData || []
      })
    },
    handleAdd () {
      this.mdl = null
      this.visible = true
      this.cmd = 'add'
    },
    handleEdit (record) {
      this.visible = true
      this.mdl = { ...record }
    },
    handleView (record) {
      this.visible = true
      this.mdl = { ...record }
      this.cmd = 'view'
    },
    handleOk () {
      const form = this.$refs.createModal.form
      this.confirmLoading = true
      form.validateFields((errors, formValues) => {
        if (!errors) {
          const values = this.mdl ? Object.assign(this.mdl, formValues) : formValues
          this.cmd = null
          if (values.id > 0) {
            // 修改
            editUser(values).then(res => {
              this.confirmLoading = false
              if (checkResponse(res)) {
                showResponseErrMsg(res, '修改失败')
                return
              }
              this.visible = false
              // 重置表单数据
              form.resetFields()
              // 刷新表格
              this.$refs.table.refresh()

              this.$message.info('修改成功')
            })
          } else {
            // 新增
            addUser(values).then(res => {
              this.confirmLoading = false
              if (checkResponse(res)) {
                showResponseErrMsg(this, res, '新增失败')
                return
              }
              this.visible = false
              // 重置表单数据
              form.resetFields()
              // 刷新表格
              this.$refs.table.refresh()

              this.$message.info('新增成功')
            })
          }
        } else {
          this.confirmLoading = false
        }
      })
    },
    handleCancel () {
      this.visible = false
      this.cmd = null
      const form = this.$refs.createModal.form
      form.resetFields() // 清理表单数据（可不做）
    },
    handleSub (record) {
      if (record.status !== 0) {
        this.$message.info(`${record.no} 订阅成功`)
      } else {
        this.$message.error(`${record.no} 订阅失败，规则已关闭`)
      }
    },
    /**
     * 选择列表中的数据后的回调
     * @param selectedRowKeys 选中的数据key集合
     * @param selectedRows 选中的数据集合
     */
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    /**
     * 选择列表中的数据后的回调
     * @param selectedRowKeys 选中的数据key集合
     * @param selectedRows 选中的数据集合
     */
    onRoleSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRoleRowKeys = selectedRowKeys
      this.selectedRoleRows = selectedRows
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    batchDelete () {
      const _this = this
      this.$confirm({
        title: '确认继续？',
        content: '确认删除选中的数据？数据删除之后将不可恢复！',
        onOk () {
          batchDeleteUser({ idSet: _this.selectedRowKeys }).then(res => {
            _this.$refs.table.refresh()
            this.confirmLoading = false
            if (checkResponse(res)) {
              showResponseErrMsg(res, '删除失败')
              return
            }
            _this.$message.info('删除成功')
          })
        },
        onCancel () {}
      })
    },
    batchEnable () {
      const _this = this
      this.$confirm({
        title: '确认继续？',
        content: '确认启用选中的数据？',
        onOk () {
          batchEnableUser({ idSet: _this.selectedRowKeys }).then(res => {
            _this.$refs.table.refresh()
            this.confirmLoading = false
            if (checkResponse(res)) {
              showResponseErrMsg(res, '启用失败')
              return
            }
            _this.$message.info('启用成功')
          })
        },
        onCancel () {}
      })
    },
    batchDisable () {
      const _this = this
      this.$confirm({
        title: '确认继续？',
        content: '确认禁用选中的数据？',
        onOk () {
          batchDisableUser({ idSet: _this.selectedRowKeys }).then(res => {
            _this.$refs.table.refresh()
            this.confirmLoading = false
            if (checkResponse(res)) {
              showResponseErrMsg(res, '禁用失败')
              return
            }
            _this.$message.info('禁用成功')
          })
        },
        onCancel () {}
      })
    },
    handleGrant (record) {
      this.grantVisible = true
      this.spinning = true
      getUserGrantedRoles({ userId: record.id }).then(res => {
        this.spinning = false
        if (checkResponse(res)) {
          showResponseErrMsg(res, '查询用户授予的角色失败')
          return
        }
        this.selectedRoleRowKeys = res['body'] || []
        this.waitGrantRoleUser = record
      })
    },
    handleGrantCancel () {
      this.grantVisible = false
    },
    handleGrantOk () {
      console.log(this.selectedRoleRowKeys)
      this.spinning = true
      grantUserRoles({ userId: this.waitGrantRoleUser.id, roleIdSet: this.selectedRoleRowKeys }).then(res => {
        this.spinning = false
        if (checkResponse(res)) {
          showResponseErrMsg(res, '授权失败')
          return
        }
        this.$message.info('授权成功')
        this.grantVisible = false
      })
    },
    handleDelete (record) {
      const _this = this
      this.$confirm({
        title: '确认继续？',
        content: '确认删除这条数据？数据删除之后将不可恢复！',
        onOk () {
          deleteUser({ id: record.id }).then(res => {
            _this.$refs.table.refresh()
            this.confirmLoading = false
            if (checkResponse(res)) {
              showResponseErrMsg(this, res, '删除失败')
              return
            }
            _this.$message.info('删除成功')
          })
        },
        onCancel () {}
      })
    },
    onChange (value, dateString) {
      this.queryParam.startDateTime = new Date(dateString[0]).getTime()
      this.queryParam.endDateTime = new Date(dateString[1]).getTime()
    },
    resetPassword (item) {
      this.currentRecord = item
      this.resetPasswordModalVisible = true
    },
    cancelResetPassword () {
      this.currentRecord = null
      this.resetPasswordModalVisible = false
    },
    doResetPassword () {
      const password = this.newPassword ? this.newPassword.trim() : null
      if (!password || password.length < 6 || password.length > 32) {
        this.$message.error('密码不能为空且长度为6~32个字符！')
        return
      }
      resetUserPassword({ id: this.currentRecord.id, newPassword: password }).then(response => {
        if (checkResponse(response)) {
          showResponseErrMsg(this, response, '操作失败')
        } else {
          this.resetPasswordModalVisible = false
          this.$message.info('重置成功')
          this.newPassword = null
        }
      })
    }
  }
}
</script>
