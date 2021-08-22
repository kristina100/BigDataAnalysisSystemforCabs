import React, { Component } from 'react'
import PubSub from 'pubsub-js'
import { message } from 'antd'
import { withRouter } from 'react-router-dom';

const key = 'updatable';

export default class Map extends Component {


    componentDidMount() {
        this.token = PubSub.subscribe('setCar', (_, stateObj) => {
            if (stateObj.finding) {
                message.loading({content:'正在查询车辆路径',key,duration:20})
                PubSub.publish('inputAble',{isFinding:true})
                this.setCar(stateObj.carName,stateObj.pathDate);
            }
            if (stateObj.delete) {
                this.deleteCar(stateObj.deleteIndex);
            }

        })

        var map = new window.AMap.Map(this.refs.container, {
            zoom: 12,
            mapStyle: 'amap://styles/whitesmoke',
            center:[113.2583, 23.1232]
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
        var colors = [
            "#4e72e2", "#1ec78a", "#eec055", "#e3843c", "#e6556f", "#0099c6", "#dd4477", "#66aa00",
            "#b82e2e", "#316395", "#994499", "#22aa99",
        ];

        window.AMapUI.load(['ui/misc/PathSimplifier', 'lib/$'], function (PathSimplifier, $) {
            window.PathSimplifier = PathSimplifier;
            if (!PathSimplifier.supportCanvas) {
                alert('当前环境不支持 Canvas！');
                return;
            }

            var pathSimplifierIns = new PathSimplifier({
                zIndex: 100,
                //autoSetFitView:false,
                map: map, //所属的地图实例

                getPath: function (pathData, pathIndex) {
                    // console.log(pathIndex);
                    return pathData.path;
                },
                getHoverTitle: function (pathData, pathIndex, pointIndex) {  
                    return pathData.name /* + '，点数量' + pathData.path.length */;
                },
                renderOptions: {
                    pathLineStyle: { //路径的样式
                        dirArrowStyle: true//轨迹上的箭头
                    },
                    getPathStyle: function (pathItem, zoom) {
                        var color = colors[pathItem.pathIndex] //以此取颜色
                        return {
                            pathLineHoverStyle: {
                                strokeStyle: color,
                            },
                            pathLineStyle: { //轨迹线的样式
                                strokeStyle: color,
                                lineWidth: 8,
                            },
                            pathLineSelectedStyle: {    //轨迹线处于选中状态的样式
                                strokeStyle: color,
                                lineWidth: 12
                            },
                            pathNavigatorStyle: {//轨迹巡航器(那个箭头一样的东西)样式
                                fillStyle: color,
                                // content: PathSimplifier.Render.Canvas.getImageContent(''),

                            },
                            startPointStyle:{
                                fillStyle: '#BB86FC',
                                radius: 7,
                                strokeStyle:'white'
                            },
                            endPointStyle: {
                                fillStyle: '#BB86FC',
                                radius: 7,
                                strokeStyle:'white'
                            },
                        };
                    }
                }
            });

            window.pathSimplifierIns = pathSimplifierIns;
        });
    }

    setCar = async(carName,pathDate) => {
        let carPath = []
        let allPath = []
        if(window.pathSimplifierIns._data !== undefined){
            allPath = window.pathSimplifierIns._data.source;
        }
        //获取到车牌号，将车牌号传入后台，获取数据将路径存入路径总数组种
        if(carName === undefined || carName === ''){
            message.warning({content:'请输入车牌号！',key ,duration:1.5})
            PubSub.publish('existCar',{isFinding:false})
            return ;
        }else if(carName.length < 5){
            message.warning({content:'请输入正确的车牌号！',key ,duration:1.5})
            PubSub.publish('existCar',{isFinding:false})
            return ;
        }
        let sendCarName = '粤A' + carName
        if(pathDate === undefined || pathDate === ''){
            message.warning({content:'请输入查询时间！',key ,duration:1.5})
            PubSub.publish('existCar',{isFinding:false})
            return ;
        }
        let sendDate = pathDate.slice(5,7)+pathDate.slice(8,10);

        const response = await fetch(`http://39.98.41.126:31100/getTrace/${sendCarName}/${sendDate}`)
        const data = await response.json()
        if(data.path !== null){
            message.success({content:'查询成功！',key ,duration:1.5})
            PubSub.publish('existCar',{exist:true,isFinding:false})
        }else {
            console.log(2);
            message.warning({content:'未查询到该出租车',key ,duration:1.5});
            PubSub.publish('existCar',{exist:false,isFinding:false})
            return ;
        }
        // data.path = gaodeMap;
        carPath = data;


        allPath.push(carPath);
        //设置数据
        window.pathSimplifierIns.setData(allPath);

        //巡航器
        for (let i = 0; i < allPath.length; i++) {
            this.newNavg(i)
        }

    }

    newNavg = (index) => {
        var navg = window.pathSimplifierIns.createPathNavigator(index, {
            loop: true, //循环播放
            speed: 1000, //巡航速度，单位千米/小时
            pathNavigatorStyle: {
                pathLinePassedStyle: null,
                fillStyle: 'red',                                
                width: 30,
                height: 30,
                content: window.PathSimplifier.Render.Canvas.getImageContent('../../car2.png'),
            }
        });
        navg.start();
    }

    deleteCar = (dIndex) => {
        if(window.pathSimplifierIns._data !== undefined){
            let allPath = window.pathSimplifierIns._data.source;
            allPath.splice(dIndex, 1);
            window.pathSimplifierIns.setData(allPath);
            for (let i = 0; i < allPath.length; i++) {
                this.newNavg(i)
            }
        }else{
            message.warning('已经没有路径可供删除了')
        }

        
    }

    componentWillUnmount() {
        PubSub.unsubscribe(this.token)
    }

    render() {
        return (
            <div ref="container" style={{ width: "80%", height: "100%" }}></div>
        )
    }
}
