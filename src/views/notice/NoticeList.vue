<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="公告标题">
                <a-input allowClear v-model="queryParam.id" placeholder=""/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="发布时间">
                <a-range-picker />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <span class="table-page-search-submitButtons">
                <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
                <a-button style="margin-left: 8px" @click="() => this.queryParam = {}">重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <div class="table-operator">
        <a-button type="primary" icon="plus" @click="handleAdd">新建</a-button>
      </div>

      <a-table
        ref="table"
        size="default"
        rowKey="id"
        :columns="columns"
        :data-source="[]"
      >
        <span slot="serial" slot-scope="text, record, index">
          {{ index + 1 }}
        </span>
        <span slot="description" slot-scope="text">
          <ellipsis :length="4" tooltip>{{ text }}</ellipsis>
        </span>

        <span slot="action">
          <template>
            <a-divider type="vertical" />
          </template>
        </span>
      </a-table>
      <a-pagination
        v-model="pagination.pageNo"
        :total="pagination.total"
        showQuickJumper
        showSizeChanger
        :show-total="total => `共 ${pagination.total} 条记录`"
        style="float: right; margin: 10px 5px 0 0"
      />
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { STable, Ellipsis } from '@/components'

const columns = [
  {
    title: '#',
    scopedSlots: { customRender: 'serial' }
  },
  {
    title: '规则编号',
    dataIndex: 'no'
  },
  {
    title: '描述',
    dataIndex: 'description',
    scopedSlots: { customRender: 'description' }
  },
  {
    title: '服务调用次数',
    dataIndex: 'callNo',
    sorter: true,
    needTotal: true,
    customRender: (text) => text + ' 次'
  },
  {
    title: '状态',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' }
  },
  {
    title: '更新时间',
    dataIndex: 'updatedAt',
    sorter: true
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '150px',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'NoticeList',
  components: {
    STable,
    Ellipsis
  },
  data () {
    this.columns = columns
    return {
      // 查询参数
      queryParam: {},
      columns: columns,
      pagination: {
        pageNo: 1,
        total: 31
      }
    }
  },
  created () {
  }
}
</script>
