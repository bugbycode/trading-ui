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
      <div class="inputBox" v-if="hostname != 'localhost' && hostname != '127.0.0.1'">
        <!--<div class="g-recaptcha" data-sitekey="6LfFqqgqAAAAABzTIIXG14jhLL-Gwr1nFVvCrpi0" data-theme="dark"></div>-->
        <vueRecaptcha 
          sitekey="6LfFqqgqAAAAABzTIIXG14jhLL-Gwr1nFVvCrpi0"
          @verify="recaptchaVerify"
		      @expire="recaptchaExpired"
		      @fail="recaptchaFailed"
		      @error="recaptchaError"
          ref="gcha"
          ></vueRecaptcha>
      </div>
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
    import vueRecaptcha from 'vue3-recaptcha2';

    const router = useRouter()
    const route = useRoute()

    // reCAPTCHA v2 验证 =======================START
    const gcha = ref(null);
    //验证返回
    const recaptchaVerify = (response)=>{
      //console.log(response);
      cha_response.value = response;
    }
    //验证过期
    const recaptchaExpired = ()=>{
      if(gcha.value) {
        gcha.value.reset();
      }
      cha_response.value = '';
    }
    //验证失败 
    const recaptchaFailed = ()=>{
      recaptchaExpired();
    }
    //验证错误
    const recaptchaError = ()=>{
      recaptchaExpired();
    }
    // reCAPTCHA v2 验证 =======================END

    onMounted(() =>{
      
    })

    const hostname = document.location.hostname;
    
    //登录表单信息
    var userInput = ref('');
    var passInput = ref('');
    var cha_response = ref('');
    const login = async () => {
      var username = userInput.value;
      var password = passInput.value;
      var cha_responseValue = cha_response.value;
      if(username.trim() == ''){
        ElMessage.error({message: '请输入账号', offset: (window.innerHeight / 2) - 50});
      } else if(password == ''){
        ElMessage.error({message: '请输入密码', offset: (window.innerHeight / 2) + 20});
      } else if(cha_responseValue == '' && hostname != 'localhost' && hostname != '127.0.0.1') {
        ElMessage.error({message: '请先验证人机身份', offset: (window.innerHeight / 2) - 50});
      } else {
        const formData = new FormData();
        formData.append('username', username.trim());
        formData.append('password', password);
        formData.append('cha_response',cha_responseValue);
        axios.post('/login',formData,{
          headers: {
            'Content-Type': 'multipart/form-data' // 明确指定 Content-Type
          }
        }).then(function(result){
          recaptchaExpired();
          //console.log(result)
          if(result.status == 200){
            router.push('/')
          } else {
            ElMessage.error({message: result.message, offset: (window.innerHeight / 2)});
          }
        }).catch(function(e){
          recaptchaExpired();
          ElMessage.error({message: e, offset: (window.innerHeight / 2)});
        })
        
      }
      
    }
</script>
<style scoped>
  @import './assets/login.css'
</style>