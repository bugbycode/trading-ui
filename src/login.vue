<template>
<section> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>

   <div class="signin"> 

    <div class="content"> 

     <h2>欢迎使用</h2> 

     <div class="form"> 

      <div class="inputBox"> 

       <input type="text" @keyup.enter="login" v-model="userInput" required> <i>账号</i> 

      </div> 

      <div class="inputBox"> 

       <input type="password" @keyup.enter="login" v-model="passInput" required> <i>密码</i> 

      </div> 
      <!--
      <div class="links"> <a href="#">Forgot Password</a> <a href="#">Signup</a> 

      </div> -->

      <div class="inputBox"> 

       <input type="submit" value="登录" @click="login"> 

      </div> 

     </div> 

    </div> 

   </div> 

  </section> <!-- partial --> 
</template>
<script lang="ts" setup>
    import axios from './axios';
    import { ref, onMounted} from 'vue'
    import { ElMessage } from 'element-plus'
    import { computed } from 'vue'
    import { useRoute, useRouter } from 'vue-router'

    const router = useRouter()
    const route = useRoute()
    
    onMounted(() =>{
      
    })

    //登录表单信息
    var userInput = ref('');
    var passInput = ref('');

    const login = async () => {
      var username = userInput.value;
      var password = passInput.value;
      
      if(username.trim() == ''){
        ElMessage.error({message: '请输入账号', offset: (window.innerHeight / 2) - 50});
      } else if(password == ''){
        ElMessage.error({message: '请输入密码', offset: (window.innerHeight / 2) + 20});
      } else {
        const formData = new FormData();
        formData.append('username', username.trim());
        formData.append('password', password);
        axios.post('/login',formData,{
          headers: {
            'Content-Type': 'multipart/form-data' // 明确指定 Content-Type
          }
        }).then(function(result){
          //console.log(result)
          if(result.status == 200){
            router.push('/')
          } else {
            ElMessage.error({message: result.message, offset: (window.innerHeight / 2)});
          }
        }).catch(function(e){
          ElMessage.error({message: e, offset: (window.innerHeight / 2)});
        })
        
      }
      
    }
</script>
<style scoped>
@import './assets/login.css'
</style>