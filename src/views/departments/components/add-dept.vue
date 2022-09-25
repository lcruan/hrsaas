<template>
  <!-- 放置弹层组件 -->
  <el-dialog :title="showTitle" :visible="showDialog" @close="btnCancel">
    <!-- 表单数据 label-width设置标题的宽度 -->
    <el-form ref="deptForm" label-width="120px" :model="formData" :rules="rules">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="formData.name" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="formData.code" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <!-- native修饰符 可以找到原生元素的事件 -->
        <el-select v-model="formData.manager" style="width:80%" placeholder="请选择" @focus="getEmployeeSimple">
          <el-option v-for="item in peoples" :key="item.id" :label="item.username" :value="item.username" />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="formData.introduce" style="width:80%" type="textarea" :rows="3" placeholder="1-300个字符" />
      </el-form-item>
    </el-form>
    <!-- 确定和取消 -->
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button type="primary" size="small" @click="btnOK">确定</el-button>
        <el-button size="small" @click="btnCancel">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getDepartments, addDepartments, getDepartDetail, updateDepartments } from '@/api/departments'
import { getEmployeeSimple } from '@/api/employees'
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    treeNode: {
      type: Object,
      default: null
    }
  },
  data() {
    // 检查部门名称是否重复
    const checkNameRepeat = async(rule, value, callback) => {
      // value 是部门名称 要去和同级部门去比较 有没有相同的 有相同的 不能过，不相同就可以过
      const { depts } = await getDepartments()
      // 去找同级部门下 有没有和value相同的数据
      // 找到同级部门的所有的子部门
      let isRepeat = false
      if (this.formData.id) {
        // 有id就是编辑模式
        // 编辑的数据 在数据库里有！！！ 同级部门下  我的名字不能和其他同级部门的名字进行重复
        // 首先找到我的同级部门 this.formData.id  就是我当前的id 我的pid this.formData.pid
        // depts.filter(item => item.pid === this.formData.pid)
        // 同级部门下除了我之外的所有的部门
        isRepeat = depts.filter(item => item.pid === this.treeNode.pid && item.id !== this.treeNode.id).some(item => item.name === value)
      } else {
        // 没有id就是新增模式
        isRepeat = depts.filter(item => item.pid === this.treeNode.id).some(item => item.name === value)
      }
      // 如果isRepeat为true 表示找到一样的名字
      isRepeat ? callback(new Error(`同级部门下已经存在${value}部门了`)) : callback()
    }
    const checkCodeRepeat = async(rule, value, callback) => {
      const { depts } = await getDepartments()
      let isRepeat = false
      if (this.formData.id) {
        // 编辑模式
        // 要求是不能有一样的code 先把自己排除
        isRepeat = depts.filter(item => item.id !== this.treeNode.id).some(item => item.code === value && value)
      } else {
        isRepeat = depts.some(item => item.code === value && value)
      }
      // 要求编码 和所有部门编码都不能重复 由于历史数据有可能 没有code 所以说这里加一个强制性条件 就是value值不为空
      isRepeat ? callback(new Error(`组织架构下已经存在这个${value}编码了`)) : callback()
    }
    return {
      // 定义一个表单数据
      formData: {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      },
      // 校验规则
      rules: {
        name: [
          {
            trigger: 'blur', required: true, message: '部门名称不能为空'
          },
          {
            min: 1, max: 50, trigger: 'blur', message: '部门名称长度为1~50个字符'
          },
          {
            trigger: 'blur', validator: checkNameRepeat
          }
        ],
        code: [
          {
            trigger: 'blur', required: true, message: '部门编码不能为空'
          },
          {
            min: 1, max: 50, trigger: 'blur', message: '部门编码长度为1~50个字符'
          },
          {
            trigger: 'blur', validator: checkCodeRepeat
          }
        ],
        manager: [
          {
            trigger: 'blur', required: true, message: '部门负责人不能为空'
          }
        ],
        introduce: [
          {
            trigger: 'blur', required: true, message: '部门介绍不能为空'
          },
          {
            min: 1, max: 300, trigger: 'blur', message: '部门介绍长度为1~300个字符'
          }
        ]
      },
      peoples: []
    }
  },
  computed: {
    showTitle() {
      return this.formData.id ? '编辑部门' : '新增子部门'
    }
  },
  methods: {
    async getEmployeeSimple() {
      this.peoples = await getEmployeeSimple()
    },
    // 获取详情方法
    async getDepartDetail(id) {
      this.formData = await getDepartDetail(id)
      // 因为我们是父组件调用子组件的方法 先设置了node数据 直接调用方法
      // props传值是异步的，你刚调用这个方法的时候，props的值可能还没过来 this.treeNode.id可能取不到
    },
    btnOK() {
      // 手动校验表单
      this.$refs.deptForm.validate(async isOK => {
        if (isOK) {
          // 表单校验通过
          if (this.formData.id) {
            // 编辑
            await updateDepartments(this.formData)
          } else {
            // 这里我们将id设置成了我的pid
            await addDepartments({ ...this.formData, pid: this.treeNode.id })
          }
          // 告诉父组件
          this.$emit('addDepts') // 触发一个自定义事件
          // 此时应该去修改showDialog值
          // update:props名称
          this.$emit('update:showDialog', false)
          // 关闭dialog的时候 会触发el-dialog的close事件，所以不需要再单独的重置数据了
        }
      })
    },
    btnCancel() {
      // 重置数据，因为resetFields 只能重置表单上的数据 非表单上的 比如 编辑的id不能重置
      this.formData = {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      }
      // 关闭弹层
      this.$emit('update:showDialog', false)
      // 清除之前的校验 可以重置数据 只能重置 定义在data中的数据
      this.$refs.deptForm.resetFields()
    }
  }
}
</script>

<style>

</style>
