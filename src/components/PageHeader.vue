<template>
    <el-row>
        <el-col :span="12">
            <ul class="lineH-right headUl">
                <el-text class="headerTitle">
                    <el-icon><PieChart /></el-icon> 永续合约交易分析平台
                </el-text>
            </ul>
        </el-col>
        <el-col :span="12">
            <ul class="userIcon">
                <el-text class="userInfo">
                <el-icon><UserFilled /></el-icon>
                <span class="handStyle usernameStyle">{{username}}</span>
                <el-icon class="handStyle" @click="logout"><Lock /></el-icon>
            </el-text>
            </ul>
        </el-col>
    </el-row>
</template>
<script setup>
    import { useRoute, useRouter } from 'vue-router'

    import {ref, onMounted} from 'vue'
    import axios from './../axios'
    var username = ref('')
    const router = useRouter()

    onMounted(()=>{
        checkLoginStatus();
        getUserInfo();
    })

    const getUserInfo = async () =>{
        
        var user = await axios.get('/user/userInfo');
        //console.log(user);
        username.value = user.username;
    }

    const checkLoginStatus = async() => {
      var user = await axios.get('/user/userInfo');
      if(!(user && user.username)){
          router.push('/login')
      }
    }

    const logout = async() => {
        await axios.get('/logout');
        checkLoginStatus()
    }
</script>
<style scoped>
.headUl{
    padding-left: 0px;
}
.headerTitle{
    font-weight: bolder;
    font-family: 楷体;
    color: black;
    padding: 0px;
    font-size: 30px;
}
.userIcon{
    float: right;
}
.userInfo{
    color: black;
    font-size: 20px;
}
.handStyle{
    cursor: pointer
}
.usernameStyle{
    margin: 0px 5px;
}
</style>