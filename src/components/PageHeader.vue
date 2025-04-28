<template>
    <el-row>
        <el-col :span="8">
            <ul class="lineH-right headUl">
                <el-text class="headerTitle">
                    <el-icon style="vertical-align: -5px;"><PieChart /></el-icon> 数字货币永续合约分析平台
                </el-text>
            </ul>
        </el-col>
        <el-col :span="8">
            <!--<ul class="headUl">
                <el-text class="headerTitle">当前Bot交易胜率：{{ botOrderPnl.winning }}，盈亏金额：{{ botOrderPnl.pnl }} USDT</el-text>
            </ul>-->
        </el-col>
        <el-col :span="8">
            <ul class="userIcon">
                <el-text class="userInfo">
                    <el-icon class="handStyle usernameStyle" @click="showAllShape"><AlarmClock /></el-icon>
                    <el-icon class="handStyle usernameStyle" @click="showBalance"><Wallet /></el-icon>
                    <el-icon class="handStyle usernameStyle" @click="openSettingForm"><Setting /></el-icon>
                    <el-icon class="handStyle usernameStyle" @click="showHmacForm"><Key /></el-icon>
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
    <el-dialog v-model="dialogSettingFormVisible" title="行情分析配置" width="500">
        <el-form :model="settingForm">
            <el-form-item label="价格回撤" :label-width="settingLabelWidth" >
                <el-radio-group v-model="settingForm.fibMonitor" size="small">
                    <el-radio-button label="开启" :value="1" />
                    <el-radio-button label="关闭" :value="0"/>
                </el-radio-group>
            </el-form-item>
            <!--<el-form-item label="行情波动" :label-width="settingLabelWidth" >
                <el-radio-group v-model="settingForm.riseAndFallMonitor" size="small">
                    <el-radio-button label="开启" :value="1" />
                    <el-radio-button label="关闭" :value="0"/>
                </el-radio-group>
            </el-form-item>-->
            <!--<el-form-item label="价格行为" :label-width="settingLabelWidth" >
                <el-radio-group v-model="settingForm.emaMonitor" size="small">
                    <el-radio-button label="开启" :value="1" />
                    <el-radio-button label="关闭" :value="0"/>
                </el-radio-group>
            </el-form-item>-->
            <el-form-item label="指数均线" :label-width="settingLabelWidth" >
                <el-radio-group v-model="settingForm.emaRiseAndFall" size="small">
                    <el-radio-button label="开启" :value="1" />
                    <el-radio-button label="关闭" :value="0"/>
                </el-radio-group>
            </el-form-item>
            <!--<el-form-item label="高低点位" :label-width="settingLabelWidth" >
                <el-radio-group v-model="settingForm.highOrLowMonitor" size="small">
                    <el-radio-button label="开启" :value="1" />
                    <el-radio-button label="关闭" :value="0"/>
                </el-radio-group>
            </el-form-item>-->
            <el-form-item label="盘整区间" :label-width="settingLabelWidth" >
                <el-radio-group v-model="settingForm.areaMonitor" size="small">
                    <el-radio-button label="开启" :value="1" />
                    <el-radio-button label="关闭" :value="0"/>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="量价监控" :label-width="settingLabelWidth" >
                <el-radio-group v-model="settingForm.volumeMonitor" size="small">
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

    <!--修改Hmac Sha256信息表单 START -->
    <el-dialog v-model="dialogHmacFormVisible" title="币安HMAC配置" width="500">
        <el-form :model="settingForm">
            <el-form-item label="公钥信息" :label-width="hmacFormLabelWidth" >
                <el-input v-model="hmacForm.binanceApiKey" clearable/>
            </el-form-item>
            <el-form-item label="私钥信息" :label-width="hmacFormLabelWidth" >
                <el-input v-model="hmacForm.binanceSecretKey" show-password clearable/>
            </el-form-item>
            <el-form-item label="名义价值" :label-width="hmacFormLabelWidth" >
                <el-slider v-model="hmacForm.baseStepSize" :min="1" :max="100" show-input />
            </el-form-item>
            <el-form-item label="杠杆倍数" :label-width="hmacFormLabelWidth" >
                <el-slider v-model="hmacForm.leverage" :min="2" :max="10" show-input />
            </el-form-item>
            <el-form-item label="持仓价值" :label-width="hmacFormLabelWidth" >
                <el-slider v-model="hmacForm.positionValue" :min="50" :max="1000" show-input />
            </el-form-item>
            <el-form-item label="止损比例" :label-width="hmacFormLabelWidth" >
                <el-slider v-model="hmacForm.cutLoss" :step="0.1" :min="1.0" :max="10.0" show-input />
            </el-form-item>
            <el-form-item label="获利预期" :label-width="hmacFormLabelWidth" >
                <el-slider v-model="hmacForm.profit" :step="0.1" :min="0.6" :max="10.0" show-input />
            </el-form-item>
            <el-form-item v-if="hmacForm.tradeStyle == 0" label="止盈限制" :label-width="hmacFormLabelWidth" >
                <el-slider v-model="hmacForm.profitLimit" :step="0.1" :min="0.1" :max="100.0" show-input />
            </el-form-item>
            <el-form-item label="交易指标" :label-width="hmacFormLabelWidth" >
                <el-radio-group v-model="hmacForm.autoTradeType" size="small">
                    <el-radio-button label="盘整区间" :value="3" />
                    <el-radio-button label="指数均线" :value="2" />
                    <!--<el-radio-button label="价格行为" :value="1" />-->
                    <el-radio-button label="价格回撤" :value="0"/>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="自动交易" :label-width="hmacFormLabelWidth" >
                <el-radio-group v-model="hmacForm.autoTrade" size="small">
                    <el-radio-button label="开启" :value="1" />
                    <el-radio-button label="关闭" :value="0"/>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="画线交易" :label-width="hmacFormLabelWidth" >
                <el-radio-group v-model="hmacForm.drawTrade" size="small">
                    <el-radio-button label="开启" :value="1" />
                    <el-radio-button label="关闭" :value="0"/>
                </el-radio-group>
            </el-form-item>
            <el-form-item v-if="hmacForm.autoTradeType == 0" label="回踩交易" :label-width="hmacFormLabelWidth" >
                <el-radio-group v-model="hmacForm.tradeStepBack" size="small">
                    <el-radio-button label="开启" :value="1" />
                    <el-radio-button label="关闭" :value="0"/>
                </el-radio-group>
            </el-form-item>
            <!--<el-form-item v-if="hmacForm.autoTradeType == 0" label="逆势交易" :label-width="hmacFormLabelWidth" >
                <el-radio-group v-model="hmacForm.countertrendTrading" size="small">
                    <el-radio-button label="开启" :value="1" />
                    <el-radio-button label="关闭" :value="0"/>
                </el-radio-group>
            </el-form-item>-->
            <el-form-item label="交易风格" :label-width="hmacFormLabelWidth" >
                <el-radio-group v-model="hmacForm.tradeStyle" size="small">
                    <el-radio-button label="激进" :value="1" />
                    <el-radio-button label="保守" :value="0"/>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="下单通知" :label-width="hmacFormLabelWidth" >
                <el-radio-group v-model="hmacForm.recvTrade" size="small">
                    <el-radio-button label="开启" :value="1" />
                    <el-radio-button label="关闭" :value="0"/>
                </el-radio-group>
            </el-form-item>
            <!--<el-form-item label="PNL通知" :label-width="hmacFormLabelWidth" >
                <el-radio-group v-model="hmacForm.recvCrossUnPnl" size="small">
                    <el-radio-button label="开启" :value="1" />
                    <el-radio-button label="关闭" :value="0"/>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="PNL阈值" :label-width="hmacFormLabelWidth" >
                <el-slider v-model="hmacForm.recvCrossUnPnlPercent" :step="0.1" :min="0.0" :max="100.0" show-input />
            </el-form-item>-->
            <el-form-item label="密码验证" :label-width="hmacFormLabelWidth" >
                <el-input v-model="hmacForm.password" show-password clearable/>
            </el-form-item>
        </el-form>
        <template #footer>
        <div class="dialog-footer">
            <el-button @click="dialogHmacFormVisible = false">取消</el-button>
            <el-button type="primary" @click="changeApiSetting">
                确定
            </el-button>
        </div>
        </template>
    </el-dialog>
    <!--修改Hmac Sha256信息表单END-->

    <!--余额信息 START -->
    <el-dialog v-model="dialogWalletFormVisible" title="币安账户余额" width="500">
        <el-form :model="walletData">
            <el-form-item v-for="item in walletData" :label="item.asset" :label-width="hmacFormLabelWidth" >
                {{ item.balance }}
            </el-form-item>
        </el-form>
        <template #footer>
        <div class="dialog-footer">
            <el-button type="primary" @click="dialogWalletFormVisible = false">
                确定
            </el-button>
        </div>
        </template>
    </el-dialog>
    <!--余额信息END-->

