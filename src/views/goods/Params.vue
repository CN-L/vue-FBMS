<template>
    <el-card>
        <!-- 面包屑 -->
        <my-breadcrumb level1="商品管理" level2="分类参数"></my-breadcrumb>
        <!-- 警告框 -->
        <el-alert
        :closable="false"
        title="注意:只允许为第三季分类设置相关参数"
        type="warning"
        show-icon>
        </el-alert>
        <el-row :span="24">
            请选择商品分类:
            <!-- 层级选择器 -->
            <el-cascader
            placeholder="请选择商品分类"
            expand-trigger="hover"
            :options="options"
            :props=" { label:'cat_name', value:'cat_id' }"
            v-model="selectedOptions"
            @change="handleChange">
           </el-cascader>
           <!-- tab栏切换 -->
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="动态参数" name="many">
                    <el-button type="primary" disabled="this.selectedOptions.length !==3">添加动态参数</el-button>
                    <el-table
                    border
                    stripe
                    :data="tableData"
                    style="width: 100%">
                    <el-table-column
                    type="expand">
                        <template slot-scope="scope">
                            
                        </template>
                    </el-table-column>
                    <el-table-column
                    type="index"
                    width="60">
                    </el-table-column>
                    <el-table-column
                    prop="attr_name"
                    label="商品参数"
                    width="180">
                    </el-table-column>
                    <el-table-column
                    label="操作">
                      <template slot-scope="scope">
                           <el-button type="success" icon="el-icon-edit" plain></el-button>
                           <el-button type="success" icon="el-icon-delete" plain></el-button>
                      </template>
                    </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="静态参数" name="only">
                    <el-button type="primary" disabled ="this.selectOptions.length !==3">添加静态参数</el-button>
                    <el-table
                    border
                    stripe
                    :data="tableData"
                    style="width: 100%">
                    <el-table-column
                    type="index"
                    width="60">
                    </el-table-column>
                    <el-table-column
                    prop="attr_name"
                    label="属性名称"
                    width="180">
                    </el-table-column> <el-table-column
                    prop="attr_vals"
                    label="属性值"
                    width="180">
                    </el-table-column>
                    <el-table-column
                    label="操作">
                      <template slot-scope="scope">
                           <el-button type="success" icon="el-icon-edit" plain></el-button>
                           <el-button type="success" icon="el-icon-delete" plain></el-button>
                      </template>
                    </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-row>
    </el-card>
</template>
<script>
export default {
    data(){
        return{
            // 下拉框绑定的数据
          options:[],
        //   双向绑定的数据
          selectedOptions:[],
        //   选中动态或者静态返回name值
          activeName: "many",
          tableData:[]
        };
    },
    created(){
        this.loadOptions();
    },
    methods:{
        // 加载下拉框
        // 下拉框发生改变时候调用
        handleChange(){
            this.loadData()
        },
      async loadOptions(){
         let res = await this.$http.get('categories?type=3')
           this.options = res.data.data;
      },
    //   加载表格数据
     async loadData(){
         if(this.selectedOptions.length == 3){
             this.tableData.length = 0;
            let res = await this.$http.get(`categories/${this.selectedOptions[2]}/attributes?sel=${this.activeName}`)
            const {meta:{msg,status}} = res.data;
            if(status==200){
                // this.$message.success(msg)
                // 表格赋值
                this.tableData = res.data.data;
            }else{
                this.$message.error(msg);
            }
         } 
       
      },
      handleClick(){
          this.loadData();
      }
    }
}
</script>
<style>
    .el-alert{
        margin-top: 10px;
        margin-bottom: 10px;
    }
    .el-button{
        margin-bottom: 10px;
    }
</style>