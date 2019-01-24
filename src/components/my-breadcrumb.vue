<template>
    <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>{{level1}}</el-breadcrumb-item>
    <el-breadcrumb-item>{{level2}}</el-breadcrumb-item>
</el-breadcrumb>
</template>
<script>
export default {
    name: 'myBreadcrumb',
    props:['level1','level2']
}
</script>
<style>
    
</style>