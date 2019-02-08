<template>
    <er-card class="card">
        <!-- 面包屑 -->
        <my-breadcrumb level1="商品管理" level2="商品列表"></my-breadcrumb>
     <!-- 添加按钮 -->
     <el-row :span="24" class="row">
         <el-button type="success" @click="addList">添加分类</el-button>
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
            <span v-if="scope.row.cat_level === 0">一级</span>
            <span v-if="scope.row.cat_level === 1">二级</span>
            <span v-if="scope.row.cat_level === 2">三级</span>
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
            <el-button @click = "handleEdit(scope.row)" type="primary" icon="el-icon-edit" circle></el-button>
            <el-button @click = "handleDelete(scope.row.cat_id)" type="danger" icon="el-icon-delete" circle></el-button>
        </template>
        </el-table-column>
        </el-table>
      </template>
      <!-- 编辑对话框 -->
      <el-dialog
      title="编辑商品分类"
      :visible.sync="editVisible"
      :before-close="handleClose">
         <el-form
         :model="form"
         label-width="100px">
         <el-form-item label="分类名称">
           <el-input v-model="form.cat_name" auto-complete = "off">
           </el-input>
         </el-form-item>
    
         </el-form>
         <span slot="footer" class="dialog-footer">
            <el-button @click="erroeHandleList">取 消</el-button>
            <el-button type="primary" @click="editList">确 定</el-button>
        </span>
      </el-dialog>
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
                <el-cascader
                    clearable
                    placeholder="默认添加一级分类"
                    :options="options"
                    expand-trigger="hover"
                    v-model="catId"
                    change-on-select
                    :props="defaultProps"
                    >
                </el-cascader>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="falseHandle">取 消</el-button>
            <el-button type="primary" @click="succList">确 定</el-button>
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
    // 编辑时候记录得分id
    currentCatId:-1,
    // 绑定多级选择器使用的数据
    options: [

    ],
    defaultProps:{
        value:'cat_id',
        label:'cat_name', 
        children:'children',
    },
    catId:[],
    // 编辑按钮时候存储当前数据，以实现局部刷新
    currentCat:{},
    editVisible:false,
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
        },
        async addList(){
            this.addVisible = true;
            let res = await this.$http.get('/categories?type=2');
            this.options = res.data.data;
        },
        // 点击编辑
        async handleEdit(user){
           // 显示当前的cat_name
           this.form.cat_name = user.cat_name;
           this.currentCatId = user.cat_id;
           this.editVisible = true;
           //  存储数据
           this.currentCat = user;
        },
        // 编辑后点击确定
       async editList(user){
          let res = await this.$http.put(`categories/${this.currentCatId}`,{
               cat_name:this.form.cat_name
           });
        //    判断修改是否成功
        let { data: {meta :{ msg, status } } } = res;
        // 更新成功
        if( status = 200 ){
            this.editVisible = false;
           this.$message.success(msg);
           // 修改完数据进行局部加载
           this.currentCat.cat_name = res.data.data.cat_name;
        }else{
            this.$message.error(msg)
        }
        },
        // 点击删除按钮
        async handleDelete(catId){
            let catId1 = Number(catId)
             //删除提示
             this.$confirm('是否要删除此分类','提示',{
                 confirmButtonText:"确定",
                 cancelButtonText:"取消",
                 type:'waring'
             }).then(async()=>{
                 //点击确定删除按钮
                 let res = await this.$http.delete(`categories/${catId1}`);
                //  判断是否删除成功
                let {data:{meta:{msg,status}}} = res
                if(status == 200){
                     this.$message.success(msg);
                     this.loadList();
                }else{
                    this.$message.error(msg)
                }
             }).catch(()=>{
                 this.$message({
                     type:'info',
                     message:"已取消删除"
                 });
             })
        },
        // 点击确定按钮时候发送请求
        // cat_pid 父节点id 0 
        // cat_name节点名称
        // cat_level级别 0 1 2
        async succList(){
            // 设置级别
            this.form.cat_level = this.catId.length;
            // 设置父id 子选择的catid长度为0 说明没有父级 自己就是一级 一级时为0
              if( this.catId.length === 0 ){
                  this.form.cat_pid = 0;
              } else if (this.catId.length === 1 ){
                  this.form.cat_pid = this.catId[0];
              } else if (this.catId.length === 2 ){
                  this.form.cat_pid = this.catId[1];
              }
            let res = await this.$http.post('/categories',this.form);
            const {data: { meta: {msg, status} } } = res;
            if(status == 201){
                // 清空表单
                this.form.cat_name = '';
                // 级联选择器清空
                this.defaultProps.value = -1;
                this.addVisible = false;
                this.$message.success(msg)
                this.loadList();
            }else{
                this.$message.error(msg)
            }
        },
        // 取消编辑操作
        erroeHandleList(){
            this.editVisible =false;
        },
        // 取消操作
        falseHandle(){
            this.addVisible = false;
            this.form.cat_name = '';
            // 级联菜单清空
            this.defaultProps.value = -1;
        },
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

