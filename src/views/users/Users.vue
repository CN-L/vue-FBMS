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
          <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" class="scopeIcon">
        <!-- scope.row获取当前行的数据 -->
        <!-- scope.$index获取当前的下标 -->
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" @click ="editUserdialogFormVisible=true" size="mini" circle plain></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" plain circle></el-button>
          <el-button type="success" icon="el-icon-check" size="mini" plain circle></el-button>
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
    //   添加对话框显示与隐藏
      addUserdialogFormVisible: false,
      // 编辑对话框
      editUserdialogFormVisible:false,
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
    // 对话框显示与隐藏
    addUsersForm(){
      this.addUserdialogFormVisible = true
    },
    // 编辑功能
    editList(){
      console.log('更改成功')
    },
    // 点击取消
    editHandle(){
      this.from ="";
    },
    async loadList() {
      //   需要在请求头添加Authorization = token,zxios中有介绍
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
</style>
