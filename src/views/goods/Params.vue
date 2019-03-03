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
                    <el-button type="primary" :disabled="this.selectedOptions.length !==3">添加动态参数</el-button>
                    <el-table
                    border
                    stripe
                    :data="tableData"
                    style="width: 100%">
                    <el-table-column
                    type="expand">
                        <template slot-scope="scope">
                            <!-- tag标签 -->
                            <el-tag
                            v-for="item in scope.row.params"
                            :key="item"
                            closable
                            @close="handleClose(item,scope.row)">
                            {{item}}
                            </el-tag>
                            <el-input
                            class="input-new-tag"
                            v-if="inputVisible"
                            v-model="inputValue"
                            ref="saveTagInput"
                            size="small"
                            @keyup.enter.native="handleInputConfirm(scope.row)"
                            @blur="handleInputConfirm(scope.row)"
                            >
                            </el-input>
                            <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
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
                    <el-button type="primary" :disabled ="this.selectedOptions.length !==3">添加静态参数</el-button>
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
          tableData:[],
        //   文本框默认不显示
          inputVisible : false,
          inputValue:''
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
        //  选择三级时加载
         if(this.selectedOptions.length === 3){
            //  清空
             this.tableData.length = 0;
            let res = await this.$http.get(`categories/${this.selectedOptions[2]}/attributes?sel=${this.activeName}`)
            const {meta:{msg,status}} = res.data;
            // 有问题
            if(status==200){
                // 表格赋值
                this.tableData = res.data.data;
                // 动态参数把attr_vals转换成数组 =相当于赋值，因此出错
                if(this.activeName =="many"){
                    this.tableData.forEach((item)=>{
                        // 动态增加的成员，vue不会监听它的变化
                           let arr = item.attr_vals.length == 0 ? [] : item.attr_vals.split(',')
                        //   给谁添加对象，名称，值
                           this.$set(item, 'params', arr)
                    })
                }
            }
            }else{
                this.$message.error(msg);
         } 
       
      },
      handleClick(){
          this.loadData();
      },
    //   添加动态参数
      async handleInputConfirm(row){
        //  获取文本框的值
        let inputValue = this.inputValue;
        // 为空return
        if (inputValue) {
          // 不为空添加到数组
        row.params.push(inputValue);
        // 向服务器发送请求
        let res = await this.$http.put(`categories/${this.selectedOptions[2]}/attributes/${row.attr_id}`,{
          attr_vals:row.params.join(','),
          attr_name:row.attr_name,
          attr_sel: this.activeName
        })
        let { meta : {msg,status}} =res.data;
        // 请求成功 显示成功提示 关闭输入框tag标签
        if(status == 200){
          this.$message.success(msg);
          this.inputVisible = false;
          this.inputValue = '';
        }else{
          this.$message.error(msg);
        }
        // 没有值直接关闭tag标签
        }else{
          this.inputVisible = false;
          this.inputValue = '';
        }  
    },
    // 点击添加tag标签
       showInput(){
        // 显示编辑框
        this.inputVisible = true;
        // 点击时候获取焦点 $nextTick下一次dom更新循环后执行 也可以使用setTimeOut
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
    },
    //   点击关闭
      async handleClose(tag,param){  
          // 分类id this.selectionOptions里
         // 请求数据id params.attr_id
         // 这是最新的值 因后台接口有点小问题，因此将此条js放在了最上面  数组中删除某一项
              //  查询item在数组中的位置
                    // params是动态参数对象 tag是显示的文字
                let index = param.params.findIndex((item)=>{
                    if ( tag === item ){
                        return true;
                    }
                })
               param.params.splice(index,1);
          let res = await this.$http.put(`categories/${this.selectedOptions[2]}/attributes/${param.attr_id}`,{
              'attr_vals': param.params.join(','),
              'attr_sel': this.activeName,
              'attr_name': param.attr_name
          });
          let { meta:{msg,status}} = res.data;
          if(status == 200){
               this.$message.success(msg)

          }else{
              this.$message.error(msg);
          }

      }

    }
}
</script>
<style>
    .el-tag + .el-tag{
        margin-left: 10px;
    }
    .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .el-card{
    height: 100%;
  }
  .el-button{
    margin-bottom: 10px;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>