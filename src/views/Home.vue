<template>
<el-container class="container">
  <el-header class="header">
      <el-row>
  <el-col :span="4">
       <img class="pic1" src="@/assets/logo.png" alt="">
  </el-col>
  <el-col :span="19">
    <div class="title">兵工后台系统</div>
  </el-col>
  <el-col :span="1">
   <div class="logout"><a  @click.prevent="handleLogout">退出</a></div>
  </el-col>
</el-row>
  </el-header>
  <el-container>
    <el-aside class="aside" width="200px">
        <!-- 侧边栏 -->
      <el-menu
      router
      unique-opened
      class="menu"
      >
      <el-submenu 
      v-for = "item in list"
      :key = "item.id"
      :index="item.id">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>{{item.authName}}</span>
        </template>
          <el-menu-item
          v-for = "item1 in item.children"
          :key = "item1.id"
          :index=" '/' + item1.path">
                <i class="el-icon-menu"></i>
                {{item1.authName}}
          </el-menu-item>
      </el-submenu>
    </el-menu>
    </el-aside>
    <el-main class="main">
        <!-- 占位符 -->
        <router-view/>
    </el-main>
  </el-container>
 </el-container>
</template>
<script>
export default {
    data(){
        return {
             list:[]
        }
    },
    methods:{
        // 退出
      handleLogout(){
          //清楚token
          sessionStorage.clear();
        //   跳转登录页
         this.$router.push('/login')
         //提示
         this.$message.success('退出成功')
      },
      async loadList(){
        let res = await this.$http.get(`/menus`);
        this.list = res.data.data;
      }
    },
    beforeCreate(){
        //获取token，用于登陆验证
        var token = sessionStorage.getItem('token');
        //如果没有token
        if(!token){
            // 提示
            this.$message.warning('请先登录');
            // 跳转登陆页面
            this.$router.push('/login')
     }
    },
    created () { 
        // 动态菜单
     this.loadList()
    }
}
</script>
<style>
    .container{
      height: 100%;
   }
    .header{
        background: #b3c0d1;
        padding: 0;
    }
    .aside{
        background-color:#d3dce6;
    }
    .main{
        background-color: #e9eef3;
    }
    .pic1{
        height: 60px;
        width: 200px;
    }
    .title{
        padding: 0 10px;
        text-align: center;
        color:black;
        line-height: 60px; 
    }
    .logout{
        color: blue;
        line-height: 60px;
    }
    .menu{
        height: 100%;
    }
    .main{ 
        overflow-x: hidden; overflow-y: auto;
         }
</style>