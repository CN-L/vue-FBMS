<template>
   <el-card class="card">
       <!-- 传值的父组件  子组件通过props接收 -->
       <my-breadcrumb level1="权限管理" level2 = "权限列表"></my-breadcrumb>
   </el-card>
</template>
<script>
export default {
    
}
</script>
<style>
.card{
    height: 100%;
}
</style>
