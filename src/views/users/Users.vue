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
                <template slot-scope = "scope">
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
        <!-- page-size 每页显示多少条数
        pager-count    最多显示页数 大于等于5小于等于21的奇数
        total   总共多少条
        current-page当前页码
        @size-change 每页显示多少条时改变
        @current-change 页码改变时候
        -->
        <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentCchange"
          layout="total,sizes,prev, pager, next,jumper"
          :page-size="pagesize"
          :page-sizes="[2,4,6,8]"
          :pager-count="7"
          :current-page="pagenum"
          :total="count">
        </el-pagination>
  </el-card>
</template>
<script>
export default {
    data(){
        return {
              list:[],
            //   页码
              pagenum:1,
            //   每页显示多少条
              pagesize:2,
            //   总条数
              count:0
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

        var res =  await this.$http.get(`/users?pagenum=${ this.pagenum }&pagesize=${this.pagesize}`)
        let { meta: { status, msg } } = res.data;
        // 请求成功
        if(status==200){
            // 获取分页数据
            // 总条数和当前页码数
            let { data: { data: { pagenum,total } } } = res;
            this.pagenum = pagenum;
            this.count = total;
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
