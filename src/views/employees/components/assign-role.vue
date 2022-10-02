<template>
  <el-dialog title="分配角色" :visible="showRoleDialog">
    <!-- 多选框组 -->
    <el-checkbox-group>
      <!-- 要循环的选项 -->
      <el-checkbox label="" />
    </el-checkbox-group>
    <!-- 定义footer插槽 -->
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button size="small" type="primary">确定</el-button>
        <el-button size="small">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
export default {
  props: {
    showRoleDialog: {
      type: Boolean,
      default: false
    },
    userId: {
      // 用户的id 当前要处理的哪个用户
      type: String,
      default: null,
      required: true // 要求必须传id
    }
  }
}
</script>

<style></style>
