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
                <el-button @click="$router.push('goods/add')" type="success" plain>添加商品</el-button>
            </el-col>
          </el-row>
          <!-- table表格 -->
            <template>
                <el-table
                stripe
                border
                :data="list"
                style="width: 100%">
                <el-table-column
                    type="index"
                    width="80">
                </el-table-column>
                <el-table-column
                    prop="goods_name"
                    label="商品名称"
                    width="400">
                </el-table-column>
                <el-table-column
                    prop="goods_price"
                    label="商品价格（元）"
                    width="120">
                </el-table-column>
                <el-table-column
                    prop="goods_weight"
                    label="商品重量"
                    width="150">
                </el-table-column>
                <el-table-column
                    label="创建时间">
                    <template slot-scope="scope">
                        <!-- 格式化日期 -->
                        {{scope.row.add_time | formDate('YYYY-MM-DD')}}
                    </template>
                    
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
         list:[]
     }
    },
    methods:{
        // 获取商品列表
        async loadList(){
          let res = await this.$http.get('goods?pagenum=1&pagesize=10');
          let { meta: {msg, status}} = res.data;
          if(status == 200){
            //  请求成功
            this.list = res.data.data.goods
          }else {
              this.$message.error(msg)
          }
        }
    },
    created(){
        this.loadList();
    }
}
</script>
<style>
.searchInput {
  margin-top: 10px;
  width: 350px;
}
.el-table{
    margin-top: 10px;
}
</style>