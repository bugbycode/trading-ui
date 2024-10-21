import { createWebHashHistory , createRouter } from 'vue-router'

import HomeView from './components/PageLayout.vue'
import LoginView from './login.vue'
const routes = [
    {
        path: '/', component: HomeView
    },{
        path: '/login', component: LoginView
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

export default router;