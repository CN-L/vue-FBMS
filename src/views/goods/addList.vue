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
      labelPosition="top"
      :model="ruleForm"
      label-width="100px">

        <el-tabs @tab-click="handleClick" 
        :tab-position="tabPosition"
        style="height: 100%;margin-top:20px;">
            <el-tab-pane  label="基本信息">
               <el-form-item label="商品名称">
                <el-input v-model="form.goods_name"></el-input>
               </el-form-item>
               <el-form-item label="商品价格">
                <el-input v-model="form.godds_price"></el-input>
               </el-form-item>
               <el-form-item label="商品重量">
                <el-input v-model="form.weight"></el-input>
               </el-form-item>
               <el-form-item label="商品数量">
                <el-input v-model="form.goods_number"></el-input>
               </el-form-item>
               <el-form-item label="商品分类">
                   <el-cascader
                        placeholder="请选择商品分类"
                        clearable
                        :props="{label:'cat_name', value:'cat_id',children:'children'}"
                        expand-trigger="hover"
                        :options="options"
                        v-model="selectedOptions"
                        @change="handleChange">
                    </el-cascader>
               </el-form-item>
            </el-tab-pane>
            <el-tab-pane  label="商品参数">
                <el-form-item>
                <el-checkbox-group v-model="checkList">
                    <el-checkbox label="复选框 A"></el-checkbox>
                    <el-checkbox label="复选框 B"></el-checkbox>
                </el-checkbox-group>
            </el-form-item>  
            </el-tab-pane>
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
           goods_name:'',
           goods_price:'',
           goods_number:'',
           goods_weight:'',
        //    商品分类id 1,2,3
           goods_cat:''
         },
        //  多级选择器数据 数据 绑定的多个id
         options:[],
         selectedOptions:[]
        }
    },
    created(){
       this.loadOptions();
    },
    methods:{
        handleClick(tab,event){
           this.active = tab.index - 0;
        //    判断当前点击的组件tap是否为商品参数 商品属性
        if(tab.index === '1' || tab.index === '2'){
            //判断基本信息中的多级下拉是否为三级菜单
            if(this.selectedOptions.length !==3){
                this.$message.warning('请先选择商品的分类')
            }
            
        }
        },
        // 多级下拉选中项变化时执行
        handleChange(){
           if(this.selectedOptions.length !== 3){
                //  在这个数组不等于三时，说明点击的不是三级菜单，不可选中
                this.selectedOptions.length = 0;
                this.$message.warning("请选择三级分类")
           }
        },
        // 加载多级下拉的数据
        async loadOptions(){
            let res = await this.$http.get(`categories?type=3`);
            this.options = res.data.data;
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
