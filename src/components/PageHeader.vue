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
                    <el-icon class="handStyle usernameStyle" @click="showAllChildCfg"><Stamp /></el-icon>
                    <el-icon class="handStyle usernameStyle" @click="showAllShape"><AlarmClock /></el-icon>
                    <el-icon class="handStyle usernameStyle" @click="showBalance"><Wallet /></el-icon>
                    <el-icon class="handStyle usernameStyle" @click="openSettingForm"><Setting /></el-icon>
                    <el-icon class="handStyle usernameStyle" @click="openEmailForm"><Message /></el-icon>
                    <el-icon class="handStyle usernameStyle" @click="showHmacForm"><Key /></el-icon>
                    <el-icon><UserFilled /></el-icon>
                    <span class="handStyle usernameStyle" @click="dialogFormVisible = true">{{maskEmail(username)}}</span>
                    <el-icon class="handStyle" @click="logout"><Lock /></el-icon>
                </el-text>
            </ul>
        </el-col>
    </el-row>

    <!--邮件表单START-->
    <el-dialog v-model="dialogEmailFormVisible" title="SMTP配置" width="500">
        <el-form :model="emailForm">
            <el-form-item label="服务" :label-width="formLabelWidth" >
                <el-input type="text" v-model="emailForm.smtpHost" placeholder="请输入地址" autocomplete="off" clearable/>
            </el-form-item>
            <el-form-item label="端口" :label-width="formLabelWidth" >
                <el-input type="text" v-model="emailForm.smtpPort" placeholder="请输入端口" autocomplete="off" clearable/>
            </el-form-item>
            <el-form-item label="账号1" :label-width="formLabelWidth" >
                <el-input type="text" v-model="emailForm.smtpUser" placeholder="请输入账号" autocomplete="off" clearable/>
            </el-form-item>
            <el-form-item label="密码1" :label-width="formLabelWidth" >
                <el-input type="password" v-model="emailForm.smtpPwd" placeholder="请输入密码" autocomplete="off" show-password clearable/>
            </el-form-item>
            <el-form-item label="账号2" :label-width="formLabelWidth" >
                <el-input type="text" v-model="emailForm.smtpUser2" placeholder="请输入账号" autocomplete="off" clearable/>
            </el-form-item>
            <el-form-item label="密码2" :label-width="formLabelWidth" >
                <el-input type="password" v-model="emailForm.smtpPwd2" placeholder="请输入密码" autocomplete="off" show-password clearable/>
            </el-form-item>
            <el-form-item label="账号3" :label-width="formLabelWidth" >
                <el-input type="text" v-model="emailForm.smtpUser3" placeholder="请输入账号" autocomplete="off" clearable/>
            </el-form-item>
            <el-form-item label="密码3" :label-width="formLabelWidth" >
                <el-input type="password" v-model="emailForm.smtpPwd3" placeholder="请输入密码" autocomplete="off" show-password clearable/>
            </el-form-item>
        </el-form>
        <template #footer>
        <div class="dialog-footer">
            <el-button @click="dialogEmailFormVisible = false">取消</el-button>
            <el-button type="primary" @click="saveEmail">
                确定
            </el-button>
        </div>
        </template>
    </el-dialog>
    <!--邮件表单END-->

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
    <el-dialog v-model="dialogSettingFormVisible" title="行情监控" width="600">
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
            <el-form-item label="价格行为" :label-width="settingLabelWidth" >
                <el-radio-group v-model="settingForm.emaMonitor" size="small">
                    <el-radio-button label="开启" :value="1" />
                    <el-radio-button label="关闭" :value="0"/>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="突破交易" :label-width="settingLabelWidth" v-if="settingForm.emaMonitor == 1">
                <el-radio-group v-model="settingForm.breakthroughMonitor" size="small">
                    <el-radio-button label="开启" :value="1" />
                    <el-radio-button label="关闭" :value="0"/>
                </el-radio-group>
            </el-form-item>
            <!--<el-form-item label="指数均线" :label-width="settingLabelWidth" >
                <el-radio-group v-model="settingForm.emaRiseAndFall" size="small">
                    <el-radio-button label="开启" :value="1" />
                    <el-radio-button label="关闭" :value="0"/>
                </el-radio-group>
            </el-form-item>-->
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
            <!--<el-form-item label="量价监控" :label-width="settingLabelWidth" >
                <el-radio-group v-model="settingForm.volumeMonitor" size="small">
                    <el-radio-button label="开启" :value="1" />
                    <el-radio-button label="关闭" :value="0"/>
                </el-radio-group>
            </el-form-item>-->
            <el-form-item label="筛选策略" :label-width="settingLabelWidth" >
                <el-radio-group v-model="settingForm.monitorPolicyType" size="small">
                    <el-radio-button label="白名单" :value="1" />
                    <el-radio-button label="黑名单" :value="0"/>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="币种筛选" :label-width="settingLabelWidth" >
                <el-select 
                    v-model="settingForm.pairPolicySelected"
                    multiple
                    placeholder="请选择交易对"
                    filterable
                    clearable
                >
                <el-option
                    v-for="item in pairPolicyOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                />
                </el-select>
            </el-form-item>
            <el-form-item v-if="settingForm.fibMonitor == 1" label="回撤比例" :label-width="settingLabelWidth" >
                <el-radio-group v-model="settingForm.monitorfibLevel" size="small">
                    <el-radio-button label="Lv0(0.236)" :value="0" />
                    <el-radio-button label="Lv1(0.382)" :value="1" />
                    <el-radio-button label="Lv2(0.5)" :value="2" />
                    <el-radio-button label="Lv3(0.618)" :value="3" />
                    <el-radio-button label="Lv4(0.786)" :value="4" />
                    <el-radio-button label="Lv5(1.0)" :value="5" />
                </el-radio-group>
            </el-form-item>
            <el-form-item label="振幅过滤" :label-width="settingLabelWidth" >
                <el-slider v-model="settingForm.monitorProfit" :step="0.1" :min="0.5" :max="10.0" show-input />
            </el-form-item>
            <el-form-item label="热度过滤" :label-width="settingLabelWidth" >
                <el-slider v-model="settingForm.tradeNumberMonitor" :step="1" :min="1" :max="1000" :marks="marksTradeNumber" show-input />
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
    <el-dialog v-model="dialogHmacFormVisible" title="币安HMAC配置" width="600" top="1vh">
        <el-form :model="settingForm">
            <el-form-item label="公钥信息" :label-width="hmacFormLabelWidth" >
                <el-input v-model="hmacForm.binanceApiKey" clearable/>
            </el-form-item>
            <el-form-item label="私钥信息" :label-width="hmacFormLabelWidth" >
                <el-input v-model="hmacForm.binanceSecretKey" show-password clearable/>
            </el-form-item>
            <el-form-item label="市场热度" :label-width="hmacFormLabelWidth" >
                <el-slider v-model="hmacForm.tradeNumber" :step="1" :min="1" :max="1000" :marks="marksTradeNumber" show-input />
            </el-form-item>
            <el-form-item label="名义价值" :label-width="hmacFormLabelWidth" >
                <el-slider v-model="hmacForm.baseStepSize" :min="1" :max="100" show-input />
            </el-form-item>
            <el-form-item label="杠杆倍数" :label-width="hmacFormLabelWidth" >
                <el-slider v-model="hmacForm.leverage" :min="2" :max="10" show-input />
            </el-form-item>
            <el-form-item label="仓位数量" :label-width="hmacFormLabelWidth" >
                <el-slider v-model="hmacForm.positionCountLimit" :min="1" :max="positionCountLimitMax" show-input />
            </el-form-item>
            <el-form-item label="持仓价值" :label-width="hmacFormLabelWidth" >
                <el-slider v-model="hmacForm.positionValue" :min="50" :max="1000" show-input />
            </el-form-item>
            <el-form-item label="止损比例" :label-width="hmacFormLabelWidth" >
                <el-slider v-model="hmacForm.cutLoss" :step="0.1" :min="1.0" :max="10.0" show-input />
            </el-form-item>
            <el-form-item label="获利预期" :label-width="hmacFormLabelWidth" >
                <el-slider v-model="hmacForm.profit" :step="0.1" :min="0.5" :max="10.0" show-input />
            </el-form-item>
            <el-form-item v-if="hmacForm.tradeStyle == 0" label="止盈限制" :label-width="hmacFormLabelWidth" >
                <el-slider v-model="hmacForm.profitLimit" :step="0.1" :min="0.1" :max="100.0" show-input />
            </el-form-item>
            <el-form-item label="交易指标" :label-width="hmacFormLabelWidth" >
                <el-radio-group v-model="hmacForm.autoTradeType" size="small">
                    <el-radio-button label="盘整区间" :value="3" />
                    <!--<el-radio-button label="指数均线" :value="2" />-->
                    <el-radio-button label="价格行为" :value="1" />
                    <el-radio-button label="价格回撤" :value="0"/>
                </el-radio-group>
            </el-form-item>
            <el-form-item v-if="hmacForm.autoTradeType == 0" label="回撤比例" :label-width="hmacFormLabelWidth" >
                <el-radio-group v-model="hmacForm.fibLevel" size="small">
                    <el-radio-button label="Lv0(0.236)" :value="0" />
                    <el-radio-button label="Lv1(0.382)" :value="1" />
                    <el-radio-button label="Lv2(0.5)" :value="2" />
                    <el-radio-button label="Lv3(0.618)" :value="3" />
                    <el-radio-button label="Lv4(0.786)" :value="4" />
                    <el-radio-button label="Lv5(1.0)" :value="5" />
                </el-radio-group>
            </el-form-item>
            <el-form-item label="自动交易" :label-width="hmacFormLabelWidth" >
                <el-radio-group v-model="hmacForm.autoTrade" size="small">
                    <el-radio-button label="开启" :value="1" />
                    <el-radio-button label="关闭" :value="0"/>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="跟踪委托" :label-width="hmacFormLabelWidth">
                <el-radio-group v-model="hmacForm.callbackRateEnabled" size="small">
                    <el-radio-button label="开启" :value="1" />
                    <el-radio-button label="关闭" :value="0"/>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="回调幅度" :label-width="hmacFormLabelWidth" v-if="hmacForm.callbackRateEnabled == 1">
                <el-slider v-model="hmacForm.callbackRate" :step="0.1" :min="1.0" :max="10.0" show-input />
            </el-form-item>
            <el-form-item label="激活幅度" :label-width="hmacFormLabelWidth" v-if="hmacForm.callbackRateEnabled == 1">
                <el-slider v-model="hmacForm.activationPriceRatio" :step="0.1" :min="1.0" :max="10.0" show-input />
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
            <el-form-item v-if="hmacForm.autoTradeType == 1" label="突破交易" :label-width="hmacFormLabelWidth" >
                <el-radio-group v-model="hmacForm.breakthroughTrade" size="small">
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
            <el-form-item label="筛选策略" :label-width="hmacFormLabelWidth" >
                <el-radio-group v-model="hmacForm.tradePolicyType" size="small">
                    <el-radio-button label="白名单" :value="1" />
                    <el-radio-button label="黑名单" :value="0"/>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="币种筛选" :label-width="hmacFormLabelWidth" >
                <el-select 
                    v-model="hmacForm.tradePairPolicySelected"
                    multiple
                    placeholder="请选择交易对"
                    filterable
                    clearable
                >
                <el-option
                    v-for="item in pairPolicyOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                />
                </el-select>
            </el-form-item>
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

    <!-- 子账号信息管理列表 START -->
    <el-dialog v-model="child_cfg_table_visible" title="子账号信息管理">
		<div>
			<el-input
				v-model="child_cfg_table_data.keyword"
				style="width: 240px"
				placeholder="请输入要查询的信息"
				@keyup.enter="searchChildCfg"
			>
			<template #prefix>
				<el-icon class="el-input__icon"><search /></el-icon>
			</template>
			</el-input>
            <!--<el-icon class="handStyle float_right usernameStyle" size="20"><Delete /></el-icon>-->
            <el-icon @click="showChildCfgDialog" class="handStyle float_right usernameStyle" size="20"><Plus /></el-icon>
		</div>
		<el-table :data="child_cfg_table_data.data" stripe  style="width: 100%" empty-text="无数据">
			<el-table-column type="selection" width="50" />
			<el-table-column label="邮箱账号">
				<template #default="scope">{{ maskEmail(scope.row.email) }}</template>
			</el-table-column>
			<el-table-column label="API key">
				<template #default="scope">{{ maskKey(scope.row.binanceApiKey) }}</template>
			</el-table-column>
			<el-table-column label="创建时间">
				<template #default="scope">{{ scope.row.formatCreateTime }}</template>
			</el-table-column>
			<el-table-column label="修改时间">
				<template #default="scope">{{ scope.row.formatUpdateTime }}</template>
			</el-table-column>
			<el-table-column label="操作" width="100">
				<template #default="scope">
                   <el-icon @click="showEditChildCfgDialog(scope.row.id, scope.row.email, scope.row.binanceApiKey, scope.row.binanceSecretKey)" class="handStyle"><Edit /></el-icon>&nbsp;
                   <el-icon @click="removeChildCfg( scope.row.id )" class="handStyle"><Delete /></el-icon>
				</template>
			</el-table-column>
		</el-table>
		<div>&nbsp;</div>
		<div>
			<el-pagination
				v-model:current-page="child_cfg_table_data.currentPage"
				v-model:page-size="child_cfg_table_data.limit"
				:page-sizes="[5,10,15,20]"
				:size="child_cfg_table_data.limit"
				:disabled="false"
				:background="true"
				layout="total, sizes, prev, pager, next, jumper"
				:total="child_cfg_table_data.totalCount"
				@size-change="queryChildCfg"
				@current-change="currentChange"
			>
			</el-pagination>
		</div>
		<template #footer>
			<div class="dialog-footer">
				<!--<el-button @click="horizontal_ray_form_visible = false">关闭</el-button>-->
				<el-button type="primary" @click="child_cfg_table_visible = false">
				关闭
				</el-button>
			</div>
		</template>
	</el-dialog>
     <!-- 子账号信息管理列表 END -->
    <!-- 子账号添加窗口 START -->
     <el-dialog v-model="dialogChildCfgFormVisible" :title="childCfgDialogTitle" width="500">
        <el-form :model="form">
            <el-form-item label="邮箱账号" :label-width="childCfgLabelWidth" >
                <el-input type="text" v-model="childCfgForm.email" placeholder="请输入邮箱账号" autocomplete="off" clearable/>
            </el-form-item>
            <el-form-item label="API key" :label-width="childCfgLabelWidth">
                <el-input type="text" v-model="childCfgForm.binanceApiKey" placeholder="请输入API key" autocomplete="off" clearable/>
            </el-form-item>
            <el-form-item label="Secret Key" :label-width="childCfgLabelWidth">
                <el-input type="password" v-model="childCfgForm.binanceSecretKey" placeholder="请输入Secret Key" autocomplete="off" show-password clearable/>
            </el-form-item>
        </el-form>
        <template #footer>
        <div class="dialog-footer">
            <el-button @click="dialogChildCfgFormVisible = false">取消</el-button>
            <el-button type="primary" @click="changeChildCfg">
                确认
            </el-button>
        </div>
        </template>
    </el-dialog>
    <!-- 子账号添加窗口 END -->
