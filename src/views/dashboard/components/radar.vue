<template>
  <!-- 雷达图 -->
  <div ref="myDiv" class="radar-echart" />
</template>

<script>
// 完成加载
// var echarts = require('echarts')
var echarts = require('echarts/lib/echarts') // 引入echarts主模块
require('echarts/lib/chart/radar') // 引入雷达图
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
require('echarts/lib/component/legend')
export default {
//   created() {
//     // created是实例创建完毕 页面还没渲染完毕
//   },
  // 页面渲染完毕(页面挂载dom元素)
  mounted() {
    const myChart = echarts.init(this.$refs.myDiv) // 得到图表实例
    myChart.setOption({
      title: {
        text: 'Basic Radar Chart'
      },
      tooltip: {},
      legend: {
        data: ['Allocated Budget', 'Actual Spending']
      },
      radar: {
        // shape: 'circle',
        // 每个区域的最高值
        indicator: [
          { name: '工作效率', max: 100 },
          { name: '考勤', max: 100 },
          { name: '积极性', max: 100 },
          { name: '帮助同事', max: 100 },
          { name: '自主学习', max: 100 },
          { name: '正确率', max: 100 }
        ]
      },
      series: [
        {
          name: 'Budget vs spending',
          type: 'radar',
          data: [
            {
              value: [10, 1, 100, 5, 100, 0],
              name: '张三'
            },
            {
              value: [50, 50, 50, 50, 50, 10],
              name: '李四'
            }
          ]
        }
      ]
    })
  }
}
</script>

<style>
    .radar-echart {
        width: 600px;
        height: 400px;
    }
</style>
