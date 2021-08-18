import React, { Component } from 'react'
import TimeList from '../../components/TimeList'
import AnalyseDate from '../../components/AnalyseDate'
import PubSub from 'pubsub-js'
import { Chart} from '@antv/g2'
import axios from 'axios'
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
            padding: [20, 40],
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
                      });
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
        PubSub.subscribe('dateAna',(_,data)=>{
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
  height: 500
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
            .color('Time', [color, '#eceef1'])
            .style({
              opacity: 1,
            });
          view.annotation().text({
            position: [ '50%', '50%' ],
            content: data[0].Time,
            style: {
              fontSize: 12,
              fill: 'white',
              fontWeight: 300,
              textBaseline: 'bottom',
              textAlign: 'center'
            },
            offsetY: -12,
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
PubSub.subscribe('timeUti',(_,data)=>{
(async () => {
  const sleep = delay => new Promise(resolve => setTimeout(resolve, delay || 0))
  showUti(UseData[data])
  timeSelect = data;
  await sleep(0)
})()  
})
    }
    render() {
        return (
            <div id="ana-history">
                <p>数据分析</p>
                <p>请在下方选择您想查看的时间：</p>
                <AnalyseDate onChange={this.onChange} />
                <p>出租车利用率</p>
                <div id="utilization" ref="utilization">
                <TimeList></TimeList>
                </div>
                
                <p>出租车司机收入</p>
                <div id="salary" ref="salary"></div>
            </div>
        )
    }
}
