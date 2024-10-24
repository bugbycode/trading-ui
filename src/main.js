

import 'element-plus/theme-chalk/dark/css-vars.css'
import 'element-plus/dist/index.css'
import ElementPlus from 'element-plus';
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import { createApp } from 'vue'

import App from './App.vue'

import router from './router'

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.use(router)
app.use(ElementPlus)
app.mount('#app')
