<template>
 <el-card class="card">
    <span>
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </span>
     <el-table
      border
      stripe
      :data="list"
      style="width: 100%">
            <el-table-column
            type="index"
            label="#"
            width="50px">
            </el-table-column>
            <el-table-column
                prop="authName"
                label="权限名称"
                width="180">
            </el-table-column>
            <el-table-column
                prop="path"
                label="路径"
                width="180">
            </el-table-column>
            <el-table-column
                prop="level"
                label="层级">
            </el-table-column>
      </el-table>
 </el-card>
</template>
<script>
export default {
    data(){
        return {
            list:[]
        }
    },
    created(){
        this.loadList();
    },
    methods:{
        async loadList(){
            let res = await this.$http.get(`/rights/list`);
            let { meta: { status,msg} } = res.data;
            if(status == 200) {
                this.list = res.data.data;
            } else {
                this.$message.error(msg);
            }
        }
    }
}
</script>
<style>
    .card{
        height: 100%;
    }
    span{
        margin-bottom: 10px;
    }
</style>
