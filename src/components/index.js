// 负责所有全局自定义组件的注册
import PageTools from './PageTools'
import UploadExcel from './UploadExcel'
export default {
  // 写install 会拿到Vue的全局对象
  install(Vue) {
    // 组件的注册
    Vue.component('PageTools', PageTools)
    // 注册后 代码需要在main.js new Vue之前 被引用
    Vue.component('UploadExcel', UploadExcel)
  }
}

// Vue.use() 会调用install方法
// Vue.use({
//     install(v) {
//       console.log(v)
//     },
//     install1() {
//       alert(1)
//     }
//   })
