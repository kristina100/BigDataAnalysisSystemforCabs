import React, { Component } from 'react'
import PubSub from 'pubsub-js'
import axios from 'axios'

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
        PubSub.subscribe('date',(_,data)=>{
            data[0] = data[0].replace(' ','_');
            data[1] = data[1].replace(' ','_');
            
            if(heatflag === 0){
                heatflag = 1;
                (async () => {
                    const sleep = delay => new Promise(resolve => setTimeout(resolve, delay || 0))
                    message.loading({ content: '正在渲染...', key});
          
                    for (let i = 1; i <= 10; i++) {
                        axios.get('http://39.98.41.126:31106/selectByTimeSlot/'+data[0]+'/'+data[1]+'/'+ i +'/10000').then(
                            //eslint-disable-next-line no-loop-func    
                            response => {  
                                heatmap.setDataSet({data:response.data,max:60}); //设置热力图数据集
                            },
                            error => {
                                console.log(error.message);
                            }
                        )
                        await sleep(1500)
                    }
                    message.success({ content: '渲染完成！', key, duration: 2 });
                    heatflag = 0;
                })()  
            }else{
                message.warning({content:'正在渲染中，请稍后再试！',duration:2});
            }
            
            
        }) 
    
        
  
         
  
       //反高亮
      /*  window.AMapUI.loadUI(['geo/DistrictExplorer'], function(DistrictExplorer) {
  
  
  initPage(DistrictExplorer);
  });
  
  function getAllRings(feature) {
  
  var coords = feature.geometry.coordinates,
      rings = [];
  
  for (var i = 0, len = coords.length; i < len; i++) {
      rings.push(coords[i][0]);
  }
  
  return rings;
  }
  
  function getLongestRing(feature) {
  var rings = getAllRings(feature);
  
  rings.sort(function(a, b) {
      return b.length - a.length;
  });
  
  return rings[0];
  }
  
  function initPage(DistrictExplorer) {
  //创建一个实例
  var districtExplorer = new DistrictExplorer({
      map: map,
      eventSupport:true
  });
  
  var countryCode = 100000, //全国
      cityCodes = [
          440100
      ];
  
  districtExplorer.loadMultiAreaNodes(
      //只需加载全国和市，全国的节点包含省级
      [countryCode].concat(cityCodes),
      function(error, areaNodes) {
  
          var countryNode = areaNodes[0],
              cityNodes = areaNodes.slice(1);
  
          var path = [];
  
          //首先放置背景区域，这里是大陆的边界
          path.push(getLongestRing(countryNode.getParentFeature()));
  
  
      
  
          for (var i = 0, len = cityNodes.length; i < len; i++) {
              //逐个放置需要镂空的市级区域
              path.push.apply(path, getAllRings(cityNodes[i].getParentFeature()));
          }
  
          //绘制带环多边形
          //https://lbs.amap.com/api/javascript-api/reference/overlay#Polygon
          var polygon = new window.AMap.Polygon({
              bubble: true,
              lineJoin: 'round',
              strokeColor: 'red', //线颜色
              strokeOpacity: 1, //线透明度
              strokeWeight: 1, //线宽
              fillColor: 'black', //填充色
              fillOpacity: 0.05, //填充透明度
              map: map,
              path: path
          });
      });
  } */
  
  //just some colors
  var colors = [
    "#3366cc"
  ];
  let cilckFlag = 0;
  window.AMapUI.loadUI(['geo/DistrictExplorer'], function(DistrictExplorer) {
    var currentAreaNode = null;
    //创建一个实例
    var districtExplorer = new DistrictExplorer({
        eventSupport: true,
        map: map
    });
  
    //创建一个辅助Marker，提示鼠标内容
    var tipMarker = new window.AMap.Marker({
        //启用冒泡，否则click事件会被marker自己拦截
        bubble: true,
   
    });
  
  
    //监听feature的hover事件
    districtExplorer.on('featureMouseout featureMouseover', function(e, feature) {
      var polys = districtExplorer.findFeaturePolygonsByAdcode(feature.properties.adcode);
      let isHover = e.type === 'featureMouseover';
        polys[0].setOptions({
            fillOpacity: isHover ? 0.3 : (cilckFlag?0.3:0)
        }); 
      if (!isHover) {
        tipMarker.setMap(null);
        return;
      }
      tipMarker.setMap(map);
      tipMarker.setPosition(e.originalEvent.lnglat);
      tipMarker.setLabel({
        offset: new window.AMap.Pixel(20, 20),
        content: feature.properties.name
      });
    });
  
    //监听鼠标在feature上滑动
    districtExplorer.on('featureMousemove', function(e, feature) {
        //更新提示位置
        tipMarker.setPosition(e.originalEvent.lnglat);
    });
  
    //feature被点击
    districtExplorer.on('featureClick', function(e, feature) {
      var props = feature.properties;
        //如果存在子节点
        // if (props.childrenNum > 0) {
            //切换聚焦区域
            switch2AreaNode(props.adcode);
        // }
/*       PubSub.publish('area',feature.properties.name); */
      var polys = districtExplorer.findFeaturePolygonsByAdcode(feature.properties.adcode);
    
        polys[0].setOptions({
            fillOpacity: 0.3
        });
        cilckFlag = 1;
    });
  
    //外部区域被点击
    districtExplorer.on('outsideClick', function(e) {
    
      districtExplorer.locatePosition(e.originalEvent.lnglat, function(error, routeFeatures) {
  
        if (routeFeatures && routeFeatures.length > 1) {
            //切换到省级区域
            switch2AreaNode(440100);
        } 
  
    }, {
        levelLimit: 2
    });
    cilckFlag = 0;
    });
  
  
    
  
     //绘制某个区域的边界
     function renderAreaPolygons(areaNode) {
      //更新地图视野
      map.setBounds(areaNode.getBounds(), null, null, true);
  
      //清除已有的绘制内容
      districtExplorer.clearFeaturePolygons();
  
      //绘制子区域
      districtExplorer.renderSubFeatures(areaNode, function(feature, i) {
  
          var fillColor = colors[i % colors.length];
          var strokeColor = colors[colors.length - 1 - i % colors.length];
  
          return {
              cursor: 'default',
              bubble: true,
              strokeColor: strokeColor, //线颜色
              strokeOpacity: 1, //线透明度
              strokeWeight: 1, //线宽
              fillColor: fillColor, //填充色
              fillOpacity: 0, //填充透明度
          };
      });
  
      //绘制父区域
      districtExplorer.renderParentFeature(areaNode, {
          cursor: 'default',
          bubble: true,
          strokeColor: 'gray', //线颜色
          strokeOpacity: 1, //线透明度
          strokeWeight: 1, //线宽
          fillColor: areaNode.getSubFeatures().length ? null : colors[0], //填充色
          fillOpacity: 0.35, //填充透明度
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
  
  
  
  
      }

    search = (e) => {
        if(e.keyCode !== 13){
            return;
        }
        console.log(e.target.value);
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
                </div>
                <div style={{width:'80%',height:'100%'}} ref="container"></div>
            </div>
        )
    }
}