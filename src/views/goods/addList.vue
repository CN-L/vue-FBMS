<template>
    <el-card class="card">
      <my-breadcrumb level1="商品管理" level2="商品列表"></my-breadcrumb>
      <el-alert
        title="添加商品信息"
        class="alert"
        :closable="false"
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
                <el-input v-model="form.goods_price"></el-input>
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
                <el-form-item
                v-for="item in dynamicParams"
                :key="item.attr_id"
                :label="item.attr_name">
                      <el-checkbox
                      checked
                      border
                      v-for="param in item.params"
                      :label="param"
                      :key="param">
                      </el-checkbox>
                </el-form-item>  
            </el-tab-pane>
            <el-tab-pane label="商品属性">
                <el-form-item
                v-for="item in staticParams"
                :key="item.attr_id"
                :label="item.attr_name">
                <el-input v-model="item.attr_vals"></el-input>
                </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品图片">
                <!-- action上传地址 file-list图片列表-->
                <el-upload
                    :headers="headers"
                    class="upload-demo"
                    action = "http://localhost:8888/api/private/v1/upload"
                    :on-remove="handleRemove"
                    :on-success="handleSuccess"
                    list-type="picture">
                    <el-button size="small" type="primary">点击上传</el-button>
                </el-upload>
            </el-tab-pane>
            <el-tab-pane label="商品内容">
            <el-button @click="handleAdd">添加商品</el-button>
                <!-- 富文本框 -->
                <quill-editor v-model="form.goods_introduce">

                </quill-editor>
            </el-tab-pane>
        </el-tabs>
        </el-form>
        <!-- 表单 -->
    </el-card>
</template>
<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'
export default {
     components:{
            quillEditor
        },
      data(){
        return{
        //点击基本信息时active为0 商品参数时为1 
         active:0,
        //  选项卡位置
        ruleForm:{

        },
         tabPosition:'left',
        //  动态参数
        dynamicParams:[],
        // 静态参数
        staticParams:[],
        headers:{
             'Authorization': sessionStorage.getItem('token')
        },
         index:'',
         form:{
            //  表单数据
           goods_name:'',
           goods_price:'',
           goods_number:'',
           goods_weight:'',
           goods_introduce:'',
           attrs:[],
        //    商品分类id 1,2,3
           goods_cat:'',
           pics:[]
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
        // 图片上传
        handleRemove(file,fileList){
            let  list = this.form.pics;
            for(var i = 0;i<list.length;i++){
                if(list[i] == file.response.data.tem_path){
                     this.index = i;
                }
            }
            this.form.pics.splice(this.index,1)
            console.log(this.form.pics)
        },
        // 添加商品
        async handleAdd(){
             this.form.goods_cat = this.selectedOptions.join(',');
            //  动态参数
             let arr1 = this.dynamicParams.map((item)=>{
                 return {'attr_id':item.attr_id,'attr_value':item.params.join(',')};
             });
            //  静态参数
            let arr2 = this.staticParams.map((item)=>{
                return { 'attr_id':item.attr_id,'attr_value':item.attr_vals}
            })
            // 合并数组,相当于平铺
            this.form.attrs = [...arr1, ...arr2];
            const res = await this.$http.post('goods',this.form);
            let {meta:{status,msg}} = res.data;
            if(status==201){
            //   this.$message.success(msg);
            this.$router.push('goods');
            }else{
                this.$message.error(msg)
            }
        },
        handleSuccess(response,file,fileList){
            if(response.meta.status==200){
               this.form.pics.push(response.tem_path) 
            }else{
                this.$message.error('上传失败')
            }
        },
        // 加载动态参数
        async loadParams(index){
            let sel = index ==='1' ? 'many':'only'
            let res = await this.$http.get(`categories/${this.selectedOptions[2]}/attributes?sel=${sel}`);
            if(sel === 'many'){
                this.dynamicParams = res.data.data;
                this.dynamicParams.map((item)=> {
                // 给对象新加属性
                item.params = item.attr_vals.length== 0 ? [] : item.attr_vals.split(',');
            });
            }else{
                this.staticParams = res.data.data;
            }
           
        },
        handleClick(tab,event){
           this.active = tab.index - 0;
        //    判断当前点击的组件tap是否为商品参数 商品属性
        if(tab.index === '1' || tab.index === '2'){
            //判断基本信息中的多级下拉是否为三级菜单
            if(this.selectedOptions.length !==3){
                this.$message.warning('请先选择商品的分类');
            }else{
                this.loadParams(tab.index);
            }
            
        }
        },
        // 多级下拉选中项变化时执行
        handleChange(){
           if(this.selectedOptions.length !== 3){
                //  在这个数组不等于三时，说明点击的不是三级菜单，不可选中
                this.selectedOptions.length = 0;
                this.$message.warning("请选择三级分类");
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
.el-checkbox{
    margin-bottom: 5px;
}
.ql-editor{
    height: 400px;
}
</style>