</template>
<script lang="ts" setup>
    import { ElMessageBox, ElMessage } from 'element-plus'
    import { useRoute, useRouter } from 'vue-router'

    import {ref, onMounted ,reactive} from 'vue'

    import type { CSSProperties } from 'vue'

    interface Mark {
        style: CSSProperties
        label: string
    }

    import axios from './../axios'
    import axios_ from 'axios';

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

    //子账号列表 ========================== START

    const childCfgLabelWidth = '100px'
    const childCfgDialogTitle = ref('添加子账号')
    const child_cfg_table_data = reactive({
        data: [],
        startIndex: 0,
        currentPage: 1,
        limit: 10,
        keyword: '',
        totalCount: 0,
        pageCount: 0,
    })
    const child_cfg_table_visible = ref(false);
    const dialogChildCfgFormVisible = ref(false);
    const queryChildCfg = () => {
        axios.get("/childApiKey/query?keyword=" +  child_cfg_table_data.keyword + 
        "&startIndex=" + child_cfg_table_data.startIndex + "&limit=" + child_cfg_table_data.limit).then(function(result){
            child_cfg_table_data.data = result.list;
            child_cfg_table_data.startIndex = result.page.startIndex;
            child_cfg_table_data.pageCount = result.page.pageCount;
            child_cfg_table_data.currentPage = result.page.currentPage;
            child_cfg_table_data.totalCount = result.page.totalCount;
            child_cfg_table_data.limit = result.page.limit;
            child_cfg_table_visible.value = true;
        }).catch(function(err){
            ElMessage.error({message: err.message, offset: (window.innerHeight / 2) - 50});
        });
    }

    const currentChange = ()=>{
        child_cfg_table_data.startIndex = child_cfg_table_data.currentPage * child_cfg_table_data.limit - child_cfg_table_data.limit;
        queryChildCfg();
    }

    const searchChildCfg = () => {
        child_cfg_table_data.startIndex = 0;
        queryChildCfg();
    }

    const showAllChildCfg = ()=> {
        queryChildCfg();
    }

    var childCfgForm = reactive({
        id:'',
        email: '',
        binanceApiKey: '',
        binanceSecretKey: '',
    });

    const changeChildCfg = ()=> {
        axios.post('/childApiKey/saveChildCfg',childCfgForm).then(function(result){
            if(result.code == 1){
                ElMessage.error({message: result.message, offset: (window.innerHeight / 2)});
            } else if(result.code == 0){
                ElMessage.success({message: result.message, offset: (window.innerHeight / 2)});
                dialogChildCfgFormVisible.value = false;
                queryChildCfg();
            }
            checkOnline();
        }).catch(function(err){
            checkOnline();
        })
    }

    const showChildCfgDialog = () => {
        childCfgDialogTitle.value = '添加子账号'
        childCfgForm.id = '';
        childCfgForm.email = '';
        childCfgForm.binanceApiKey = '';
        childCfgForm.binanceSecretKey = '';
        dialogChildCfgFormVisible.value = true;
    }

    const showEditChildCfgDialog = (id, email, binanceApiKey, binanceSecretKey) => {
        childCfgDialogTitle.value = '修改子账号'
        childCfgForm.id = id;
        childCfgForm.email = email;
        childCfgForm.binanceApiKey = binanceApiKey;
        childCfgForm.binanceSecretKey = binanceSecretKey;
        dialogChildCfgFormVisible.value = true;
    }

    var removeChildCfg = (id) => {
        ElMessageBox.confirm( '确定要删除子账号信息吗？', '温馨提示',
            {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'warning',
            }
        ).then(() => {
            axios.post('/childApiKey/removeChildCfg/' + id).then(function(result){
                if(result.code == 1){
                    ElMessage.error({message: result.message, offset: (window.innerHeight / 2)});
                } else if(result.code == 0){
                    ElMessage.success({message: result.message, offset: (window.innerHeight / 2)});
                    queryChildCfg();
                }
                checkOnline();
            }).catch(function(err){
                console.log(err);
                checkOnline();
            });
        }).catch(() => {
            
        })
    }

    //子账号列表 ========================== END


    // 币种过滤选项 ========================= START
    const baseHttpUrl = 'https://fapi.binance.com';
    var pairPolicyOptions = ref([]);
    //获取币安合约所有交易对
    axios_.get(baseHttpUrl + '/fapi/v1/exchangeInfo').then(function(result){
        var symbols = result.data.symbols;
        for(var index = 0;index < symbols.length;index++){
            if((symbols[index].contractType == 'PERPETUAL' || symbols[index].contractType == 'TRADIFI_PERPETUAL') && symbols[index].status == 'TRADING'){
                pairPolicyOptions.value.push({
                    label: symbols[index].symbol,
                    value: symbols[index].symbol,
                });
            }
        }
        //console.log(pairPolicyOptions);
    }).catch(function(e){
        console.error(e);
    });

    // 币种过滤选项 ========================= END

    //邮箱认证start
    const dialogEmailFormVisible = ref(false);

    var emailForm = reactive({
        smtpHost: '',
        smtpPort: '',
        smtpUser: '',
        smtpPwd: '',
        smtpUser2: '',
        smtpPwd2: '',
        smtpUser3: '',
        smtpPwd3: '',
    })

    const openEmailForm = () => {
        checkOnline();
        dialogEmailFormVisible.value = true;
        getUserInfo();
    }

    const saveEmail = () => {
        axios.post('/user/saveSmtpSetting',emailForm).then(function(result){
            if(result.code == 1){
                ElMessage.error({message: result.message, offset: (window.innerHeight / 2)});
            } else if(result.code == 0){
                ElMessage.success({message: result.message, offset: (window.innerHeight / 2)});
                dialogEmailFormVisible.value = false;
            }
            checkOnline();
        }).catch(function(err){
            checkOnline();
        })
    }

    //邮箱认证end

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

    const marksTradeNumber = reactive<Marks>({
        //1: '1',
        60: '60',
        200: '200',
        500: '500',
        1000: '1000',
    })

    const positionCountLimitMax = ref(1000);
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
        fibLevel: 0,
        tradeNumber: 60,
        breakthroughTrade: 0,
        callbackRate: 3,
        activationPriceRatio: 3,
        callbackRateEnabled: 0,
        tradePairPolicySelected:[],
        tradePolicyType: 0,
        positionCountLimit: 100,
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
    const settingLabelWidth = '100px'
    var settingForm = reactive({
        fibMonitor: 0,//是否订阅斐波那契回撤监控 0：否 1：是
        riseAndFallMonitor: 0,//是否订阅涨跌幅监控 0：否 1：是
        emaMonitor: 0,//是否订阅开仓机会监控 0：否 1：是
        emaRiseAndFall: 0,//是否订阅行情异动监控 0：否 1：是
        highOrLowMonitor: 0,//是否订阅标志性高低点监控 0：否 1：是
        areaMonitor: 0,//是否订阅盘整区间监控 0：否 1：是
        volumeMonitor: 0,//是否启用量价分析 0：否 1：是
        monitorProfit: 1, //振幅限制 
        tradeNumberMonitor: 60,//活跃度限制
        breakthroughMonitor: 0, //是否监控突破行为 价格行为监控使用 0：否 1：是
        pairPolicySelected: [],//交易对过滤
        monitorPolicyType: 0,//监控策略类型（1:白名单/0:黑名单）
        monitorfibLevel: 0, //价格回撤级别（行情监控使用）
    });

    const openSettingForm = () => {
        checkOnline();
        dialogSettingFormVisible.value = true;
        getUserInfo();
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
            settingForm.monitorProfit = result.monitorProfit;
            settingForm.tradeNumberMonitor = result.tradeNumberMonitor;
            settingForm.breakthroughMonitor = result.breakthroughMonitor;
            settingForm.pairPolicySelected = result.pairPolicySelected;
            settingForm.monitorPolicyType = result.monitorPolicyType;
            settingForm.monitorfibLevel = result.monitorfibLevel;

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
            hmacForm.fibLevel = result.fibLevel;
            hmacForm.tradeNumber = result.tradeNumber;
            hmacForm.breakthroughTrade = result.breakthroughTrade;
            hmacForm.callbackRate = result.callbackRate;
            hmacForm.callbackRateEnabled = result.callbackRateEnabled;
            hmacForm.activationPriceRatio = result.activationPriceRatio;
            hmacForm.tradePairPolicySelected = result.tradePairPolicySelected;
            hmacForm.tradePolicyType = result.tradePolicyType;
            hmacForm.positionCountLimit = result.positionCountLimit;

            emailForm.smtpHost = result.smtpHost;
            emailForm.smtpPort = new String(result.smtpPort);
            emailForm.smtpUser = result.smtpUser;
            emailForm.smtpPwd = result.smtpPwd;
            emailForm.smtpUser2 = result.smtpUser2;
            emailForm.smtpPwd2 = result.smtpPwd2;
            emailForm.smtpUser3 = result.smtpUser3;
            emailForm.smtpPwd3 = result.smtpPwd3;
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

    const maskKey = (key) => {
      //const [username, domain] = key.split('@');
      return `${key.slice(0, 4)}***${key.slice(key.length - 4, key.length)}`;
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

    //交易对及交易规则
    const exchangeInfo = () => {
        //获取币安合约所有交易对
        axios_.get(baseHttpUrl + '/fapi/v1/exchangeInfo').then(function(result){
            if(result && result.status == 200){
                var symbols = result.data.symbols;
                positionCountLimitMax.value = symbols.length * 2;
            }
        });
    }

    exchangeInfo();
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
.float_right {
    float: right;
}
</style>