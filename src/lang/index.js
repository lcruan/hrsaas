// 多语言实例化文件
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import Cookie from 'js-cookie' // 引入cookie工具
import elementEN from 'element-ui/lib/locale/lang/en' // 引入饿了么的英文包
import elementZH from 'element-ui/lib/locale/lang/zh-CN' // 引入饿了么的中文包
import customZH from './zh' // 引入自定义中文包
import customEN from './en' // 引入自定义英文包

Vue.use(VueI18n) // 完成全局注册
export default new VueI18n({
  // i18的选项
  //   local决定当前的多语言类型 假设要切换多语言 只需要设置该属性就可以了
  locale: Cookie.get('language') || 'zh', // 指的是当前的多语言的类型 随意定义的字符串 中文zh 英文en
  messages: {
    en: {
      // 语言包 elementUI语言包 + 自定义语言包
      ...elementEN,
      ...customEN
    },
    zh: {
      ...elementZH,
      ...customZH
    }
  } // 指的是当前的语言包
})
