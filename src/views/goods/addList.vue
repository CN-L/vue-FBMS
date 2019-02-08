<template>
    <el-card class="card">
      <my-breadcrumb level1="商品管理" level2="商品列表"></my-breadcrumb>
      <el-alert
        title="添加商品信息"
        class="alert"
        :closable="fasle"
        type="info"
        center
        show-icon>
      </el-alert>
      <!-- 步骤条 -->
      <el-steps :active="active" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
      </el-steps>
      <!-- 选项卡 -->
      <el-form
      :model="ruleForm"
      label-width="100px">

        <el-tabs @tab-click="handleClick" 
        :tab-position="tabPosition"
        style="height: 100%;margin-top:20px;">
            <el-tab-pane  label="基本信息">
               <el-form-item label="商品名称">
                <el-input v-model="form.name"></el-input>
               </el-form-item>
               <el-form-item label="商品价格">
                <el-input v-model="form.name"></el-input>
               </el-form-item>
               <el-form-item label="商品重量">
                <el-input v-model="form.name"></el-input>
               </el-form-item>
               <el-form-item label="商品数量">
                <el-input v-model="form.name"></el-input>
               </el-form-item>
               <el-form-item label="商品分类">
                <el-input v-model="form.name"></el-input>
               </el-form-item>
            </el-tab-pane>
            <el-tab-pane  label="商品参数">配置管理</el-tab-pane>
            <el-tab-pane label="商品属性">角色管理</el-tab-pane>
            <el-tab-pane label="商品图片">图片</el-tab-pane>
            <el-tab-pane label="商品内容">定时任务补偿</el-tab-pane>
        </el-tabs>
        </el-form>
        <!-- 表单 -->
    </el-card>
</template>
<script>
export default {
    data(){
        return{
        //点击基本信息时active为0 商品参数时为1 
         active:0,
        //  选项卡位置
         tabPosition:'left',
         form:{
            //  表单数据

         }
        }
    },
    methods:{
        handleClick(tab,event){
           this.active = tab.index - 0;
           console.log(event)
        }
    }
}
</script>

<style>
.alert{
    margin-top: 10px;
    margin-bottom: 10px;
}
.el-step__title{
    font-size: 12px;
}
</style>
