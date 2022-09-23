<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 组织架构内容 头部-->
      <!-- <el-card>就是div -->
      <el-card class="tree-card">
        <!-- 放置结构内容 -->
        <el-row type="flex" justify="space-between" align="middle" style="height:40px;">
          <el-col>
            <!-- 左侧内容 -->
            <span>江苏传智播客教育科技股份有限公司</span>
          </el-col>
          <el-col :span="4">
            <!-- 右侧内容 -->
            <el-row type="flex" justify="end">
              <el-col>负责人</el-col>
              <el-col>
                <!-- 下拉菜单 -->
                <el-dropdown>
                  <!-- 内容 -->
                  <span>操作
                    <i class="el-icon-arrow-down" />
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <!-- 下拉选项 -->
                    <el-dropdown-item>添加子部门</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <!-- 放置一个el-tree -->
        <el-tree :data="departs" :props="defaultProps" :default-expand-all="true">
          <!-- 传入内容 插槽内容会循环多次 有多少节点就循环多少次 -->
          <el-row type="flex" justify="space-between" align="middle" style="height:40px;width: 100%;">
            <el-col>
              <!-- 左侧内容 -->
              <span>江苏传智播客教育科技股份有限公司</span>
            </el-col>
            <el-col :span="4">
              <!-- 右侧内容 -->
              <el-row type="flex" justify="end">
                <el-col>负责人</el-col>
                <el-col>
                  <!-- 下拉菜单 -->
                  <el-dropdown>
                    <!-- 内容 -->
                    <span>操作
                      <i class="el-icon-arrow-down" />
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <!-- 下拉选项 -->
                      <el-dropdown-item>添加子部门</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-tree>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      departs: [
        { name: '总裁办', children: [{ name: '董事会' }] },
        { name: '行政部' }, { name: '人事部' }],
      defaultProps: {
        label: 'name',
        children: 'children'
      }
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
