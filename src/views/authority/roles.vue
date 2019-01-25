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
       <!-- 一级菜单 -->
       <el-row
       v-for="item in scope.row.children"
       :key="item.id">
           <el-col :span="4">
               <!-- 显示一级权限名称 -->
               <el-tag
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
                  >
                      {{level2.authName}}
                  </el-tag>
                  </el-col>
              </el-row>
           </el-col>
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
          <el-button type="success" icon="el-icon-check"  size="mini" plain circle></el-button>
        </template>
      </el-table-column>
    </el-table>
   </el-card>
</template>
<script>
export default {
    data(){
        return {
            list:[],
            loading:true
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
     }
    }
}
</script>
<style>
.card{
    height: 100%;
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
