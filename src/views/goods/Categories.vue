<template>
    <er-card class="card">
        <!-- 面包屑 -->
        <my-breadcrumb level1="商品管理" level2="商品列表"></my-breadcrumb>
     <!-- 添加按钮 -->
     <el-row :span="24" class="row">
         <el-button type="success">添加分类</el-button>
     </el-row>
     <template>
    <el-table
      border
      stripe
      :data="list"
      style="width: 100%">
      <el-table-tree-column
       prop="cat_name"
       label="分类名称"
       treeKey="cat_id"
       levelKey="cat_level"
       parentKey="cat_pid"
        width="180">
       
      </el-table-tree-column>
      <el-table-column
        prop="cat_level"
        label="级别"
        width="180">
        <template slot-scope="scope">
         <span v-if="scope.row.cat_level == 0">一级</span>
         <span v-if="scope.row.cat_level == 1">二级</span>
         <span v-if="scope.row.cat_level == 2">三级</span>
        </template>
      </el-table-column>
      <el-table-column
        label="是否有效"
        width="100">
        <template slot-scope="scope">
            {{scope.row.cat_deleted?"无效":"有效"}}
        </template>
      </el-table-column>

      <el-table-column
      label="操作"
      >
      <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle></el-button>
          <el-button type="danger" icon="el-icon-delete" circle></el-button>
      </template>
      </el-table-column>
    </el-table>
  </template>
    </er-card>
</template>
<script>
// 加载treegrid组件 局部组件
import ElementTreegrid from 'element-tree-grid' ;
export default {
    components:{
     'el-table-tree-column':ElementTreegrid
    },
    data(){
        return {
    // table的基础数据
    list:[],        
        }
    },
    methods:{
        // 加载数据table列表
        async loadList(){
         let res = await this.$http.get(`/categories?type=3`)
         let { meta : {msg, status}} = res.data;
         if(status == 200){
             this.list = res.data.data;
         }
        }
    },
    created(){
      this.loadList();
    }
}
</script>
<style>
.row{
    margin-top: 10px;
    margin-bottom: 10px;
}
</style>

