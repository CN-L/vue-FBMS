<template>
  <el-card class="box-card">
    <!-- 面包屑组件 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path:'/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->
    <el-row class="search">
      <el-col :span="24">
        <el-input v-model="searchValue" clearable placeholder="请输入内容" class="searchInput">
          <el-button @click="handleSearch" slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <el-button type="success" @click="addUsersForm" plain>添加用户</el-button>
      </el-col>
    </el-row>
    <!-- table表格 -->
    <el-table border stripe :data="list" style="width: 100%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column prop label="创建时间">
        <template slot-scope="scope">{{ scope.row.create_time | formDate('YYYY-MM-DD')}}</template>
      </el-table-column>
      <el-table-column prop="mg_state" label="用户状态">
        <template slot-scope="scope">
          <!-- 开关按钮 -->
          <el-switch v-model="scope.row.mg_state" @change="userStatus(scope.row)" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" class="scopeIcon">
        <!-- scope.row获取当前行的数据 -->
        <!-- scope.$index获取当前的下标 -->
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" @click ="editHandleClik(scope.row)" size="mini" circle plain></el-button>
          <el-button type="danger" icon="el-icon-delete" @click="deleteHandle(scope.row.id)" size="mini" plain circle></el-button>
          <el-button type="success" icon="el-icon-check" @click="{setRoledialogVisible = true}" size="mini" plain circle></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- page-size 每页显示多少条数
        pager-count    最多显示页数 大于等于5小于等于21的奇数
        total   总共多少条
        current-page当前页码
        @size-change 每页显示多少条时改变
        @current-change 页码改变时候
    -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      layout="total,sizes,prev, pager, next,jumper"
      :page-size="pagesize"
      :page-sizes="[10,20,40,100]"
      :pager-count="7"
      :current-page="pagenum"
      :total="count"
    ></el-pagination>
    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户"
     :visible.sync="addUserdialogFormVisible">
      <el-form
      :rules="rules"
      ref="addForm"
      label-width="80px"
      :model="form">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type ="password" v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="errorHandle">取 消</el-button>
        <el-button type="primary" @click="addList">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑对话框 -->
        <el-dialog title="编辑用户"
     :visible.sync="editUserdialogFormVisible">
      <el-form
      ref="editForm"
      label-width="80px"
      :model="form">
        <el-form-item label="用户名" prop="username">
          <el-input disabled="true" v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editHandle">取 消</el-button>
        <el-button type="primary" @click="editList">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分配角色 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setRoledialogVisible"
      width="30%"
      :before-close="handleClose">
      <el-form
      label-width="100px"
      >
        <el-form-item label="用户名">
          {{currentName}}
        </el-form-item>
        <el-form-item  class ="jiose" label="请选择角色">
          <el-select v-model="currentRoleId">
            <el-option label="请选择" disabled :value="-1"></el-option>
            <el-option label="区域1" :value="shanghai"></el-option>
            <el-option label="区域2" :value="beijing"></el-option>
          </el-select>
        </el-form-item>
      </el-form>

</el-dialog>


  </el-card>
