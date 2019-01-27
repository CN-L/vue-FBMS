<template>
   <el-card class="card">
       <!-- 传值的父组件  子组件通过props接收 -->
       <my-breadcrumb level1="权限管理" level2 = "角色列表"></my-breadcrumb>
        <el-row :span="24">
            <el-button type="success" class="roles" plain>添加角色</el-button>
        </el-row>
        <el-table
        border
        stripe
        v-loading="loading"
        :data="list"
      style="width: 100%">
    <el-table-column type="expand">
      <template slot-scope="scope">
       <!-- 一级菜单 因为table表格数据已经有了，因此不需要再次发送ajax-->
       <el-row
       v-for="item in scope.row.children"
       :key="item.id">
           <el-col :span="4">
               <!-- 显示一级权限名称 -->
               <el-tag
               @close="deleteTag(scope.row,item.id)"
               type="success"
               closable
                 >{{item.authName}}</el-tag>
           </el-col>
           <el-col :span="20">
              <!-- 二级权限 -->
              <el-row
              v-for="level in item.children"
              :key="level.id">
                  <el-col
                  :span="4">
                      <el-tag
                      closable
                      type="warning"
                      @close="deleteTag(scope.row,level.id)"
                      >
                          {{level.authName}}
                      </el-tag>
                  </el-col>
                  <el-col
                  :span ="20"
                  >
                  <el-tag 
                  class="level2"
                  v-for ="level2 in level.children"
                  :key="level2.id"
                  type="danger"
                  closable
                  @close="deleteTag(scope.row,level2.id)"
                  >
                      {{level2.authName}}
                  </el-tag>
                </el-col>
              </el-row>
           </el-col>
       </el-row>
       <el-row v-if="scope.row.children==0">
          <el-col :span="24">没有权限</el-col> 
       </el-row>
      </template>
    </el-table-column>
    <el-table-column
       type="index"
        width="180">
      </el-table-column>
      <el-table-column
        prop="roleName"
        label="角色名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="roleDesc"
        label="角色描述"
        width="180">
      </el-table-column>
      <el-table-column
        label="操作">
         <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" circle plain></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" plain circle></el-button>
          <el-button @click="setRolesdialogVisible=true" type="success" icon="el-icon-check"  size="mini" plain circle></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 点击分配权限按钮，弹出对话框 -->
    <el-dialog
        title="权限分配"
        :visible.sync="setRolesdialogVisible"
        width="30%"
    >
        <span>这是一段信息</span>
        <span slot="footer" class="dialog-footer">
            <el-button @click="setRolesdialogVisible = false">取 消</el-button>
            <el-button type="primary">确 定</el-button>
        </span>
    </el-dialog>

   </el-card>
</template>
<script>
export default {
    data(){
        return {
            list:[],
            loading:true,
            setRolesdialogVisible:false
        }
    },
    created(){
     this.loadList();
    },
    methods:{
     async loadList(){
         let res = await this.$http.get('/roles');
         let { meta: { msg, status } } = res.data;
         this.loading = false;
         if(status == 200){
             this.list = res.data.data;
         }else{
             this.$message.error(msg); 
         }
     },
    //  动态标签点击x（删除权限），删除当前角色对应的权限
     async deleteTag(role,rightId){
         let res = await this.$http.delete(`/roles/${role.id}/rights/${rightId}`)
        //  解构赋值
        let { data: { meta: { msg,status } } } = res;
        if(status == 200){
            this.$message.success(msg);
        //    局部重新加载（而不是重新加载整个页面
            role.children = res.data.data;
        }else{
            this.$message.error(msg);
        }
        
     }
    }
}
</script>
<style>
.card{
    height: 100%;
    overflow: auto;
}
.roles{
    margin-top: 10px;
    margin-bottom: 10px;
}
.level2{
    margin-bottom: 10px;
    margin-left:10px;
}
</style>
