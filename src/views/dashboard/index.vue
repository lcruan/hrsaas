<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
    <page-tools :show-before="true">
      <!-- 插槽除了slot="name" v-slot -->
      <!-- slot="名称"  v-slot:名称（外层必须加上一个template） -->
      <!-- <span slot="before">我想你们</span> -->
      <template v-slot:before>
        <span>我想你们</span>
      </template>
      <!-- <el-button slot="after" type="primary">导入excel</el-button> -->
      <template v-slot:after>
        <el-button type="primary">导入excel</el-button>
      </template>

    </page-tools>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name'
    ])
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
