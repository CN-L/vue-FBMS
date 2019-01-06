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
      default-active
      >
      <el-submenu index="/users">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>用户管理</span>
        </template>
          <el-menu-item index="/users">
                <i class="el-icon-menu"></i>
                用户列表
          </el-menu-item>
      </el-submenu>
      <el-submenu index="2">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>权限管理</span>
        </template>
          <el-menu-item index="/roles">
                <i class="el-icon-menu"></i>
                角色列表
          </el-menu-item>
          <el-menu-item index="/rights">
              <i class="el-icon-menu"></i>
              权限列表
          </el-menu-item>
      </el-submenu>
      <el-submenu index="3">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>商品管理</span>
        </template>
          <el-menu-item index="3-1">
                <i class="el-icon-menu"></i>
               商品列表
          </el-menu-item>
          <el-menu-item index="3-2">
              <i class="el-icon-menu"></i>
              分类参数
          </el-menu-item>
          <el-menu-item index="3-3">
              <i class="el-icon-menu"></i>
              商品分类
          </el-menu-item>
      </el-submenu>
      <el-submenu index="4">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>订单管理</span>
        </template>
          <el-menu-item index="4-1">
                <i class="el-icon-menu"></i>
                订单列表
          </el-menu-item>
      </el-submenu>
            <el-submenu index="5">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>数据统计</span>
        </template>
          <el-menu-item index="4-1">
                <i class="el-icon-menu"></i>
                数据报表
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
    methods:{
        // 退出
      handleLogout(){
          //清楚token
          sessionStorage.clear();
        //   跳转登录页
         this.$router.push('/login')
         //提示
         this.$message.success('退出成功')
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
</style>