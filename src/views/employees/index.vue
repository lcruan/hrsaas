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
          <el-button size="small" type="danger" @click="exportData">excel导出</el-button>
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
            <el-button type="text" size="small" @click="$router.push(`/employees/detail/${row.id}`)">查看</el-button>
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
import { formatDate } from '@/filters'
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
    },
    exportData() {
      const headers = {
        '姓名': 'username',
        '手机号': 'mobile',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      // 导出excel
      import('@/vendor/Export2Excel').then(async excel => {
        // excel是引入文件的导出对象
        // 导出 header从哪里来 --Object.keys(headers)
        // data从哪里来
        // 现在没有一个接口获取所有数据
        // 获取员工接口 页码 每页条数 100
        const { rows } = await getEmployeeList({ page: 1, size: this.page.total })
        const data = this.formatJson(headers, rows) // 返回的data就是导出的结构
        const multiHeader = [['姓名', '主要信息', '', '', '', '', '部门']]
        const merges = ['A1:A2', 'B1:F1', 'G1:G2']
        excel.export_json_to_excel({
          header: Object.keys(headers),
          data,
          filename: '员工资料表',
          multiHeader, // 复杂表头
          merges // 合并选项
        })

        // excel.export_json_to_excel({
        //   header: ['姓名', '工资'],
        //   data: [['张三', '3000'], ['李四', '5000']],
        //   filename: '员工工资表'
        // })
        // [{username:'张三'},{mobile:13323412312}] => [[]]
        // 转换 数据结构 还要和表头的顺序对应上
        // 要求转出的标题是中文
      })
    },
    // 将表头数据和数据进行对应
    // [{}] ->转换为 [[]]
    formatJson(headers, rows) {
      return rows.map(item => {
        // item是一个对象 {mobile: 131222}
        // Object.keys(headers) ['手机号', '姓名', '入职日期']
        return Object.keys(headers).map(key => {
          // headers[key] 是所对应的英文名 -> mobile
          // 需要判断 字段
          if (headers[key] === 'timeOfEntry' || headers[key] === 'correctionTime') {
            // 格式化日期
            return formatDate(item[headers[key]])
          } else if (headers[key] === 'formOfEmployment') {
            const obj = EmployeeEnum.hireType.find(obj => obj.id === item[headers[key]])
            return obj ? obj.value : '未知'
          }
          return item[headers[key]] // ['132','张三','','']
        })
      })
      // return rows.map(item => Object.keys(headers).map(key => item[headers[key]]))
    }
  }
}
</script>

  <style>

  </style>