</template>
<script setup>
    import { ElMessageBox, ElMessage } from 'element-plus'
    import { useRoute, useRouter } from 'vue-router'

    import {ref, onMounted ,reactive} from 'vue'
    import axios from './../axios'

    const emit = defineEmits();

    const botOrderPnl = reactive({"winning":"50%","pnl":"100"})

    var username = ref('')
    const router = useRouter()

    const checkOnline = () => {
        axios.get('/user/userInfo').then(function(result){
            if(!(result && result.username)){
                router.push('/login')
            }
        }).catch(function(e){
            router.push('/login');
        })
    }

    //显示画线信息 start 
    const showAllShape = ()=>{
        emit('callShowAllShape');
    }
    //显示画线信息 end

    //查看余额逻辑 start ======================
    const dialogWalletFormVisible = ref(false);
    var walletData = [];
    const showBalance = ()=>{
        walletData = []
        axios.get('/user/getBalance').then(function(result){
            for(var index = 0;index < result.length;index++){
                walletData.push(result[index]);
            }
            if(walletData.length == 0) {
                dialogHmacFormVisible.value = true;
            } else {
                dialogWalletFormVisible.value = true;
            }
        }).catch(function(err){

        })
        
    }

    //查看余额逻辑 end ======================

    //修改Hmac Sha256信息表单 start ===============

    const dialogHmacFormVisible = ref(false);
    const hmacFormLabelWidth = '100px';
    var hmacForm = reactive({
        binanceApiKey:'',
        binanceSecretKey: '',
        autoTrade : 0,
        autoTradeType: 1,
        drawTrade: 0,
        baseStepSize: 1,
        leverage: 10,
        positionValue: 50,
        cutLoss: 3,
        profit: 3,
        recvTrade: 0,
        recvCrossUnPnl: 0,
        recvCrossUnPnlPercent: 0,
        tradeStepBack: 0,
        password: '',
        tradeStyle: 0,
        profitLimit: 4,
        countertrendTrading: 0,
    })

    const changeApiSetting = ()=>{
        axios.post('/user/changeHmac',hmacForm).then(function(result){
            if(result.code == 1){
                ElMessage.error({message: result.message, offset: (window.innerHeight / 2)});
            } else if(result.code == 0){
                ElMessage.success({message: result.message, offset: (window.innerHeight / 2)});
                dialogHmacFormVisible.value = false;
                form.oldPwd = '';
                form.newPwd = '';
                form.confirmPwd = '';
            }
            checkOnline();
        }).catch(function(err){
            ElMessage.error({message: err, offset: (window.innerHeight / 2)});
            checkOnline();
        });
    }

    const showHmacForm = ()=>{
        checkOnline();
        dialogHmacFormVisible.value = true;
        hmacForm.password = '';
        getUserInfo();
    }

    //修改Hmac Sha256信息表单 end ===============

    //修改密码表单 start=======================
    const dialogFormVisible = ref(false);
    const formLabelWidth = '80px'
    var form = reactive({
        oldPwd: '',//旧密码
        newPwd: '',//新密码
        confirmPwd: '',//确认新密码
    })

    const changePwd = () => {
        checkOnline();
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
    const settingLabelWidth = '125px'
    var settingForm = reactive({
        fibMonitor: 0,//是否订阅斐波那契回撤监控 0：否 1：是
        riseAndFallMonitor: 0,//是否订阅涨跌幅监控 0：否 1：是
        emaMonitor: 0,//是否订阅开仓机会监控 0：否 1：是
        emaRiseAndFall: 0,//是否订阅行情异动监控 0：否 1：是
        highOrLowMonitor: 0,//是否订阅标志性高低点监控 0：否 1：是
        areaMonitor: 0,//是否订阅盘整区间监控 0：否 1：是
        volumeMonitor: 0,//是否启用量价分析 0：否 1：是
    });

    const openSettingForm = () => {
        dialogSettingFormVisible.value = true;
        checkOnline();
    }

    const changeSetting = () => {
        checkOnline();
        //console.log(JSON.stringify(settingForm));
        axios.post('/user/changeSubscribeAi',settingForm).then(function(result){
            if(result.code == 1){
                ElMessage.error({message: result.message, offset: (window.innerHeight / 2)});
            } else if(result.code == 0){
                ElMessage.success({message: result.message, offset: (window.innerHeight / 2)});
                dialogSettingFormVisible.value = false;
            }
        }).catch(function(err){
            ElMessage.error({message: err, offset: (window.innerHeight / 2)});
        });
    }

    //设置用户信息表单end ==================

    onMounted(()=>{
        getUserInfo();
        /*setInterval(() => {
            botPnl();
        }, 3000);*/
    })

    const getUserInfo = () =>{
        axios.get('/user/userInfo').then(function(result){
            username.value = result.username;
            settingForm.emaMonitor = result.emaMonitor;
            settingForm.emaRiseAndFall = result.emaRiseAndFall;
            settingForm.fibMonitor = result.fibMonitor;
            settingForm.highOrLowMonitor = result.highOrLowMonitor;
            settingForm.riseAndFallMonitor = result.riseAndFallMonitor;
            settingForm.areaMonitor = result.areaMonitor;
            settingForm.volumeMonitor = result.volumeMonitor;
            hmacForm.autoTrade = result.autoTrade;
            hmacForm.autoTradeType = result.autoTradeType;
            hmacForm.binanceApiKey = result.binanceApiKey;
            hmacForm.binanceSecretKey = result.binanceSecretKey;
            hmacForm.baseStepSize = result.baseStepSize;
            hmacForm.leverage = result.leverage;
            hmacForm.positionValue = result.positionValue;
            hmacForm.cutLoss = result.cutLoss;
            hmacForm.profit = result.profit;
            hmacForm.drawTrade = result.drawTrade;
            hmacForm.recvTrade = result.recvTrade;
            hmacForm.recvCrossUnPnl = result.recvCrossUnPnl;
            hmacForm.recvCrossUnPnlPercent = result.recvCrossUnPnlPercent;
            hmacForm.tradeStepBack = result.tradeStepBack;
            hmacForm.tradeStyle = result.tradeStyle;
            hmacForm.profitLimit = result.profitLimit;
            hmacForm.countertrendTrading = result.countertrendTrading;
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

    const botPnl = () => {
        axios.get('/bot/getOrderCount').then(function(data){
            //console.log(data)
            botOrderPnl.winning = data.winning;
            botOrderPnl.pnl = data.pnl;
        }).catch(function(err){
            console.error(err);
        })
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