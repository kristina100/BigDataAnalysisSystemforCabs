import React, { Component } from 'react'
import History from '../../components/History'
import Predict from '../../components/Predict'
import { Switch,Redirect , Route } from 'react-router'
import { NavLink } from 'react-router-dom';
import './index.css'
import './intro.css'
export default class Advertise extends Component {
    componentDidMount(){
        let container1 = this.refs.container;
        


        var map = new window.AMap.Map(container1, {
   
          center: [113.0683,23.12897],
          zoom:9,
          mapStyle: 'amap://styles/whitesmoke'
       });
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
         //点标记
      let myList = [];
       let markerList = [[113.3883888 ,  23.04370157],
       [114.11066   ,  22.614832  ],
       [113.39779661,  23.03520641],
       [114.122851  ,  22.550083  ],
       [114.031334  ,  22.611129  ],
       [113.944172  ,  22.538665  ],
       [113.39278568,  23.04209278],
       [113.39631454,  23.03805442],
       [114.22046675,  22.66324175],
       [113.38610966,  23.04212242],
       [113.38838069,  23.03673003],
       [113.38824572,  23.042078  ],
       [113.39730714,  23.04021752],
       [113.385728  ,  23.058035  ]];
   
           // 创建一个 icon
       let serveIcon = new window.AMap.Icon({
         size: new window.AMap.Size(24, 24),
           // 图标的取图地址
           image: '../marker.png',
           // 图标所用图片大小
           imageSize: new window.AMap.Size(25, 25),
   
       });
    // 将 icon 传入 marker
     const showMarker = function(markerList){
       myList = [];
       for (let i=0;i<markerList.length;++i) {
           let marker = new window.AMap.Marker({
             icon:serveIcon,
             offset: new window.AMap.Pixel(-13, -30),
               position: markerList[i],
           })
           myList.push(marker);
           window.AMap.Event.addListener(marker, 'click', function () {
               lngLatToaddres(marker.getPosition().lng, marker.getPosition().lat,function(titleData) {
                   makeInfoWindow(marker.getPosition().lng.toFixed(4), marker.getPosition().lat.toFixed(4), marker,titleData)
               });
           })
         
       }
       map.add(myList);
     }
   
         const getComStations = ()=>{
           /* $.get("http://39.98.41.126:31101/crutch/getRecommend",(res,err)=>{
               markerList = [];
               markerList = JSON.parse(res).map((ele)=>{
                   return [ele.longitude,ele.latitude];
               });
               showMarker(markerList);
               getStationsData();
               if( btn[0].style.color !== "white") reloadFlag = 0;
           }) */
           showMarker(markerList);
       }
       // 经纬度转换为地址
       function lngLatToaddres(lng, lat,callback) {
           var geocoder,address;
           window.AMap.plugin(["AMap.Geocoder"], function () {
               geocoder = new window.AMap.Geocoder();
           })
           
           geocoder.getAddress([lng, lat], function (status, result) {
               if (status === 'complete' && result.info === 'OK') {
                   address = result.regeocode.formattedAddress;
                   callback(address);
               } 
           });
       }
       // 实例化信息窗体
       function makeInfoWindow(lng, lat, marker,titleData) {
           let title = `${titleData}`;
           let content = [];
           content.push(`经度：<span class="longitude">${lng}</span>
           纬度：<span class="latitude">${lat}</span>`);
           var infoWindow = new window.AMap.InfoWindow({
               isCustom: true,
               content: creatContent(title, content),
               offset: new window.AMap.Pixel(-3, -55)
           })
           infoWindow.open(map, marker.getPosition());
       }
   
       // 构建自定义信息窗体
       function creatContent(title, content) {
           let intro_box = document.createElement('div');
           intro_box.className = 'intro_box';
   
   
           let top = document.createElement('p');
           top.className = 'words';
           top.innerHTML = title;
           intro_box.appendChild(top);
   
           let titleX = document.createElement('span');
           titleX.className = 'after';
           titleX.innerHTML = '';
           intro_box.appendChild(titleX);
           titleX.onclick = closeinfoWindow;
   
           let lonLat = document.createElement('div');
           lonLat.className = 'lonLat';
           lonLat.innerHTML = content;
           intro_box.appendChild(lonLat);
   
           let triangle = document.createElement('div');
           triangle.className = 'triangle';
           intro_box.appendChild(triangle);
   
           return intro_box;
   
       }
       function closeinfoWindow() {
           map.clearInfoWindow();
       }
      
       getComStations(); 
    }
    render() {
        return (
            <div className="map-ct">
                <div id="analyse-graph">
                  
                  <div id="ana-btn-ct">
                    <NavLink className="ana-btn" to="/advertise/history">历史<div></div></NavLink>
                    <NavLink className="ana-btn" to="/advertise/predict">预测<div></div></NavLink>
                    
                  </div>
                  <div id="graph-box">
                    <Switch>
                      <Route path="/advertise/history" component={History}/>
                      <Route path="/advertise/predict" component={Predict}/>
                      <Redirect to="/advertise/history"/>
                    </Switch>
                  </div>
                </div>
                <div style={{width:'80%',height:'100%'}} ref="container"></div>
            </div>
        )
    }
}


