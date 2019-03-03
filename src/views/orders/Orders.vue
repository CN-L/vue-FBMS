<template>
    <el-card class="card">
      <!-- 面包系的组件 -->
      <my-breadcrumb level1="订单管理" level2="订单列表"></my-breadcrumb>
       <el-table
      :data="tableData"
      stripe
      border
      style="width: 100%,height:100%,margin-top: 10px">
      <el-table-column
      type="index"
      width="60">
      </el-table-column>
      <el-table-column  
        label="订单编号"
        width="250">
      </el-table-column>
      <el-table-column
        label="订单价格"
        width="150">
      </el-table-column>
      <el-table-column
        label="是否付款"
        width="100">
      </el-table-column>
      <el-table-column
        prop=""
        label="是否发货"
        width="100">
      </el-table-column>
       <el-table-column
        prop=""
        label="下单时间"
        width="100">
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
           <el-button
           type="primary"
           icon="el-icon-edit"
           size="mini"
           plain>
           </el-button>
        </template>
      </el-table-column>
    </el-table>
    </el-card>
</template>
<script>
export default {
    data(){
        return {
            data:[]

        }
    }
}  
</script>
<style>
 .el-table{
     margin-top: 10px;
 }
</style>
