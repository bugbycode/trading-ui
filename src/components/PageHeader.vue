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
                <span class="handStyle usernameStyle">bugbycode@gmail.com</span>
                <el-icon class="handStyle"><Lock /></el-icon>
            </el-text>
            </ul>
        </el-col>
    </el-row>
</template>
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