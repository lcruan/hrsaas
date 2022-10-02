<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 靠右的按钮 -->
      <page-tools>
        <template v-slot:after>
          <el-button type="primary" size="small">添加权限</el-button>
        </template>
        <!-- <el-button slot="after" type="primary" size="small">添加权限</el-button> -->
      </page-tools>
      <!-- 表格 -->
      <!-- row-key="id"指定id位唯一属性 -->
      <el-table :data="list" border row-key="id">
        <el-table-column prop="name" label="名称" />
        <el-table-column align="center" prop="code" label="标识" />
        <el-table-column align="center" prop="description" label="描述" />
        <el-table-column align="center" label="操作">
          <template v-slot="{row}">
            <!-- 添加按钮只在 访问权的层级显示 当type=1时才显示 -->
            <el-button v-if="row.type === 1" type="text">添加</el-button>
            <el-button type="text">编辑</el-button>
            <el-button type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 新增编辑弹层 -->
    <el-dialog :visible="showDialog" title="新增/编辑">
      <el-form label-width="120px">
        <el-form-item label="名称">
          <el-input v-model="formData.name" style="width:90%" />
        </el-form-item>
        <el-form-item label="标识">
          <el-input v-model="formData.code" style="width:90%" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="formData.description" style="width:90%" />
        </el-form-item>
        <el-form-item label="开启">
          <!-- 当值为0时 不激活 -->
          <el-switch
            v-model="formData.enVisible"
            inactive-value="0"
            active-value="1"
          />
        </el-form-item>
      </el-form>
      <!-- 底部确定与取消 -->
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button type="primary" size="small">确定</el-button>
          <el-button size="small">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getPermissionList } from '@/api/permisson'
import { tranListToTreeData } from '@/utils'
export default {
  data() {
    return {
      list: [],
      showDialog: true,
      formData: {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      }
    }
  },
  created() {
    this.getPermissionList()
  },
  methods: {
    async getPermissionList() {
      // 将数据转换成了 带children的树形结构
      this.list = tranListToTreeData(await getPermissionList(), '0')
    }
  }
}
</script>

  <style>

  </style>
