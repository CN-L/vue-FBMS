<template>
  <div class="login-warp">
    <el-form
    class="login-form"
    label-position="top"
    label-width="80px"
    :model="formData">
    <h2>用户登陆</h2>
  <el-form-item label="用户名">
    <el-input v-model="formData.username"></el-input>
  </el-form-item>
  <el-form-item label="密码" >
    <!-- .native告诉组件我想用原生的DOM事件 -->
    <el-input @keyup.enter.native="handleLogin" v-model="formData.password"></el-input>
  </el-form-item>
  <el-form-item>
    <el-button @click="handleLogin" type="primary" class="btn">登陆</el-button>
  </el-form-item>
</el-form>
  </div>
</template>

<script>
import axios from 'axios'
export default {
    data() {
      return {
       formData:{
         username:'',
         password:''
       }
      };
    },
    methods:{
      //处理登陆
     async handleLogin(){
      var res = await axios.post('/login',this.formData)
     let { data:  { meta:{ msg,status } } } = res;
     //提示成功
    if(status == 200) {
     this.$message.success(msg);
     //  记录token
      // let { data:{ data:{ token } }} = res;
      let token = res.data.data.token;
     sessionStorage.setItem('token',token);
    //  页面跳转
     this.$router.push('/')
    } else {
      this.$message.error(msg)
    }
  }
}
}
</script>

<style>
.login-warp{
   background-color: #324152;
   height: 100%;
   display: flex;
   justify-content: center;
   align-items: center;
 }
.login-form{
   width: 400px;
   padding:30px;
   background-color: #fff;
   border-radius: 5px;
 }
 .btn{
   width: 100%;
 }
</style>
