<template>
   <el-card class="card">
       <!-- 传值的父组件  子组件通过props接收 -->
       <my-breadcrumb level1="权限管理" level2 = "角色列表"></my-breadcrumb>
        <el-row :span="24">
            <el-button type="success" class="roles" plain @click="handleAdd">添加角色</el-button>
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
                  <el-col :span="20">
                  </el-col>
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
          <el-button @click="dakaiTree(scope.row)" type="success" icon="el-icon-check"  size="mini" plain circle></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 点击分配权限按钮，弹出对话框 -->
    <el-dialog
        title="权限分配"
        :visible.sync="setRolesdialogVisible"
        width="30%"
    >
    <!-- 展示树形控件 -->
        <el-tree
        show-checkbox
        ref="tree"
        :default-expanded-keys="[2, 3]"
        :default-checked-keys="checkList"
        node-key="id"
        default-expand-all
        :data="treeList"
        :props="defaultProps"
        >
        </el-tree>
        <span slot="footer" class="dialog-footer">
            <el-button @click="setRolesdialogVisible = false">取 消</el-button>
            <el-button @click="handleSetright" type="primary">确 定</el-button>
        </span>
    </el-dialog>
    <!-- 添加用户对话框 -->
    <el-dialog
     title="添加用户"
     :visible.sync = "addListStatus">
      <el-form
      label-width="100px"
      :rules="rules"
      ref = "addForm"
      :model = "form">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="form.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input  v-model="form.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click = "handleAddList">确 定</el-button>
      </div>
    </el-dialog>
   </el-card>
</template>
<script>
export default {
    data(){
        return {
            list:[],
            loading:true,
            setRolesdialogVisible:false,
            // 点击权限分配按钮时进行赋值
            roleId:-1,
            // 添加用户数据
            form:{
                roleName:'',
                roleDesc:''
            },
            rules: {
                roleName: [
                { required: true, message: '请输入角色名称', trigger: 'blur' }
                ],
                roleDesc: [
                { required: true, message: '请输入角色描述', trigger: 'blur' }
                ]
             },
            addListStatus:false,
            // 绑定树形控件数据
            treeList:[],
            // 选中数据
            checkList:[],
            defaultProps:{
            label:'authName',
            children:'children'
            }
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
      handleAdd(){
        this.addListStatus =true;
        this.form.roleName= '';
        this.form.roleDesc = '';
    },
    //  添加用户
     async handleAddList(){
         // 表单验证
      this.$refs.addForm.validate(async (valid) => {
        if (!valid) {
          // 表单验证失败，返回
          return;
        }
        // 表单验证成功，添加角色
        this.addListStatus = false;
        const res = await this.$http.post('/roles', this.form);
        if (res.data.meta.status === 201) {
          this.$message({
            type: 'success',
            message: '创建角色成功'
          });
          this.form = '';
          // 重新加载数据
          this.loadList();
        } else {
          this.$message({
            type: 'erroe',
            message: '创建角色失败'
          });
        }
      });
     },
    //  添加用户点击取消操作时
      cancel(){
        this.form.roleName = '';
        this.form.roleDesc = '';
        this.addListStatus = false
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
        
     },
    //  点击确定按钮 进行权限分配
    async handleSetright(){
    //  roleId 角色id
    // rids 权限id列表
    const checkListId = this.$refs.tree.getCheckedKeys();
    const halfCheckedListId = this.$refs.tree.getHalfCheckedKeys();
    // 合并
    let arr = [...checkListId,...halfCheckedListId];
    let res = await this.$http.post(`/roles/${this.roleId}/rights`,{
        rids:arr.join(',')
        
    })
    let { data: { meta: { msg, status} } } = res;
    // 成功
     if(status==200){
        this.$message(msg);
        // 关闭对话框
        this.setRolesdialogVisible = false;
        //  数据重新加载
        this.loadList()
    }else{
       this.$message.error(msg)
    }
    },
    
    //  分配权限按钮,role当前角色对象
     async dakaiTree(role){
        //  记录roleId,存储起来
         this.roleId = role.id;
         this.setRolesdialogVisible = true;
         let res = await this.$http.get('/rights/tree')
         this.treeList = res.data.data;
         //当前加颜色所有的权限id存储到checkList里,目的是展开默认所有行，因此获取所有最后的level2
         this.checkList = [];
           role.children.map((item)=>{
              item.children.map((level)=>{
                  level.children.map((level2)=>{
                      this.checkList.push(level2.id)
                  })
              })
           })
     },
     
    }
}
</script>
<style>
.roles{
    margin-top: 10px;
    margin-bottom: 10px;
}
.level2{
    margin-bottom: 10px;
    margin-left:10px;
}
</style>