</template>
<script>
export default {
  data() {
    return {
      list: [],
      //   页码
      pagenum: 1,
      //   每页显示多少条
      pagesize: 10,
      //   总条数
      count: 0,
      searchValue: "",
      // 分配角色
      currentRoleId:-1,
      currentName:'',
    //   添加对话框显示与隐藏
      addUserdialogFormVisible: false,
      // 编辑对话框
      editUserdialogFormVisible:false,
      //分配角色对话框
      setRoledialogVisible:false,
      form:{
       username:'',
       password:'',
       email:'',
       mobile:''
      },
      rules:{
        username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
        password:[
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ]

      }
    };
  },
  created: function() {
    this.loadList();
  },
  methods: {
    //  删除功能实现
    // list的数据并不是所有的，而是每次加载最多显示十条数据，根据分页，开始时候获取的只是十条数据，因为list长度可适用于当前页的长度
    async deleteHandle(id){
       let res = await this.$http.delete(`/users/${id}`)
      let {data:{meta:{status,msg}}} = res;
       this.$confirm('是否删除此条数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          if(status == 200){
            // 如果只剩这一条数据 并且它的页码不是1的时候，先去减掉一页 再去重新加载
            if(this.list.length = 1 && this.pagenum !==1){
              this.pagenum--;
              this.loadList();
            }
            this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.loadList()
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
},
// 状态改变事件
 async userStatus(user){
    let res = await this.$http.put(`users/${user.id}/state/${user.mg_state}`)
    let { data:{meta:{msg,status}}} = res;
    if(status == 200){
      this.$message.success(msg)
    }else{
      this.$message.error(msg);
    }
},
   //点击编辑按钮
    editHandleClik(user){
      // 弹出编辑框
      this.editUserdialogFormVisible=true
      // 熏染当前数据
      this.form.username = user.username;
      this.form.email = user.email;
      this.form.mobile = user.mobile;
      this.form.id = user.id;
    },
    // 点击添加用户
    addUsersForm(){
      // 弹出添加对话框
      this.addUserdialogFormVisible = true
    },
    // 编辑功能点击确定
    async editList(){
    // 获取当前用户输入的数据，全局发送给后台，达到更改的目的
    let res = await this.$http.put(`users/${this.form.id }`,{
      email:this.form.email,
      mobile:this.form.mobile
    });
     
      //  判断是否成功
      let{ data: { meta: { msg,status } } } = res;
      if( status === 200){
        this.editUserdialogFormVisible = false;
        this.$message.success(msg)
        this.from.username = '';
        this.form.email = '';
        this.form.mobile = '';
      }else{
        this.$message.error(msg)
      }
     
},
    // 点击取消
    editHandle(){
       this.form.username = '';
       this.form.email = '';
       this.form.mobile = '';
       this.editUserdialogFormVisible = false;

    },
    async loadList() {
      //   需要在请求头添加Authorization = token,axios中有介绍
      var token = sessionStorage.getItem("token");

      this.$http.defaults.headers.common["Authorization"] = token;

      var res = await this.$http.get(
        `/users?pagenum=${this.pagenum}&pagesize=${this.pagesize}&query=${
          this.searchValue
        }`
      );
      let {
        meta: { status, msg }
      } = res.data;
      // 请求成功
      if (status == 200) {
        // 获取分页数据
        let {
          data: {
            data: { pagenum, total }
          }
        } = res;
        // 更新页码
        this.pagenum = pagenum;
        //更新总条数
        this.count = total;
        let {
          data: {
            data: { users }
          }
        } = res;
        this.list = users;
      } else {
        this.$message.warning(msg);
      }
    },
  
    //  每页显示数据条数变化时触发
    handleSizeChange(val) {
      //  更新每页显示条数
      this.pagesize = val;
      this.loadList();
    },
    // 当页码发生改变时触发
    handleCurrentChange(val) {
      //   将当前页码更新
      this.pagenum = val;
      //页面重新加载
      this.loadList();
    },
    // 查找功能实现
    handleSearch() {
      this.loadList();
    },
    // 添加用户处理函数
    async addList(){
      this.$refs.addForm.validate(async (valid)=>{
        if(valid){
          let res = await this.$http.post('/users',this.form);
          const {data:{meta:{status,msg}}} = res;
          if(status == 201){
            // 清空表单
            
           // this.form = ''
            // 成功提示
            this.$message.success('添加成功');
            // 关闭对话框
            this.addUserdialogFormVisible = false;
            // 重新加载数据
            this.loadList();
            this.$refs.addForm.resetFields();
        }else{
            // 失败提示
            this.$message.error(msg)
          }
        
        }else{
          return false;
        }
      })
    },
    // 点击取消时的操作
    errorHandle(){
      // 关闭弹框
      this.addUserdialogFormVisible = false;
      // 清空表单
      this.$refs.addForm.resetFields();
    },
  }
};
</script>
<style>
.box-card {
  height: 100%;
}
.searchInput {
  margin-top: 10px;
  width: 350px;
}
.search {
  margin-top: 10px;
  margin-bottom: 10px;
}
.jiose{
  margin-right: 20px;
}
</style>
