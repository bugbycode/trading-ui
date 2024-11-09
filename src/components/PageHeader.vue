<template>
    <el-row>
        <el-col :span="12">
            <ul class="lineH-right headUl">
                <el-text class="headerTitle">
                    <el-icon style="vertical-align: -5px;"><PieChart /></el-icon> 数字货币永续合约分析平台
                </el-text>
            </ul>
        </el-col>
        <el-col :span="12">
            <ul class="userIcon">
                <el-text class="userInfo">
                    <el-icon class="handStyle usernameStyle" @click="dialogSettingFormVisible = true"><Setting /></el-icon>
                    <el-icon><UserFilled /></el-icon>
                    <span class="handStyle usernameStyle" @click="dialogFormVisible = true">{{maskEmail(username)}}</span>
                    <el-icon class="handStyle" @click="logout"><Lock /></el-icon>
                </el-text>
            </ul>
        </el-col>
    </el-row>
    <!--修改密码表单START-->
    <el-dialog v-model="dialogFormVisible" title="重置密码" width="500">
        <el-form :model="form">
            <el-form-item label="旧密码" :label-width="formLabelWidth" >
                <el-input @keyup.enter="changePwd" type="password" v-model="form.oldPwd" placeholder="请输入旧密码" autocomplete="off" show-password clearable/>
            </el-form-item>
            <el-form-item label="新密码" :label-width="formLabelWidth">
                <el-input @keyup.enter="changePwd" type="password" v-model="form.newPwd" placeholder="请输入新密码" autocomplete="off" show-password clearable/>
            </el-form-item>
            <el-form-item label="确认密码" :label-width="formLabelWidth">
                <el-input @keyup.enter="changePwd" type="password" v-model="form.confirmPwd" placeholder="请确认新密码" autocomplete="off" show-password clearable/>
            </el-form-item>
        </el-form>
        <template #footer>
        <div class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取消</el-button>
            <el-button type="primary" @click="changePwd">
                重置
            </el-button>
        </div>
        </template>
    </el-dialog>
    <!--修改密码表单END-->

    <!--修改用户信息表单START-->
    <el-dialog v-model="dialogSettingFormVisible" title="系统设置" width="500">
        <el-form :model="settingForm">
            <el-form-item label="订阅AI分析" :label-width="settingLabelWidth" >
                <el-radio-group v-model="settingForm.subscribeAi" size="small">
                    <el-radio-button label="开启" :value="1" />
                    <el-radio-button label="关闭" :value="0"/>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <template #footer>
        <div class="dialog-footer">
            <el-button @click="dialogSettingFormVisible = false">取消</el-button>
            <el-button type="primary" @click="changeSetting">
                确定
            </el-button>
        </div>
        </template>
    </el-dialog>
    <!--修改用户信息表单END-->

</template>
<script setup>
    import { ElMessageBox, ElMessage } from 'element-plus'
    import { useRoute, useRouter } from 'vue-router'

    import {ref, onMounted ,reactive} from 'vue'
    import axios from './../axios'
    var username = ref('')
    const router = useRouter()
    //修改密码表单 start=======================
    const dialogFormVisible = ref(false);
    const formLabelWidth = '80px'
    var form = reactive({
        oldPwd: '',//旧密码
        newPwd: '',//新密码
        confirmPwd: '',//确认新密码
    })

    const changePwd = () => {
        if(form.oldPwd == ''){
            ElMessage.error({message: '请输入旧密码', offset: (window.innerHeight / 2)});
        } else if(form.newPwd == ''){
            ElMessage.error({message: '请输入新密码', offset: (window.innerHeight / 2)});
        } else if(form.confirmPwd == ''){
            ElMessage.error({message: '请确认新密码', offset: (window.innerHeight / 2)});
        } else if(form.newPwd != form.confirmPwd){
            ElMessage.error({message: '两次输入的新密码不一致', offset: (window.innerHeight / 2)});
        } else {
            var formData = new FormData();
            formData.append('oldPwd',form.oldPwd)
            formData.append('newPwd',form.newPwd)
            axios.post('/user/changPwd',formData).then(function(result){
                if(result.code == 1){
                    ElMessage.error({message: result.message, offset: (window.innerHeight / 2)});
                } else if(result.code == 0){
                    ElMessage.success({message: result.message, offset: (window.innerHeight / 2)});
                    dialogFormVisible.value = false;
                    form.oldPwd = '';
                    form.newPwd = '';
                    form.confirmPwd = '';
                }
            }).catch(function(err){
                ElMessage.error({message: err, offset: (window.innerHeight / 2)});
            });
        }
    }
    //修改密码表单 end=======================

    //设置用户信息表单start ==================

    var dialogSettingFormVisible = ref(false);
    const settingLabelWidth = '85px'
    var settingForm = reactive({
        subscribeAi: 0,
    });

    const changeSetting = () => {
        axios.post('/user/changeSubscribeAi/' + settingForm.subscribeAi).then(function(result){
            if(result.code == 1){
                ElMessage.error({message: result.message, offset: (window.innerHeight / 2)});
            } else if(result.code == 0){
                ElMessage.success({message: result.message, offset: (window.innerHeight / 2)});
            }
        }).catch(function(err){
            ElMessage.error({message: err, offset: (window.innerHeight / 2)});
        });
    }

    //设置用户信息表单end ==================

    onMounted(()=>{
        getUserInfo();
    })

    const getUserInfo = () =>{
        axios.get('/user/userInfo').then(function(result){
            username.value = result.username;
            settingForm.subscribeAi = result.subscribeAi;
        }).catch(function(err){
            
        })
    }

    const logout = async() => {
        ElMessageBox.confirm( '确定要退出登录吗？', '温馨提示',
            {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'warning',
            }
        ).then(() => {
            axios.get('/logout').then(function(result){
                router.push('/login')
            }).catch(function(err){
                console.log(err);
                router.push('/login')
            });
        }).catch(() => {
            
        })
        
    }

    const maskEmail = (email) => {
      const [username, domain] = email.split('@');
      return `${username.slice(0, 3)}***@${domain}`;
    }
</script>
<style scoped>

.headUl{
    padding-left: 0px;
}
.headerTitle{
    font-weight: bolder;
    font-family: 隶书;
    padding: 0px;
    font-size: 30px;
}
.userIcon{
    float: right;
}
.userInfo{
    font-size: 20px;
}
.handStyle{
    cursor: pointer
}
.usernameStyle{
    margin: 0px 5px;
}
</style>