<template>
    <div class="common-layout">
        <el-container>
            <el-header class="header">
                <PageHeader @callShowAllShape="showAllShape"></PageHeader>
            </el-header>
            <el-main class="main">
                <PageMain ref="mainPage"></PageMain>
            </el-main>
        </el-container>
  </div>
</template>
<script setup>
    import PageHeader from "./PageHeader.vue";
    import PageMain from './PageMain.vue'
    import {ref } from 'vue';

    var mainPage = ref(null);
    const showAllShape = ()=>{
        //console.log('call showAllShape()')
        mainPage.value.mainShowAllShape();
    }
    /*
    onMounted(() => {
        // 确保子组件渲染完成后，可以访问
        if (mainPage.value) {
            console.log('子组件已加载');
        }
    });*/
</script>
<style scoped>
.header{
    background-color: #131722;
}
.main{
    padding: 0px;
}
</style>