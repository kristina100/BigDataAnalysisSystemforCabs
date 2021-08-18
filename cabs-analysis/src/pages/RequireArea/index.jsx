import React, { Component } from 'react';
import PubSub from 'pubsub-js'
import axios from 'axios';
import './index.css'
import { isTSExpressionWithTypeArguments } from '@babel/types';
import { func } from 'prop-types';
import { flushSync } from 'react-dom';
import MyNavLink from '../../components/MyNavLink';
import Datepick from './Datepick'

import { Switch } from 'antd';
import { DatePicker, Space, message } from 'antd';



var map
let flowColor = [
    "#69c0ff", "#ff7875", "#a0d911", "#ffc53d", "#b37feb", "#0099c6", "#dd4477", "#66aa00",
    "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707",
    "#651067", "#329262", "#5574a6", "#3b3eac"
];

export default class Rightcontent extends Component {

    state = ({
        ableTurn: false,
        dataPrint: null,
        pointSimplifierIns: null,
    })


    warning = (msg) => {
        message.warning(msg, 2);
    };


    // 根据流向开关得状态控制是否显示时间输入框
    onChangeOpenFlow = (checked) => {
        const { chooseTime } = this.refs;
        checked ? chooseTime.style = 'visibility: visible' : chooseTime.style = 'visibility: hidden';
        if (checked) alert('请在右侧选择流向图的时间')
        if (!checked) {
            PubSub.publish('cleanValue', true)
            window.pathSimplifierIns.setData([]);
            // this.state.locaObj.destroy();
            // this.allFlowShow('', true)
            window.loca.destroy();
            console.log(window.loca);
        }
    }

    // 根据state中的数据与开关的状态来展示载客热点
    onChangeOpenHot = (checked) => {
        const { dataPrint, pointSimplifierIns } = this.state;
        checked ? pointSimplifierIns.setData(dataPrint) : pointSimplifierIns.setData(null);
    }

    

