<template>
    <el-card class="card">
      <!-- 面包系的组件 -->
      <my-breadcrumb level1="订单管理" level2="订单列表"></my-breadcrumb>
       <el-table
      :data="tableData"
      stripe
      border
      style="width: 100%,height:100%,margin-top: 10px">
      <el-table-column
      type="index"
      width="60">
      </el-table-column>
      <el-table-column
        prop="order_number" 
        label="订单编号"
        width="250">
      </el-table-column>
      <el-table-column
        prop="order_price"
        label="订单价格"
        width="100">
      </el-table-column>
      <el-table-column
        label="是否付款"
        width="100">
        <template slot-scope="scope">
          <el-tag v-if = "scope.row.order_pay==0" type="danger">未付款</el-tag>
          <el-tag v-else = "scope.row.order_pay==1" type="danger">付款</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="is_send"
        label="是否发货"
        width="100">
      </el-table-column>
       <el-table-column
        label="下单时间"
        width="250">
        <template slot-scope="scope">
        {{scope.row.create_time|formDate('YYYY-MM-DD')}}
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
           <el-button
           type="primary"
           icon="el-icon-edit"
           size="mini"
           plain
           @click="showClick">
           </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!-- 对话框 -->
    <el-dialog title="修改订单地址"
    :visible.sync="dialogFormVisible">
        <el-form
        :label-width="formLabelWidth"
        :model="form">
          <el-form-item label="省市区/县">
            <!-- 多级下拉 -->
            <el-cascader
              expand-trigger="hover"
              :options="options"
              v-model="selectedOptions"
              @change="handleChange">
            </el-cascader>
          </el-form-item>
          <el-form-item label="详细地址">
              <el-input v-model="form.address" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
</template>
<script>
import  citydata from './city_data2017_element.js';

export default {
    data(){
        return {
            tableData:[],
            // 分页数据
            // 当前页码
            pagenum:1,
            // 默认每页显示多少条
            pagesize:10,
            // 总条数
            total:0,
            // 对话框显示与隐藏
            dialogFormVisible:false,
            // 下拉框
            options:[],
            selectedOptions:[],
            form:{
              // 详细地址
              address: '',
              // 多级下拉数据
              region:[]
            }
        }; 
    },
    created(){
      this.loadList();
    },
    methods:{ 
       async loadList(){
       let res = await this.$http.get(`orders?pagenum=${this.pagenum}&pagesize=${this.pagesize}`);
            this.total = res.data.data.total;
            this.tableData = res.data.data.goods;
     },
      handleSizeChange(val) {
        this.pagesize = val;
        this.loadList();
      },
      handleCurrentChange(val) {
        this.pagenum = val;
        this.loadList();
      },
      // 点击编辑按钮
     async showClick(){
      //  打开对话框
       this.dialogFormVisible = true;
      //  加载多级下拉数据
      this.options = citydata;
     }
    }

}  
</script>
<style>
 .el-table{
     margin-top: 10px;
     margin-bottom: 10px;
 }
</style>
