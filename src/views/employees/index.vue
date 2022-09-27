<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools :show-before="true">
        <!-- 左侧显示总记录 -->
        <!-- <span slot="before">共16条记录</span> -->
        <template v-slot:before>
          <span>共{{ page.total }}条记录</span>
        </template>
        <!-- 右侧显示按钮 excel导入 excel导出 新增员工 -->
        <template v-slot:after>
          <el-button size="small" type="success" @click="$router.push('/import')">excel导入</el-button>
          <el-button size="small" type="danger">excel导出</el-button>
          <el-button size="small" type="primary" @click="showDialog = true">新增员工</el-button>
        </template>
      </page-tools>
      <!-- 表格组件 -->
      <el-table v-loading="loading" border :data="list">
        <el-table-column align="center" type="index" label="序号" sortable="" width="120" />
        <el-table-column align="center" prop="username" label="姓名" sortable="" />
        <el-table-column align="center" prop="workNumber" label="工号" sortable="" />
        <el-table-column align="center" prop="formOfEmployment" label="聘用形式" :formatter="formatEmployment" sortable="" />
        <el-table-column align="center" prop="departmentName" label="部门" sortable="" />
        <!-- 作用域插槽+过滤器 -->
        <el-table-column align="center" prop="timeOfEntry" label="入职时间" sortable="">
          <template slot-scope="{row}">
            {{ row.timeOfEntry |formatDate }}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="enableState" label="账户状态" sortable="">
          <template slot-scope="{ row }">
            <el-switch :value="row.enableState === 1" />
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" sortable="" fixed="right" width="280">
          <!-- <template slot-scope="{ row }"> -->
          <template v-slot="{ row }">
            <el-button type="text" size="small">查看</el-button>
            <el-button type="text" size="small">转正</el-button>
            <el-button type="text" size="small">调岗</el-button>
            <el-button type="text" size="small">离职</el-button>
            <el-button type="text" size="small">角色</el-button>
            <el-button type="text" size="small" @click="delEmployee(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <el-row type="flex" justify="center" align="middle" style="height: 60px">
        <el-pagination
          layout="prev, pager, next"
          :current-page="page.page"
          :page-size="page.size"
          :total="page.total"
          @current-change="changePage"
        />
      </el-row>
    </div>
    <!-- 放置组件弹窗 -->
    <!-- sync修饰符 子组件 去改变父组件的数据的一个语法糖-->
    <add-employee :show-dialog.sync="showDialog" />
  </div>
</template>

<script>
import { getEmployeeList, delEmployee } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees' // 引入员工的枚举对象
import AddEmployee from './components/add-employee'
export default {
  components: {
    AddEmployee
  },
  data() {
    return {
      list: [],
      page: {
        page: 1,
        size: 10,
        total: 0
      },
      loading: false,
      showDialog: false // 默认是关闭的
    }
  },
  created() {
    this.getEmployeeList()
  },
  methods: {
    async getEmployeeList() {
      this.loading = true
      const { total, rows } = await getEmployeeList(this.page)
      this.page.total = total
      this.list = rows
      this.loading = false
    },
    changePage(newPage) {
      this.page.page = newPage
      this.getEmployeeList()
    },
    // 格式化聘用形式
    formatEmployment(row, column, cellValue, index) {
      // 找1所对应的值
      const obj = EmployeeEnum.hireType.find(item => item.id === cellValue)
      return obj ? obj.value : '未知'
    },
    async delEmployee(id) {
      try {
        await this.$confirm('确定删除该员工？')
        // 点击确定
        await delEmployee(id)
        this.$message.success('删除员工成功！')
        this.getEmployeeList()
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

  <style>

  </style>