    componentDidMount() {



        let flagChange = 0;
        let timeArr = [];
        let flag = 0;
        let initDataPrint;
        let addressPrint = [];
        let geocoder;
        const { container } = this.refs;
        let that = this; // 记录此时this的指向，指向实例
        //订阅流向图时间

        // initDataPrint = ["113.33085770273631, 23.14412365284972", "113.27855780013734, 23.128367111649794", "113.32146935484826, 23.106662663168706", "113.40117706518718, 23.123214006229343", "113.25019001320405, 23.15818645574991", "113.30712665579317, 22.996942543368675", "113.27777220955363, 23.21131444325503", "113.27348812437376, 23.09112787687527", "113.242374477253, 23.1154384664252", "113.30674584736516, 23.38053648285072"]
        // this.setState({ dataPrint: initDataPrint })



        let initData = new Promise(function (resolve, reject) {

            map = new window.AMap.Map(container, {
                center: [113.364931, 23.275388],
                zoom: 8.8,
                resizeEnable: true, // 是否监控地图容器尺寸变化
                mapStyle: 'amap://styles/whitesmoke'
    
            });
           
            axios.get(`http://39.98.41.126:31100/getHotPoints`).then(
                response => {
                    console.log(response.data);
                    initDataPrint = response.data.data2.split('\n');
                    console.log(initDataPrint);
                    initDataPrint = initDataPrint.filter((item) => {
                        return item != ''
                    })
                    addressPrint = response.data.data1;
                    // this.setState({ dataPrint: initDataPrint, addressPrint: response.data.data1 })
                    // console.log(this.state);
                    console.log(addressPrint, initDataPrint);
                    resolve({ addressPrint, initDataPrint });
                }
            )
        })

        // 加载圆形自定义区域
        initData.then(function (data) {

            that.token = PubSub.subscribe('flowDate', (_, stateObj) => {
                that.setState({ ableTurn: true })
                // this.flowShow(stateObj.flowDate)
                that.setFlowPath(stateObj.flowDate)
                // console.log(window.loca);
                // console.log(loca);
                if (flag === 1) {
                    console.log(window.loca);
                    if (window.loca.layers.length !== 0) {
                        console.log(window.loca);
                        window.loca.destroy();
                    }
                }
                that.creatLoca()
                flag = 1;
                console.log(1);
                that.allFlowShow('')
    
                // this.setState({ locaObj: this.allFlowShow() })
                // console.log(this.allFlowShow());
            })

            console.log(data);

            that.setState({ dataPrint: data.initDataPrint, addressPrint: data.addressPrint })
            console.log(that.state);
            let circleData = data
            // const map = new window.AMap.Map(container, {
            //     center: [113.364931, 23.275388],
            //     zoom: 8.8,
            //     resizeEnable: true, // 是否监控地图容器尺寸变化
            //     mapStyle: 'amap://styles/whitesmoke'

            // });
            // map.add(circle)

            for (var k in circleData) {
                console.log(k);
                console.log([parseFloat(k.split(',')[0]), parseFloat(k.split(',')[1])]);
                console.log(circleData[k]);

                // 加载圆形自定义区域
                let circle = new window.AMap.Circle({
                    center: [parseFloat(k.split(',')[0]), parseFloat(k.split(',')[1])],
                    radius: circleData[k],
                    fillColor: 'red',
                    strokeColor: '#fff',
                    strokeWeight: 1
                })

            }


            // 加载逆地址编码的插件
            window.AMap.plugin(["AMap.Geocoder"], function () {
                geocoder = new window.AMap.Geocoder();
            })

            // 海量点标记 + （行政区域划分）/ （自定义区域划分）
            window.AMapUI.load(['ui/misc/PointSimplifier', 'ui/geo/DistrictExplorer', 'lib/$'], function (PointSimplifier, DistrictExplorer, $) {
                if (!PointSimplifier.supportCanvas) {
                    alert('当前环境不支持 Canvas！');
                    return;
                }
                initPage(PointSimplifier, DistrictExplorer, $);  // 初始化海量点标记 + (行政区划分)
                // myAddPolygon(shanghai);  // 绘制边界数据到地图上，自定义区域划分
                // myAddPolygon(suzhou);  // 

            });

            //主流向初始化
            window.AMapUI.load(['ui/misc/PathSimplifier', 'lib/$'], function (PathSimplifier, $) {

                if (!PathSimplifier.supportCanvas) {
                    alert('当前环境不支持 Canvas！');
                    return;
                }

                var pathSimplifierIns = new PathSimplifier({
                    zIndex: 100,
                    // zoom:,
                    //autoSetFitView:false,
                    map: map, //所属的地图实例

                    getPath: function (pathData, pathIndex) {

                        return pathData.path;
                    },
                    getHoverTitle: function (pathData, pathIndex, pointIndex) {
                        return '主流向';
                    },
                    renderOptions: {
                        pathLineStyle: { //路径的样式
                            dirArrowStyle: {
                                width: 7
                            }
                        },
                        getPathStyle: function (pathItem, zoom) {

                            var color = flowColor[pathItem.pathIndex] //以此取颜色
                            // lineWidth = Math.round(4 * Math.pow(1.1, zoom - 3));    //线宽随zoom增大
                            // console.log(pathItem.pathIndex);
                            return {
                                pathLineHoverStyle: {
                                    strokeStyle: color,
                                },
                                pathLineStyle: { //轨迹线的样式
                                    strokeStyle: color,
                                    lineWidth: 4
                                },
                                pathLineSelectedStyle: {    //轨迹线处于选中状态的样式
                                    strokeStyle: color,
                                    lineWidth: 6
                                },
                                pathNavigatorStyle: {//轨迹巡航器(那个箭头一样的东西)样式
                                    fillStyle: color,
                                    // content: PathSimplifier.Render.Canvas.getImageContent(''),

                                },
                                startPointStyle: {
                                    fillStyle: '#03dac5',
                                    radius: 5,
                                    strokeStyle: 'white'
                                },
                                endPointStyle: {
                                    fillStyle: '#03dac5',
                                    radius: 5,
                                    strokeStyle: 'white'
                                }
                            };
                        }
                    }
                });

                window.pathSimplifierIns = pathSimplifierIns;
            })



            // const scene = new window.L7.Scene({
            //     id: 'map',
            //     map: new window.L7.GaodeMap({
            //         mapInstance: map,
            //     }),
            // });
            // scene.on('loaded', () => {
            //     fetch('https://gw.alipayobjects.com/os/rmsportal/UEXQMifxtkQlYfChpPwT.txt')
            //         .then(res => res.text())
            //         .then(data => {
            //             const layer = new window.L7.LineLayer({ zIndex: 10 })
            //                 .source(data, {
            //                     parser: {
            //                         type: 'csv',
            //                         x: 'lng1',
            //                         y: 'lat1',
            //                         x1: 'lng2',
            //                         y1: 'lat2'
            //                     }
            //                 })
            //                 .size(1)
            //                 .shape('arc')
            //                 .color('#8C1EB2')
            //                 .style({
            //                     opacity: 0.8,
            //                     blur: 0.99
            //                 });
            //             scene.addLayer(layer);
            //         });
            // });



            // ui组件初始化界面(海量点标记 + 行政区域划分)
            function initPage(PointSimplifier, DistrictExplorer, $) {
                let dataPrint;
                let currentAreaNode = null;
                // 海量数据点
                let pointSimplifierIns = new PointSimplifier({
                    autoSetFitView: false, //禁止自动更新地图视野
                    map: map, //所属的地图实例

                    // 返回点标记的经纬度
                    getPosition: function (item) {
                        if (!item) {
                            return null;
                        }
                        // 数组字符串形式，便于渲染整个数据
                        let parts = item.split(",");

                        return [parseFloat(parts[0]), parseFloat(parts[1])];
                    },
                    getHoverTitle: function (dataItem, idx) {
                        return idx + ': ' + dataItem;
                    },
                    renderOptions: {
                        //点的样式
                        pointStyle: {
                            width: 6,
                            height: 6,
                            fillStyle: 'green'
                        },
                        //鼠标hover时的title信息
                        hoverTitleStyle: {
                            position: 'top'
                        }
                    }
                });
                window.pointSimplifierIns = pointSimplifierIns;

                // 将海量数据点保存在state中
                that.setState({ pointSimplifierIns: pointSimplifierIns })

                // 行政区划分
                let districtExplorer = new DistrictExplorer({
                    map: map,
                    // 允许事件
                    eventSupport: true,
                })

                // 悬浮的提示框
                let tipMessage = document.createElement('div');
                document.body.appendChild(tipMessage);

                let tipMarker = new window.AMap.Marker({
                    content: tipMessage,
                    offset: new window.AMap.Pixel(0, 0),
                    bubble: true
                })

                // 注册鼠标移动事件
                districtExplorer.on('featureMousemove featureMouseout', function (e, feature) {
                    toggleisHoverStyle(feature, e.type === 'featureMousemove', e.originalEvent ? e.originalEvent.lnglat : null)
                })

                // 点击展示海量数据点
                districtExplorer.on('featureClick', function (e, feature) {
                    console.log(Switch);
                    Switch.__ANT_SWITCH = false;
                    flagChange++;
                    let time1 = toRealTime(timeArr[timeArr.length - 1]);
                    let time2 = toRealTime(timeArr[timeArr.length - 2]);
                    const { name, adcode } = feature.properties;
                    let data = [];
                    timeArr.push(Date.now());

                    if (time1[0] == time2[0] && time1[1] == time2[1] && time1[2] - time2[2] <= 0.5 && time1[0] != NaN && time2[0] != NaN) {
                        that.warning('请您勿频繁的点击！')  // 注意此时的this指向不是实例
                        pointSimplifierIns.setData(null);
                        timeArr = [];
                        flagChange = 0;
                    } else {
                        const { dataPrint } = that.state
                        if (flagChange >= 15) {
                            that.warning('请您勿频繁的操作！')
                            pointSimplifierIns.setData(null);
                            timeArr = [];
                            flagChange = 0;
                        } else {
                            getData(dataPrint, adcode, function (newDataPrint) {
                                data = newDataPrint;
                                pointSimplifierIns.setData(data);
                            })
                        }
                    }
                })

                function toRealTime(mss) {
                    var time = [];
                    var hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    var minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
                    var seconds = (mss % (1000 * 60)) / 1000;

                    time.push(hours, minutes, seconds)
                    return time;
                }

                // 注意必须要加载区域
                function switchAreaNode(adcode, callback) {
                    if (currentAreaNode && ('' + currentAreaNode.getAdcode() === '' + adcode)) {
                        return;
                    }
                    loadAreaNode(adcode, function (error, areaNode) {

                        if (error) {

                            if (callback) {
                                callback(error);
                            }

                            return;
                        }

                        currentAreaNode = window.currentAreaNode = areaNode;

                        //设置当前使用的定位用节点
                        districtExplorer.setAreaNodesForLocating([currentAreaNode]);

                        renderAreaNode(districtExplorer, areaNode);

                        if (callback) {
                            callback(null, areaNode);
                        }
                    });
                }

                //加载区域
                function loadAreaNode(adcode, callback) {
                    districtExplorer.loadAreaNode(adcode, function (error, areaNode) {
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
                switchAreaNode(440100);

                // 拿到该区域内部的点
                function getData(dataPrint, adcode, callback) {
                    let newDataPrint = [];
                    dataPrint.filter((item) => {
                        geocoder.getAddress([parseFloat(item.split(',')[0]), parseFloat(item.split(',')[1])], function (status, result) {
                            if (status == 'complete' && result.info == 'OK') {
                                if (Number(result.regeocode.addressComponent.adcode) === adcode) {
                                    newDataPrint.push(item);
                                    callback(newDataPrint);
                                } else if (newDataPrint.length == 0) (
                                    callback(null)
                                )
                            }
                        })
                    })
                }
                // 根据是否经过该区域修改样式的回调函数
                function toggleisHoverStyle(feature, isHover, lnglat) {
                    // 根据是否经过区域，加上所需的提示框
                    tipMarker.setMap(isHover ? map : null);
                    if (!feature) {
                        return;
                    }
                    // 当前点所在的区名、区域代号、中心
                    const { name, adcode, center } = feature.properties

                    if (isHover) {
                        tipMessage.innerHTML = `${adcode}: ${name}`
                        tipMessage.className = 'tipMessage tipMarker top';
                        //更新位置
                        tipMarker.setPosition(lnglat || center);
                    }

                    // 更改经过的区域的样式 (根据区域代码找到这个区域，修改他的样式
                    let polys = districtExplorer.findFeaturePolygonsByAdcode(adcode);
                    polys.map((item) => {
                        item.setOptions({
                            fillOpacity: isHover ? 0.4 : 0.05
                        })
                    })
                }



            }
            // 绘制行政区域
            function renderAreaNode(districtExplorer, areaNode) {
                let colors = [
                    "#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00",
                    "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707",
                    "#651067", "#329262", "#5574a6", "#3b3eac"
                ];
                // 子级别区域绘制
                districtExplorer.renderSubFeatures(areaNode, function (feature, i) {
                    // i 是子区域的下标，有几个子区域就会调用该子区域绘制方法几次

                    // 不同的颜色
                    let fillColor = colors[i % colors.length];
                    let strokeColor = colors[colors.length - 1 - i % colors.length];
                    return {
                        cursor: 'default',
                        bubble: true,
                        strokeColor: strokeColor, //线颜色
                        strokeOpacity: 1, //线透明度
                        strokeWeight: 1, //线宽
                        fillColor: fillColor, //填充色
                        fillOpacity: 0.05, //填充透明度
                    }
                });

            }




            // 海量点标记 + 根据热度划分区域（自定义划分区域）
            // function myAddPolygon(data) {
            //     let polygon = new window.AMap.Polygon({
            //         path: data,    // 根据传入的边界坐标绘制路径
            //         fillCOlor: 'black',
            //         fillOpacity: 0.5,
            //         strokeColor: 'skyblue',
            //         strokeOpcity: 0.6,
            //         strokeWeight: 1,
            //         strokeStyle: 'dashed',
            //         strokeDasharray: [5, 5],
            //         // 这里是动态的区域代号
            //         extData: { id: `${++i}` }
            //     })

            //     polygon.on('mouseover', () => {
            //         polygon.setOptions({
            //             fillCOlor: 'black',
            //             fillOpacity: 0.7,
            //         })
            //     })

            //     polygon.on('mouseout', () => {
            //         polygon.setOptions({
            //             fillCOlor: '#00B2D5',
            //             fillOpacity: 0.5,
            //         })
            //     })

            //     // 自定义区域中使用海量点标记
            //     // 点击对应的区域可以根据id值拿到该区域的热点位置
            //     polygon.on('click', () => {
            //         // 拿到这个区域的id值，去请求其内部的载客热点
            //         let id = polygon.getExtData().id
            //         // 请求接口
            //         axios.get(`http://39.98.41.126:31100/qgtaxi/getHotPoints/xxx/${id}`).then(
            //             response => {

            //                 dataPrint = response.data.split('\n');
            //                 dataPrint = dataPrint.filter((item) => {
            //                     return item != ''
            //                 })
            //                 pointSimplifierIns.setData(dataPrint);
            //             },
            //             error => {
            //                 console.log(error.message);
            //             }
            //         )
            //     })
            //     map.add(polygon)
            // }

        })

        
    }

    creatLoca = () => {
        console.log(map);
        var loca = new window.Loca.Container({
            map,
            zIndex: 120,
        });

        window.loca = loca
    }

    allFlowShow = async (dateString) => {
        // console.log(dateString);
        let finalLine = [],
            finalSpot = [],
            allLine = [];

        const response = await fetch(`http://39.98.41.126:31100/getFlow/2017-02-01`)
        const data = await response.json()
        // allLine = [[[113.28999, 23.141978], [113.29159, 23.133918]], [[113.295329, 23.135204], [113.297756, 23.134193]], [[113.293236, 23.135864], [113.287175, 23.131443]], [[113.28404, 23.140312], [113.29048, 23.139172]], [[113.292323, 23.135212], [113.298387, 23.129857]], [[113.288447, 23.136388], [113.288557, 23.135002]], [[113.289015, 23.129656], [113.290402, 23.126334]], [[113.2818, 23.126182], [113.290369, 23.127663]], [[113.295512, 23.132611], [113.298598, 23.135691]], [[113.287519, 23.135789], [113.289708, 23.133277]], [[113.287734, 23.13416], [113.293702, 23.135313]], [[113.285508, 23.139094], [113.291406, 23.139249]], [[113.298207, 23.120886], [113.303142, 23.129112]], [[113.283276, 23.133325], [113.281644, 23.132295]], [[113.293415, 23.133062], [113.293273, 23.125936]], [[113.283252, 23.137887], [113.293932, 23.137902]], [[113.289691, 23.128825], [113.289291, 23.12117]], [[113.2924, 23.13185], [113.291758, 23.138757]], [[113.292117, 23.13503], [113.29064, 23.125564]], [[113.288453, 23.129876], [113.291022, 23.129396]], [[113.285687, 23.138647], [113.287883, 23.130436]], [[113.28548, 23.128609], [113.278572, 23.128605]], [[113.288214, 23.132692], [113.290798, 23.135271]], [[113.291699, 23.13836], [113.287108, 23.133887]], [[113.286027, 23.133423], [113.28961, 23.12512]], [[113.282502, 23.128015], [113.284361, 23.133999]], [[113.287051, 23.134369], [113.297059, 23.128163]], [[113.290336, 23.135697], [113.299205, 23.140732]], [[113.286929, 23.129708], [113.284027, 23.136877]], [[113.284311, 23.141546], [113.288907, 23.129107]], [[113.28002, 23.124396], [113.283694, 23.124252]], [[113.287421, 23.135755], [113.290105, 23.139239]], [[113.293851, 23.134713], [113.296698, 23.13613]], [[113.289356, 23.126549], [113.287866, 23.129206]], [[113.283375, 23.130107], [113.288973, 23.132984]], [[113.283625, 23.131366], [113.280685, 23.130022]], [[113.28305, 23.138862], [113.280163, 23.145597]], [[113.282472, 23.132397], [113.291843, 23.132385]], [[113.29345, 23.136375], [113.296168, 23.126763]], [[113.289035, 23.139758], [113.285915, 23.137691]], [[113.285592, 23.130104], [113.287163, 23.133054]], [[113.289209, 23.135837], [113.291958, 23.126851]], [[113.289727, 23.127774], [113.288321, 23.125144]], [[113.290223, 23.136176], [113.296206, 23.132225]], [[113.28278, 23.125348], [113.28775, 23.129266]], [[113.294869, 23.133704], [113.303677, 23.13418]], [[113.275579, 23.142658], [113.277411, 23.137137]], [[113.289755, 23.137585], [113.289982, 23.134192]], [[113.282272, 23.139518], [113.290195, 23.133683]], [[113.282946, 23.132916], [113.283068, 23.135376]], [[113.283698, 23.132099], [113.286282, 23.128105]], [[113.281749, 23.123635], [113.293026, 23.131719]], [[113.291079, 23.128681], [113.295667, 23.128164]], [[113.293675, 23.132196], [113.290194, 23.130289]], [[113.288018, 23.136963], [113.285455, 23.132907]], [[113.282337, 23.131839], [113.279718, 23.138502]], [[113.291448, 23.135714], [113.293375, 23.132503]], [[113.283815, 23.135837], [113.285421, 23.127377]], [[113.281261, 23.134299], [113.285524, 23.130053]], [[113.289008, 23.133482], [113.287554, 23.131434]], [[113.282862, 23.143206], [113.285668, 23.132508]], [[113.287169, 23.1304], [113.280933, 23.12963]], [[113.28539, 23.119184], [113.289651, 23.12825]], [[113.292463, 23.134224], [113.295136, 23.138113]], [[113.279418, 23.135834], [113.284251, 23.134708]], [[113.285565, 23.125462], [113.290072, 23.13164]], [[113.286687, 23.137665], [113.286911, 23.137967]], [[113.290279, 23.130648], [113.291845, 23.132856]], [[113.300873, 23.116095], [113.300066, 23.11092]], [[113.289662, 23.133861], [113.288483, 23.139305]], [[113.285432, 23.13515], [113.281075, 23.135306]], [[113.287686, 23.131313], [113.285743, 23.130791]], [[113.282621, 23.129068], [113.290418, 23.136747]], [[113.285818, 23.135547], [113.288646, 23.132025]], [[113.289581, 23.139495], [113.289273, 23.125501]], [[113.294748, 23.137543], [113.302386, 23.130738]], [[113.297126, 23.141748], [113.295554, 23.136896]], [[113.285709, 23.138931], [113.284075, 23.144075]], [[113.290085, 23.138219], [113.291668, 23.13714]], [[113.283292, 23.129984], [113.289128, 23.129207]], [[113.285947, 23.137608], [113.290064, 23.133641]], [[113.295531, 23.138056], [113.292773, 23.13383]], [[113.288692, 23.127805], [113.287451, 23.129906]], [[113.295831, 23.133586], [113.293222, 23.137251]], [[113.292059, 23.121667], [113.296496, 23.124597]], [[113.29926, 23.127343], [113.295715, 23.128033]], [[113.282501, 23.129378], [113.284785, 23.13341]], [[113.289771, 23.126932], [113.293343, 23.129991]], [[113.288457, 23.131782], [113.287532, 23.133893]], [[113.286486, 23.145566], [113.288362, 23.15265]], [[113.284837, 23.131467], [113.286114, 23.123142]], [[113.288575, 23.147014], [113.293133, 23.14496]], [[113.29755, 23.129225], [113.293469, 23.133254]], [[113.285204, 23.134658], [113.290352, 23.132294]], [[113.289556, 23.136371], [113.291102, 23.130406]], [[113.287088, 23.130704], [113.290761, 23.128839]], [[113.276942, 23.129746], [113.281101, 23.130346]], [[113.286816, 23.133438], [113.292353, 23.134065]], [[113.280348, 23.135588], [113.284858, 23.127898]], [[113.289193, 23.140839], [113.28761, 23.134095]], [[113.290585, 23.138847], [113.287699, 23.129986]], [[113.284514, 23.12225], [113.287658, 23.123923]], [[113.288444, 23.137794], [113.289321, 23.135136]], [[113.288917, 23.132418], [113.282555, 23.125333]], [[113.290412, 23.13161], [113.292068, 23.128074]], [[113.293798, 23.133992], [113.291136, 23.129214]], [[113.292957, 23.129443], [113.296296, 23.127529]], [[113.285468, 23.129145], [113.289095, 23.123022]], [[113.293015, 23.126603], [113.290707, 23.131522]], [[113.289463, 23.131049], [113.284208, 23.134954]], [[113.296135, 23.13077], [113.297481, 23.128316]], [[113.287932, 23.132676], [113.29151, 23.131432]], [[113.284913, 23.134235], [113.282817, 23.128513]], [[113.288145, 23.130157], [113.291009, 23.132565]], [[113.285686, 23.138937], [113.286846, 23.13773]], [[113.285364, 23.131666], [113.293185, 23.131229]], [[113.281796, 23.122508], [113.29139, 23.127946]], [[113.297502, 23.133706], [113.29499, 23.134684]], [[113.291874, 23.13395], [113.292398, 23.132053]], [[113.293847, 23.140754], [113.296914, 23.137286]], [[113.284844, 23.140508], [113.286555, 23.136478]], [[113.287555, 23.130349], [113.285428, 23.13166]], [[113.293616, 23.131717], [113.295884, 23.123722]], [[113.288565, 23.132516], [113.289328, 23.139055]], [[113.281023, 23.137746], [113.284885, 23.140333]], [[113.28824, 23.129409], [113.295431, 23.138177]], [[113.295746, 23.138084], [113.298944, 23.137754]], [[113.294117, 23.125698], [113.296015, 23.125833]], [[113.300168, 23.129377], [113.296294, 23.1269]], [[113.288541, 23.136951], [113.285989, 23.134285]], [[113.292013, 23.133995], [113.284453, 23.134175]], [[113.291101, 23.128661], [113.296568, 23.130304]], [[113.290047, 23.128753], [113.295647, 23.136613]], [[113.288804, 23.129598], [113.29252, 23.124815]], [[113.286355, 23.127583], [113.283672, 23.127454]], [[113.297333, 23.130904], [113.3058, 23.132775]], [[113.288657, 23.122515], [113.288187, 23.12165]], [[113.290051, 23.116424], [113.292362, 23.128869]], [[113.28574, 23.137683], [113.287256, 23.131333]]]
        allLine = data


        //线构造函数
        function MakeLineFnc([...positionArr]) {
            this.geometry = {
                "type": "LineString",
                "coordinates": [...positionArr]
            }
        }
        // 点构造函数
        function MakeSpotFnc([...spotArr]) {
            this.geometry = {
                "type": "Point",
                "coordinates": [...spotArr]
            }
        }

        for (const line of allLine) {
            finalLine.push(new MakeLineFnc(line))
            finalSpot.push(new MakeSpotFnc(line[0]))
            finalSpot.push(new MakeSpotFnc(line[1]))
            // console.log(finalLine);
        }

        var LineSource = new window.Loca.GeoJSONSource({
            data: {
                "type": "FeatureCollection",
                "features": finalLine
            }
        });

        var Linelayer = new window.Loca.PulseLineLayer({
            // loca,
            zIndex: 11,
            opacity: 1,
            visible: true,
            zooms: [2, 22],
        });

        Linelayer.setStyle({
            altitude: 0,
            lineWidth: 2,
            headColor: '#eb2f96',
            trailColor: '#ffd6e7',
            interval: 0.5,
            duration: 5000,
        });
        Linelayer.setSource(LineSource);

        // 下方呼吸点层
        var scatter = new window.Loca.ScatterLayer({
            // loca,
            zIndex: 10,
            opacity: 0.5,
            visible: true,
            zooms: [2, 22],
        });
        var scatterGeo = new window.Loca.GeoJSONSource({
            data: {
                "type": "FeatureCollection",
                "features": finalSpot
            }
        });
        scatter.setSource(scatterGeo);
        scatter.setStyle({
            unit: 'meter',
            size: (_, feature) => {
                var size = 50;
                return [size, size];
            },
            borderWidth: 0,
            texture: 'https://a.amap.com/Loca/static/loca-v2/demos/images/breath_yellow.png',
            duration: 2000,
            animate: true,
        });
        // console.log(window.loca);
        window.loca.add(scatter)
        window.loca.add(Linelayer);

        window.loca.animate.start();
        setTimeout(() => {
            this.setState({ ableTurn: false })
        }, 1000);


    }

    setFlowPath = async (dataString) => {
        const response = await fetch(`http://39.98.41.126:31106/mainRoute/${dataString}`)
        const data = await response.json()

        for (let i = 0; i < data.length; i++) {
            window.pathSimplifierIns.setData(data);
        }
    }

    componentWillUnmount() {
        PubSub.unsubscribe(this.token)
    }


    render() {
        return (
            <div ref="container" className="container" id="map">
                <div className="left_nav">
                    <header>载客热点</header>
                    <ul ref="addressPrint">
                        <li>广东省广州市天河区xxx</li>
                        <li>广东省广州市天河区xxx</li>
                        <li>广东省广州市天河区xxx</li>
                        <li>广东省广州市天河区xxx</li>
                    </ul>
                </div>

                <div className="right_levelnav">
                    <div className="chooseTime" ref="chooseTime">
                        {/* <DatePicker onChange={this.onChangeTime} /> */}
                        <Datepick />
                    </div>
                    <div className="btn_flowDirection"><span className="title">流向展示</span> <Switch disabled={this.state.ableTurn} onChange={this.onChangeOpenFlow} /></div>
                    <div className="btn_hotGetIn"><span className="title">全部载客热点</span> <Switch onChange={this.onChangeOpenHot} /></div>
                    <div className="title">区域等级划分</div>
                    <div className="levelBox">
                        <ul className="level">
                            <li><span className="color"></span> <span className="level_words">等级一</span></li>
                            <li><span className="color"></span> <span className="level_words">等级二</span></li>
                            <li><span className="color"></span> <span className="level_words">等级三</span></li>
                            <li><span className="color"></span> <span className="level_words">等级四</span></li>
                            <li><span className="color"></span> <span className="level_words">等级五</span></li>
                        </ul>
                        <ul className="level2">
                            <li><span className="color"></span> <span className="level_words">等级六</span></li>
                            <li><span className="color"></span> <span className="level_words">等级七</span></li>
                            <li><span className="color"></span> <span className="level_words">等级八</span></li>
                            <li><span className="color"></span> <span className="level_words">等级九</span></li>
                            <li><span className="color"></span> <span className="level_words">等级十</span></li>
                        </ul>
                    </div>
                </div>

            </div>
        );
    }
}
