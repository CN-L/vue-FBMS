<template>
    <div>
        <el-card class="card">
          <!-- 面包屑 -->
          <my-breadcrumb level1="商品管理" level2="分类列表"></my-breadcrumb>
         <!-- 搜索框 -->
          <el-row class="search">
            <el-col :span="24">
                <el-input v-model="searchValue" clearable placeholder="请输入内容" class="searchInput">
                <el-button @click="handleSearch" slot="append" icon="el-icon-search"></el-button>
                </el-input>
                <el-button type="success" @click="addUserdialogFormVisible = true" plain>添加用户</el-button>
            </el-col>
          </el-row>
          <!-- table表格 -->
            <template>
                <el-table
                style="width: 100%">
                <el-table-column
                    type="index"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop=""
                    label="商品名称"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop=""
                    label="商品价格（元）"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop=""
                    label="商品重量">
                </el-table-column>
                <el-table-column
                    prop=""
                    label="创建时间">
                </el-table-column>
                <el-table-column
                    label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" circle></el-button>
                        <el-button  type="danger" icon="el-icon-delete" circle></el-button>
                    </template>
                </el-table-column>
                </el-table>
            </template>
        </el-card>
    </div>
</template>
<script>
export default {
    data(){
     return {
         searchValue:'',
     }
    }
}
</script>
<style>
.searchInput {
  margin-top: 10px;
  width: 350px;
}
</style>