import React, { Component } from 'react'
import PubSub from 'pubsub-js'
import axios from 'axios'
import { Chart } from '@antv/g2';
import Date from '../../components/Date';

import './index.css'
import 'antd/dist/antd.css';
import { message } from 'antd';
export default class HeatMap extends Component {
    componentDidMount() {
        var heatmap;
        let heatflag = 0;
        const key = 'updatable';
        let container = this.refs.container;
        let style = []
        
       
        var map = new window.AMap.Map(container, {
   
          center: [113.0683,23.12897],
          zoom:9,
          mapStyle: 'amap://styles/whitesmoke'
       });
        map.plugin(["AMap.HeatMap"],function() {      //加载热力图插件
          heatmap = new window.AMap.HeatMap(map,{
          zIndex:10,
          radius: 25, //给定半径
          opacity: [0, 0.7],
          gradient:{
              0.5: '#0059ff',
              0.65: '#66d8ff',
              0.7: '#ffdf80',
              0.9: '#ffb200',
              1.0: '#ff6500'
          }
          });    //在地图对象叠加热力图
          
        });  
       
  

      
              //promise链
        let token1 = PubSub.subscribe('date',(_,data)=>{
            data[0] = data[0].replace(' ','_');
            data[1] = data[1].replace(' ','_');
          
            if(heatflag === 0){
                heatflag = 1;
                let isOk = 1;
        
                (async () => {
                    const sleep = delay => new Promise(resolve => setTimeout(resolve, delay || 0))
                    message.loading({ content: '正在动态渲染...', key,duration:1000});
              
                    for (let i = 1; i <= 10; i++) {
                        axios.get('http://39.98.41.126:31100/selectByTimeSlot/'+data[0]+'/'+data[1]+'/'+ i +'/8000').then(
                            //eslint-disable-next-line no-loop-func    
                            response => {  
                                if(response.data){
                                    heatmap.setDataSet({data:response.data,max:30}); //设置热力图数据集
                                }
                               
                            },
                            //eslint-disable-next-line no-loop-func
                            error => {                           
                                isOk = 0;                     
                            }
                        )
                        if(!isOk){
                            message.warning({content:'服务器出现问题，加载失败！',duration:2});   
                            return; 
                        }
                        await sleep(2000)
                    }
                    if(isOk){
                        heatflag = 0;
                        message.success({ content: '渲染完成！', key, duration: 2 });
                    }
                   
                })()  
            }else{
                message.warning({content:'正在渲染中，请稍后再试！',duration:2});
            }
            
            
        }) 
    
        

  

  let cilckFlag = 0;
  window.AMapUI.loadUI(['geo/DistrictExplorer'], function(DistrictExplorer) {
    var currentAreaNode = null;
    //创建一个实例
    var districtExplorer = new DistrictExplorer({
        eventSupport: true,
        map: map
    });

     //绘制某个区域的边界
     function renderAreaPolygons(areaNode) {
      //更新地图视野
      map.setBounds(areaNode.getBounds(), null, null, true);
  
      //清除已有的绘制内容
      districtExplorer.clearFeaturePolygons();
  
      //绘制子区域
      districtExplorer.renderSubFeatures(areaNode, function(feature, i) {
  
          return {
              cursor: 'default',
              bubble: true,
              strokeColor: '#03DAC5', //线颜色
              strokeOpacity: 1, //线透明度
              strokeWeight: 1, //线宽
        
              fillOpacity: 0, //填充透明度
          };
      });
  
      //绘制父区域
      districtExplorer.renderParentFeature(areaNode, {
        cursor: 'default',
        bubble: true,
        strokeColor: '#03DAC5', //线颜色
        strokeOpacity: 1, //线透明度
        strokeWeight: 1, //线宽
        
        fillOpacity: 0, //填充透明度
      });
  }
  
  //切换区域后刷新显示内容
  function refreshAreaNode(areaNode) {
  
      districtExplorer.setHoverFeature(null);
  
      renderAreaPolygons(areaNode);
  
   
  }
  
  //切换区域
  function switch2AreaNode(adcode, callback) {
  
      if (currentAreaNode && ('' + currentAreaNode.getAdcode() === '' + adcode)) {
          return;
      }
  
      loadAreaNode(adcode, function(error, areaNode) {
  
          if (error) {
  
              if (callback) {
                  callback(error);
              }
  
              return;
          }
  
          currentAreaNode = window.currentAreaNode = areaNode;
  
          //设置当前使用的定位用节点
          districtExplorer.setAreaNodesForLocating([currentAreaNode]);
  
          refreshAreaNode(areaNode);
  
          if (callback) {
              callback(null, areaNode);
          }
      });
  }
  
  //加载区域
  function loadAreaNode(adcode, callback) {
  
      districtExplorer.loadAreaNode(adcode, function(error, areaNode) {
  
          if (error) {
  
              if (callback) {
                  callback(error);
              }
  
              console.error(error);
  
              return;
          }
  
        
  
          if (callback) {
              callback(null, areaNode);
          }
      });
  }
  switch2AreaNode(440100);
  });
  window.AMapUI.load(['ui/misc/PointSimplifier'], function(PointSimplifier) {
    let isLoading = 0;
    let colorType = 0;
    if (!PointSimplifier.supportCanvas) {
        alert('当前环境不支持 Canvas！');
        return;
    }
    let color = ['#E6556F','#E3843C', '#1EC78A', '#E24ED7','#71E24E','#4ECEE2']
    var pointSimplifierIns = new PointSimplifier({
        map: map, //所属的地图实例
        autoSetFitView: false,
        getPosition: function(item) {

            if (!item) {
                return null;
            }

            var parts = item.split(',');

            //返回经纬度
            return [parseFloat(parts[0]), parseFloat(parts[1])];
        },
        getHoverTitle: function(dataItem, idx) {
            return '区域'+(colorType+1);
        },
        badBoundsAspectRatio:0,
        renderConstructor: PointSimplifier.Render.Canvas.GroupStyleRender,
        renderOptions: {
            //点的样式
            pointStyle: {
                width: 6,
                height: 6,
                fillStyle:color[0]
            },
            //鼠标hover时的title信息
            hoverTitleStyle: {
                position: 'top'
            },
            getGroupId: function(item, idx) {
                return colorType
            },
            groupStyleOptions: function(gid) {
                return {
                    pointStyle: {
                        fillStyle: color[gid]
                    }
                };
            },
            topNAreaStyle:{
                autoGlobalAlphaAlpha:[0,0.1],
                getAreaScore:1,
                fillStyle:'#FF4500'
            }
        },
       
    });
  
    const flowPointShow = (num)=>{
        let isOk = 1;
        let key2 = 'flow123';
 
        if(num=== 2) num=3;
        else if(num === 3) num = 5;
        else if(num === 4) num = 6;
        else if(num === 5) num = 8;
        (async () => {
            const sleep = delay => new Promise(resolve => setTimeout(resolve, delay || 0))
  
            isLoading = 1;
           
            axios.get('http://39.98.41.126:31100/getFlowPoints/0/150000/'+num).then(
                //eslint-disable-next-line no-loop-func    
                response => { 
                    if(response.data.length === 0){
                        message.warning({content:'该类型暂无广州市内数据！',duration:2});
                    }else{
                        pointSimplifierIns.setData(response.data); 
                    }                          
                },
                //eslint-disable-next-line no-loop-func
                error => {                           
                    isOk = 0;                     
                }
            )
            if(!isOk){
                message.warning({content:'服务器出现问题，加载失败！',duration:2});   
                return; 
            }  
            await sleep(1000);
            isLoading = 0;
        })()  
        
    }
    window.pointSimplifierIns = pointSimplifierIns;
    try {
        let container2 = document.getElementById('flow-graph');
        const chart = new Chart({
            container: container2,
            autoFit: true,
            height: 500,
            padding: [30, 8, 70, 34],
        
        });
        window.chart = chart;
    chart.guide().text({
        top: true, // 指定 giude 是否绘制在 canvas 最上层，默认为 false, 即绘制在最下层
        position: ['24', '0'], // 文本的起始位置，值为原始数据值，支持 callback
        content: '时间(h)', // 显示的文本内容
        style: {  // 文本的图形样式属性
            fill: '#6d6d6d', // 文本颜色
            fontSize: '12', // 文本大小
        }, // 文本的图形样式属性
        offsetX: -30, // x 方向的偏移量
        offsetY:14, // y 方向偏移量
    })
    chart.guide().text({
        top: true, // 指定 giude 是否绘制在 canvas 最上层，默认为 false, 即绘制在最下层
        position: ['0', '4000'], // 文本的起始位置，值为原始数据值，支持 callback
        content: '流量', // 显示的文本内容
        style: {  // 文本的图形样式属性
            fill: '#6d6d6d', // 文本颜色
            fontSize: '12', // 文本大小
        }, // 文本的图形样式属性
        offsetX: -20, // x 方向的偏移量
        offsetY: -20, // y 方向偏移量
    })
   
    const flowGraphShow = (area)=>{
        let isOk = 1;
        let isLoading = 0;
        (async () => {
            const sleep = delay => new Promise(resolve => setTimeout(resolve, delay || 0))

            isLoading = 1;           
            axios.get('http://39.98.41.126:31100/getFlowLines/'+area).then(
                //eslint-disable-next-line no-loop-func    
                response => {  
                    chart.data(response.data);
                   
    
                    chart.axis('lineTime', true);
                    chart.scale({
                        weekend: {
                            min: 0,
                            max: 4000,
                        },
                        weekday: {
                            min: 0,
                            max: 4000,
                        },
                        predict: {
                            min: 0,
                            max: 4000,
                        }
                      });
                      chart.axis('weekend',{
                        grid:null
                      })
                      chart.axis('weekday',{
                        grid:{
                            line:{
                                style:{
                                    stroke:'#676767'
                                }
                            }
                        }
                      })
                      chart.axis('predict',{
                        grid:null
                      })
                      chart.tooltip({
                        title: (title) => title + '时',
                      });
                    chart.legend({
                    custom: true,
                    
                    itemName: {
                        style: {
                            fill: '#838282',
                        }
                    },
                    items: [
                        { name: '工作日', value: '工作日',marker: { symbol: 'bowtie', style: { stroke: '#1E6BFF', lineWidth: 2 } } },
                        { name: '周末', value: '周末', marker: { symbol: 'bowtie', style: { stroke: '#03DAC5', lineWidth: 2 } } },
                        { name: '预测', value: '预测', marker: { symbol: 'bowtie', style: { stroke: '#DB6BCF', lineWidth: 2 } } },
                    ],
                    });
                    
                    
                    chart.line().position('lineTime*weekday').color('#1E6BFF');
                    chart.line().position('lineTime*weekend').color('#03DAC5');
                    chart.line().position('lineTime*predict').color('#DB6BCF');
                    chart.removeInteraction('legend-filter'); // 自定义图例，移除默认的分类图例筛选交互
                    chart.render();
                    
                },
                //eslint-disable-next-line no-loop-func
                error => {                           
                    isOk = 0;                     
                }
            )
            if(!isOk){
                message.warning({content:'服务器出现问题，加载失败！',duration:2});   
                return; 
            }
            await sleep(1000);
            isLoading = 0;    
        })()  
    
    }
   
    const defTypeBtn = ()=>{
        (async () => {
            const sleep = delay => new Promise(resolve => setTimeout(resolve, delay || 0))
            let typeBtn = document.getElementsByClassName('flow-item');
            for(let i = 0;i<6;i++){
                //eslint-disable-next-line no-loop-func
                typeBtn[i].onclick = ()=>{
                    if(isLoading){
                        message.warning({content:'正在加载，请稍后',duration:2});
                        return;
                    }else{
                        for(let x of typeBtn) {         
                            x.classList.remove('btn-act');
                        }
                        typeBtn[i].classList.add('btn-act');      
                        colorType = i;
                        pointSimplifierIns.setData(null);
                        flowPointShow(i);
                        flowGraphShow(i);
                    }         
                }
            }   
             flowGraphShow(0);
            await sleep(500);
           
        })()  
    }

        defTypeBtn(); 

    } catch (error) {
        console.log('err');
    }
    
    

});
    
    }

