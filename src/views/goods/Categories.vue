<template>
    <er-card class="card">
        <!-- 面包屑 -->
        <my-breadcrumb level1="商品管理" level2="商品列表"></my-breadcrumb>
     <!-- 添加按钮 -->
     <el-row :span="24" class="row">
         <el-button type="success" @click="addVisible=true">添加分类</el-button>
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
      <!-- 添加对话框 -->
      <el-dialog
        title="添加分类"
        :visible.sync="addVisible"
        :before-close="handleClose">
        <el-form
        :model="form"
        label-width="100px">
            <el-form-item label="分类名称" >
              <el-input v-model="form.cat_name" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="分类列表" :label-width="formLabelWidth">

            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="addVisible = false">取 消</el-button>
            <el-button type="primary" @click="daddVisible = false">确 定</el-button>
        </span>
</el-dialog>
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
    form:{
      cat_pid:-1,
      cat_name:'',
      cat_level:0
    },
    // table的基础数据
    list:[],
    addVisible:false     
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

