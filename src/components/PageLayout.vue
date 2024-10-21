<script setup>
    import PageHeader from "./PageHeader.vue";
    import PageMain from './PageMain.vue'
</script>
<template>
    <div class="common-layout">
        <el-container>
            <el-header class="header">
                <PageHeader></PageHeader>
            </el-header>
            <el-main class="main">
                <PageMain></PageMain>
            </el-main>
        </el-container>
  </div>
</template>
<style scoped>
.header{
    background-color: aliceblue;
}
.main{
    padding: 0px;
}
</style>