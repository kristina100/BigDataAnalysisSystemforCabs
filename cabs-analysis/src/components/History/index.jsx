import React, { Component } from 'react'
import TimeList from '../../components/TimeList'
import AnalyseDate from '../../components/AnalyseDate'
import PubSub from 'pubsub-js'
import { Chart} from '@antv/g2'
import axios from 'axios'
/* import { registerShape } from '@antv/g2' */
import DataSet from '@antv/data-set';
import './index.css'
import { message } from 'antd'
export default class History extends Component {
    componentDidMount(){
        let container2 = this.refs.utilization;
        let container3 = this.refs.salary;
        let salaryData;
        let timeSelect = 0;
        let UseData;
        const ds = new DataSet();
        const chart1 = new Chart({
            container:  container3,
            autoFit: true,
            height: 500,
            padding:[20,20,20,14]
          });
          
          chart1.scale({
            Time: {
              range: [0.1, 0.9],
            },
            Value: {
              alias: '司机收入:',
              sync: true,
              nice: true
            },
          
          });
          chart1.axis('Time', {
            tickLine: null
          });
          chart1.axis('Value',{
            grid:{
                line:{
                    style:{
                        stroke:'#676767'
                    }
                }
            }
          })
          chart1.guide().text({
            top: true, // 指定 giude 是否绘制在 canvas 最上层，默认为 false, 即绘制在最下层
            position: ['100', '0'], // 文本的起始位置，值为原始数据值，支持 callback
            content: '(元)', // 显示的文本内容
            style: {  // 文本的图形样式属性
                fill: '#6d6d6d', // 文本颜色
                fontSize: '12', // 文本大小
            }, // 文本的图形样式属性
            offsetX: -6, // x 方向的偏移量
            offsetY: -200, // y 方向偏移量
        })
        /* registerShape('interval', 'borderRadius', {
          draw: function draw(cfg, container) {
            var points = cfg.points;
           
            var path = [];
          
            path.push(['M', points[0].x, points[0].y]);
            path.push(['L', points[1].x, points[1].y]);
            path.push(['L', points[2].x, points[2].y]);
            console.log(path);
         
            path = this.parsePath(path); // 将 0 - 1 转化为画布坐标
            return container.addShape('rect', {
              attrs: {
                x: path[1][1], // 矩形起始点为左上角
                y: path[1][2],
                width: path[2][1] - path[1][1],
                height: path[0][2] - path[1][2],
                fill: '#03dac5',
                radius: 4
              }
            });
          }
        }); */
        const view1 = chart1.createView();
        const key = 'updatable1';
        
        const getSalary = (date)=>{
            axios.get('http://39.98.41.126:31100/getSalary/'+date).then(
                //eslint-disable-next-line no-loop-func    
                response => {  
                    if(!response.data.data){
                      message.warning({content:'服务器遇到了问题，数据加载失败！',duration:2});
                      return;
                    }
                    salaryData = response.data.data;  
                    const dv = ds.createView().source(salaryData);
                    dv.transform({
                      type: 'map',
                      callback: row => {
                        row.Time = parseInt(row.Time, 10);
                        return row;
                      }
                    }).transform({
                      type: 'regression',
                      method: 'polynomial',
                      fields: ['Time', 'Value'],
                      bandwidth: 0.1,
                      as: ['Time', 'Value']
                    });
                    
                    
                    view1.data(salaryData);
                    view1
                      .interval()
                      .position('Time*Value')
                      .style({
                        fillOpacity: 1,
                        fill:'#03DAC5'
                      })/* .shape('borderRadius') */;
                      chart1.render();
                              
                    
                },
                error => {
                    console.log(error.message);
                }
            )
        }
       
        (async () => {
            const sleep = delay => new Promise(resolve => setTimeout(resolve, delay || 0))
            getSalary('02-01');
            await sleep(0)
        })()  
        let token1 = PubSub.subscribe('dateAna',(_,data)=>{
        (async () => {
            const sleep = delay => new Promise(resolve => setTimeout(resolve, delay || 0))
            getSalary(data)
            getUti(data);
            await sleep(0)
        })()  
        })
       
        
  

//利用率

const chart2 = new Chart({
  container: container2,
  autoFit: true,
  height: 500,

});
const showUti = (time)=>{
  chart2.data([time]);
      chart2.legend(false);
      chart2.tooltip({
        showMarkers: false
      });
    
      chart2.facet('rect', {
        fields: ['Time'],
        padding: 20,
        showTitle: false,
        eachView: (view, facet) => {
          const data = facet.data;
          let color='#03DAC5';
          data[0].Value = Math.round(data[0].Value * 1000) / 1000;
          data[0].Time = '已利用';
          data.push({ Time: '未利用', Value: Math.round((1 - data[0].Value) * 1000) / 1000 });
          view.data(data);
          view.coordinate('theta', {
            radius: 0.8,
            innerRadius: 0.5
          });
          view
            .interval()
            .adjust('stack')
            .position('Value')
            .color('Time', [color, '#1A6C64'])
            .style({
              opacity: 0.6,
              
            });
          view.annotation().text({
            position: [ '50%', '50%' ],
            content: data[0].Time,
            style: {
              fontSize: 12,
              fill: 'rgba(255,255,255,0.87)',
              fontWeight: 300,
              textBaseline: 'bottom',
              textAlign: 'center'
            },
            offsetY: -6,
          });
      
          view.annotation().text({
            position: ['50%', '50%'],
            content: data[0].Value,
            style: {
              fontSize: 18,
              fill: '#03DAC5',
              fontWeight: 500,
              textAlign: 'center'
            },
            offsetY: 10,
          });
      
          view.interaction('element-active');
        }
      });
      chart2.render();
}
const getUti = (date)=>{
  axios.get('http://39.98.41.126:31100/getUtilization/'+date).then(
    response =>{
      if(!response.data.data){
        return;
      }
      UseData =response.data.data;
      showUti(UseData[timeSelect])
    },
    error =>{
      console.log(error.message);
    }
  )
}
(async () => {
  const sleep = delay => new Promise(resolve => setTimeout(resolve, delay || 0))
  getUti('02-01');
  await sleep(0)
})()  
let token2 = PubSub.subscribe('timeUti',(_,data)=>{
  showUti(UseData[data])
  timeSelect = data;

})
    }
    componentWillUnmount(){
      PubSub.unsubscribe('token1','token2');
      this.setState = (state,callback) => {
          return;
      }
  }
    render() {
        return (
            <div id="ana-history">
              <div>
                  <p>数据分析</p>
                
                  <p>请在下方选择您想查看的时间：</p>
                  <AnalyseDate onChange={this.onChange} />
                </div>
                <div id="box1">
                  <p>出租车利用率</p>
                  <div id="utilization" ref="utilization">
                  <TimeList></TimeList>
                </div>
                </div>
                <div id="box2">
                <p>出租车司机收入</p>
                <div id="salary" ref="salary"></div>
                </div>
                
            </div>
        )
    }
}
