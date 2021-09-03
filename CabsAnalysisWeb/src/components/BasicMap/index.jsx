import React, { Component } from 'react'



export default class BasicMap extends Component {
	componentDidMount(){
		let container = document.getElementsByClassName('map-ct')[0];
		var map = new window.AMap.Map(container, {
		center: [113.26929,23.135137],
		zoom:12,
		mapStyle: 'amap://styles/whitesmoke'
	});
<<<<<<< HEAD
	}
	render() {
		return (
			<div className="map-ct"></div>
=======
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
	}
	render() {
		return (
			<div className="map-ct" style={{width:'100%'}}></div>
>>>>>>> 909892b1b180361ac26c62fe532772ff25415da9
		)
	}
}
