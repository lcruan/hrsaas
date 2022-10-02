<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 放置内容 -->
      <el-card>
        <el-tabs>
          <el-tab-pane label="角色管理">
            <!-- 左侧的内容 -->
            <el-row style="height:60px;">
              <el-button type="primary" icon="el-icon-plus" size="small" @click="showDialog = true">新增角色</el-button>
            </el-row>
            <el-table border :data="list">
              <el-table-column align="center" type="index" label="序号" width="120" />
              <el-table-column align="center" prop="name" label="名称" width="240" />
              <el-table-column align="center" prop="description" label="描述" />
              <el-table-column align="center" label="操作">
                <!-- 作用域插槽 -->
                <template slot-scope="{ row }">
                  <el-button size="small" type="success" @click="assignPerm(row.id)">分配权限</el-button>
                  <el-button size="small" type="primary" @click="editRole(row.id)">编辑权限</el-button>
                  <el-button size="small" type="danger" @click="deleteRole(row.id)">删除权限</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 放置分页组件 -->
            <el-row type="flex" justify="center" style="height: 60px;" align="middle">
              <el-pagination
                :total="page.total"
                :page-size="page.pagesize"
                :current-page="page.page"
                layout="prev, pager, next"
                @current-change="changePage"
              />
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="公司信息">
            <!-- 提示消息 -->
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              show-icon
              :closable="false"
            />
            <!-- 右侧的内容 -->
            <el-form label-width="120px" style="margin-top:50px">
              <el-form-item label="公司名称">
                <el-input v-model="formData.name" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input v-model="formData.companyAddress" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="formData.mailbox" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="formData.remarks" type="textarea" :rows="3" disabled style="width:400px" />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
    <!-- 放置弹层组件 -->
    <!-- close事件 在点击确定的时候也会触发 -->
    <el-dialog :title="showTitle" :visible="showDialog" @close="btnCancel">
      <el-form ref="roleForm" :model="roleForm" :rules="rules" label-width="120px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name" />
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input v-model="roleForm.description" />
        </el-form-item>
      </el-form>
      <!-- 放置footer插槽 -->
      <el-row type="flex" justify="center">
        <el-col :span="8">
          <el-button size="small" @click="btnCancel">取消</el-button>
          <el-button type="primary" size="small" @click="btnOK">确定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <!-- 放置一个弹层 -->
    <el-dialog title="分配权限" :visible="showPermDialog">
      <!-- 权限是一棵树 -->
      <!-- 将数据绑定到组件上 -->
      <!-- check-strictly 表示父子勾选时 不互相关联 -->
      <!-- id作为唯一标识 -->
      <el-tree
        :data="permData"
        :props="defaultProps"
        :default-expand-all="true"
        show-checkbox
        check-strictly
        node-key="id"
        :default-checked-keys="selectCheck"
      />
      <!-- 确定取消 -->
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
import { getRoleList, getCompanyInfo, deleteRole, getRoleDetail, updateRole, addRole } from '@/api/setting'
import { getPermissionList } from '@/api/permisson'
import { tranListToTreeData } from '@/utils'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      list: [], // 承接我们的数组
      page: { // 放置页码及相关数据
        page: 1,
        pagesize: 10,
        total: 0 // 记录默认总数
      },
      formData: {
        // 公司信息
      },
      showDialog: false,
      showPermDialog: false,
      roleForm: {
        name: '',
        description: ''
      },
      rules: {
        name: { required: true, message: '角色名称不能为空', trigger: 'blur' }
      },
      permData: [], // 接收权限数据
      defaultProps: {
        label: 'name'
      },
      roleId: null, // 用来记录当前分配权限的id
      selectCheck: [] // 用来记录当前权限点的标识
    }
  },
  computed: {
    ...mapGetters(['companyId']),
    showTitle() {
      return this.roleForm.id ? '编辑角色' : '新增角色'
    }
  },
  created() {
    this.getRoleList()
    this.getCompanyInfo()
  },
  methods: {
    async getRoleList() {
      const { total, rows } = await getRoleList(this.page)
      this.page.total = total
      this.list = rows
    },
    changePage(newPage) {
      this.page.page = newPage
      this.getRoleList()
    },
    async getCompanyInfo() {
      this.formData = await getCompanyInfo(this.companyId)
    },
    async deleteRole(id) {
      // 提示
      try {
        await this.$confirm('确认删除该角色吗？')
        // 点击了确定 才能进入到下方
        await deleteRole(id)
        this.getRoleList()
        this.$message.success('删除角色成功！')
      } catch (error) {
        console.log(error)
      }
    },
    async editRole(id) {
      this.roleForm = await getRoleDetail(id)
      this.showDialog = true
    },
    btnCancel() {
      this.roleForm = {
        name: '',
        description: ''
      }
      // 移除校验
      this.$refs.roleForm.resetFields()
      this.showDialog = false
    },
    async btnOK() {
      try {
        await this.$refs.roleForm.validate()
        // 只有校验通过的情况下 才会执行await下方的内容
        // roleForm 这个对象有id就是编辑 没有id就是新增
        if (this.roleForm.id) {
          await updateRole(this.roleForm)
        } else {
          // 新增
          await addRole(this.roleForm)
        }

        this.getRoleList()
        this.$message.success('操作成功！')
        this.showDialog = false // 关闭弹层 =》 触发el-dialog的close事件
      } catch (error) {
        console.log(error)
      }
    },
    // 获取权限点数据 在点击的时候调用获取权限点数据
    async assignPerm(id) {
      this.permData = tranListToTreeData(await getPermissionList(), '0') // 转换list到树形数据
      this.roleId = id
      // 有id 先记录id
      const { permIds } = await getRoleDetail(id) // 当前角色有拥有的权限点数据
      this.selectCheck = permIds // 将当前角色所拥有的权限id赋值
      this.showPermDialog = true
    }
  }
}
</script>

  <style>

  </style>
