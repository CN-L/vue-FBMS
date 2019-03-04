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
    data(){

    },
    mounted(){
         this.init();
    },
    methods:{
       init(){
       // 初始化echarts
       const  myChart = echarts.init(this.$refs.chart);
       const option = {
           title: {
                text: 'ECharts 入门示例'
            },
            tooltip: {},
            legend: {
                data:['销量']
            },
            xAxis: {
                data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
            },
            yAxis: {},
            series: [{
                name: '销量',
                type: 'bar',
                data: [5, 20, 36, 10, 10, 20]
            }]
       };
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