    search = (e) => {
        if(e.keyCode !== 13){
            return;
        }
        console.log(e.target.value);
    }
    componentWillUnmount(){
        PubSub.unsubscribe('token1');
       
        this.setState = (state,callback) => {
            return;
        }
    }
    render() {
        return (
            <div className="map-ct">
                <div id="heat-section">
                    
                    <div id="time-ct">
                        <p>车流量热力图</p>         
                        <p>请在下方选择您需要查询的起始时间，系统会展示半小时内的出租车流量图</p>
                        <Date onOk={this.onOk}></Date>                       
                        
                        <p>Tips:<br/><span>目前只能查询2017年2.01~2.28的信息。</span></p>
                    </div>
                    <div id="flow-graph-ct">
                        <p>车流量统计</p>
                        <div id="flow-graph" ref="flow-graph" style={{width:'90%',height:'300px',marginLeft:'5%'}}></div>
                    </div>
                </div>
                <div style={{width:'80%',height:'100%'}} ref="container"></div>

                <div id="flow-selector">
                    <p>区域车流量概览</p>
                    <li className="flow-item"><span style={{backgroundColor:'#E6556F'}}></span>区域1</li>
                    <li className="flow-item"><span style={{backgroundColor:'#EEC055'}}></span>区域2</li>
        
                    <li className="flow-item"><span style={{backgroundColor:'#1EC78A'}}></span>区域3</li>
                    
                    <li className="flow-item"><span style={{backgroundColor:'#E24ED7'}}></span>区域4</li>
                    <li className="flow-item"><span style={{backgroundColor:'#4ECEE2'}}></span>区域5</li>
                 
                    <li className="flow-item"><span style={{backgroundColor:'#7F4EE2'}}></span>区域6</li>
                  
                    
                </div>
            </div>
        )
    }
}