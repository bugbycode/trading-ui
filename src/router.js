import { createWebHashHistory , createRouter } from 'vue-router'

import HomeView from './components/PageLayout.vue'
import LoginView from './login.vue'

import axios from './axios'

const routes = [
    {
        path: '/', name: 'home', component: HomeView
    },{
        path: '/login', name: 'login', component: LoginView
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

const checkOnline = (call) => {
    axios.get('/user/userInfo').then(function(result){
        call(result,null);
    }).catch(function(err){
        call(null,err);
    })
}

router.beforeEach((to,from,next)=>{
    checkOnline(function(result,err){
        if(to.name == 'login'){
            if(result && result.username){
                router.push('/')
            } else {
                next();
            }
        } else if(result && result.username){
            next();
        } else {
            router.push('/login')
        }
    })
})

export default router;