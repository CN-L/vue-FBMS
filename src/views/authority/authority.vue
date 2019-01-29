<template>
 <el-card class="card">
     <my-breadcrumb level1="权限管理" level2 = "权限列表"></my-breadcrumb>
    <!-- 表格 -->
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
                <template slot-scope="scope">
                   <span v-if=" scope.row.level === '0'">一级</span>
                   <span v-else-if=" scope.row.level === '1' ">二级</span>
                   <span v-else-if=" scope.row.level === '2' ">三级</span>
                </template>
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
