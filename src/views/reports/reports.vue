<template>
  <el-card>
      <my-breadcrumb level1="数据统计" level2="数据报表"></my-breadcrumb>
      <div ref="chart" id="main" style="width: 800px;height:600px;"></div>
  </el-card>
</template>

<script>
// 导入echarts
import echarts from 'echarts';
export default {
    mounted(){
         this.init();
    },
    methods:{
       async init(){
       let res = await this.$http.get(`reports/type/1`);
       let option = res.data.data;
       const data = {
            title: {
                text: '用户来源'
            },
            tooltip : {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                    backgroundColor: '#6a7985'
                    }
                }
            },
            // 用于保存为图片功能
             toolbox: {
                feature: {
                    saveAsImage: {}
                }
           },
         }  
           option = {...data, ...option}
        //    理解为:横竖坐标轴 是否缩小  为true就会缩小
           option.xAxis[0].boundaryGap = false; 
            // 初始化echarts
            const  myChart = echarts.init(this.$refs.chart);
            myChart.setOption(option);
            }
        }
}
</script>

<style>
#main{
    margin-top:10px;
}
</style>
