<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 组织架构内容 头部-->
      <!-- <el-card>就是div -->
      <el-card class="tree-card">
        <!-- 放置结构内容 -->
        <tree-tools :tree-node="company" :is-root="true" @addDepts="addDepts" />
        <!-- 放置一个el-tree -->
        <el-tree :data="departs" :props="defaultProps" :default-expand-all="true">
          <!-- 传入内容 插槽内容会循环多次 有多少节点就循环多少次 -->
          <!-- 作用域插槽： slot-scope = "obj" 接收传递给插槽的数据 data其实就是每个节点的数据对象-->
          <tree-tools slot-scope="{ data }" :tree-node="data" @delDepts="getDepartments" @addDepts="addDepts" @editDepts="editDepts" />
        </el-tree>
      </el-card>
    </div>
    <!-- 放置新增弹层组件 -->
    <add-dept ref="addDept" :show-dialog.sync="showDialog" :tree-node="node" @addDepts="getDepartments" />
  </div>
</template>

<script>
import TreeTools from './components/tree-tools'
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils'
import AddDept from './components/add-dept.vue'
export default {
  components: {
    TreeTools,
    AddDept
  },
  data() {
    return {
      company: { }, // 就是头部数据结构
      departs: [],
      defaultProps: {
        label: 'name',
        children: 'children'
      },
      showDialog: false, // 默认不显示
      node: null // 记录当前点击的node节点
    }
  },
  created() {
    this.getDepartments()
  },
  methods: {
    async getDepartments() {
      const result = await getDepartments()
      console.log(result)
      this.company = { name: result.companyName, manager: '负责人', id: '' }
      this.departs = tranListToTreeData(result.depts, '') // 需要将其转换为树形结构
    },
    // 监听tree-ttols中触发的点击添加子部门的事件
    // node 是当前点击的部门
    addDepts(node) {
      this.showDialog = true // 显示弹层
      this.node = node
    },
    editDepts(node) {
      this.showDialog = true // 弹出层
      this.node = node
      // 应该在这里调用获取部门详情的方法
      this.$refs.addDept.getDepartDetail(node.id)
    }
  }
}
</script>

  <style scoped>
.tree-card {
  padding: 30px  140px;
  font-size:14px;
}
  </style>
