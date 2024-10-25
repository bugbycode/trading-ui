<template>
    <el-row class="chart-row">
        <el-col :span="24" class="chart-col">
            <tradingViewPage></tradingViewPage>
        </el-col>
    </el-row>
</template>
<script lang="ts" setup>
    import tradingViewPage from './charts/tradingView.vue';
</script>
<style scoped>
    /* 使el-row和el-col使用flex布局，并且高度为100% */
    .chart-row {
        display: flex;
        align-items: stretch; /* 确保子元素拉伸以填充容器高度 */
        height: 100%;
    }

    .chart-col {
        display: flex;
        flex-direction: column;
    }
    .lw-chart {
        flex-grow: 1; /* 使图表容器占满剩余的空间 */
        width: 100%;
        height: calc(100vh - 60px);
        background-color: #222;
    }
</style>