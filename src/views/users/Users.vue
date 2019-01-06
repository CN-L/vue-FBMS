<template>
  <el-card class="box-card">
      <!-- 面包屑组件 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 搜索框 -->
        <el-row class="search">
            <el-col :span="24">
                <el-input
                clearable
                placeholder="请输入内容"  class="searchInput">
                <el-button slot="append" icon="el-icon-search"></el-button>
                </el-input>
                <el-button type="success" plain>添加用户</el-button>
            </el-col>
        </el-row>
        <!-- table表格 -->
        <el-table
            border
            stripe
            :data="list"
            style="width: 100%">
            <el-table-column
            type="index"
            width="50">
            </el-table-column>
            <el-table-column
                prop="username"
                label="姓名"
                width="180">
            </el-table-column>
            <el-table-column
                prop="email"
                label="邮箱"
                width="180">
            </el-table-column>
            <el-table-column
                prop="mobile"
                label="电话">
            </el-table-column>
            <el-table-column
                prop=""
                label="创建时间">
                <template slot-scope="scope">
                    {{ scope.row.create_time | formDate('YYYY-MM-DD')}}
                </template>
            </el-table-column>
            <el-table-column
                prop="mg_state"
                label="用户状态">
                <template slot-scope="scope">
                    <!-- 开关按钮 -->
                   <el-switch
                        v-model="scope.row.mg_state"
                        active-color="#13ce66"
                        inactive-color="#ff4949">
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column
                label="操作">
                <!-- scope.row获取当前行的数据 -->
                <!-- scope.$index获取当前的下标 -->
                <template slot-scope="scope">
                  <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  circle
                  plain>
                  </el-button>
                  <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  plain
                  circle>
                  </el-button>
                  <el-button
                  type="success"
                  icon="el-icon-check"
                  size="mini"
                  plain
                  circle>
                  </el-button>
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
        }
    },
    created:function(){
       this.loadList()
    },
    methods:{
      async  loadList(){
        //   需要在请求头添加Authorization = token,zxios中有介绍
        var token = sessionStorage.getItem('token');
        this.$http.defaults.headers.common['Authorization'] = token;
        var res =  await this.$http.get('http://localhost:8888/api/private/v1/users?pagenum=1&pagesize=10')
        let { meta: { status, msg } } = res.data;
        if(status==200){
                this.$message.success(msg)
                let { data: { data:{ users } } } = res;
                this.list = users;
        }else{
            this.$message.warning(msg)
        }
     }
    }
}
</script>
<style>
  .box-card{
      height: 100%;
  }
  .searchInput{
      margin-top: 10px;
      width: 350px;
  }
  .search{
    margin-top: 10px;
    margin-bottom: 10px;
  }
</style>
