import React, { Component } from 'react';
import PubSub from 'pubsub-js'
import axios from 'axios';
import './index.css'

import Datepick from './Datepick'

import { Switch } from 'antd';
import { message } from 'antd';


let flag = 0;
var map
let flowColor = [
    "#69c0ff", "#ff7875", "#a0d911", "#ffc53d", "#b37feb", "#0099c6", "#dd4477", "#66aa00",
    "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707",
    "#651067", "#329262", "#5574a6", "#3b3eac"
];

export default class Rightcontent extends Component {

    state = ({
        isClick: true,
        loading: true,
        ableTurn: false,
        dataPrint: null,
        pointSimplifierIns: null,
        mainFlowBtn: false,
        allFlowBtn: false,
        flowDate: '',
    })


    warning = (msg) => {
        message.warning(msg, 2);
    };


    // 根据流向开关得状态控制是否显示时间输入框
    onChangeOpenFlow = (checked) => {
        let circleArr = [];

        // const { chooseTime } = this.refs;

        // checked ? chooseTime.style = 'visibility: visible' : chooseTime.style = 'visibility: hidden';
        if (checked) {
            this.setState({ mainFlowBtn: true })
            if (this.state.flowDate === '') {
                this.warning('时间不能为空,请在右侧选择流向图的时间')
            } else {
                this.setFlowPath(this.state.flowDate)
            }
            // 绘制需求区域
            let requireColors = ['#E6556F', '#E3843C', '#EEC055', '#1EC78A', '#4E72E2', '#E24ED7', '#71E24E', '#7F4EE2', '#4ECEE2', '#BB4EE2']
            for (let i = 0; i < this.state.radiusArr.length; ++i) {

                var circle = new window.AMap.Circle({
                    center: [parseFloat(this.state.latlngArr[i].split(',')[0]), parseFloat(this.state.latlngArr[i].split(',')[1])],
                    radius: parseFloat(this.state.radiusArr[i]) / 8,
                    fillColor: requireColors[i],   // 圆形填充颜色
                    strokeColor: '#fff', // 描边颜色
                    strokeWeight: 1, // 描边宽度
                    fillOpacity: 0.4
                });;
                circleArr.push(circle);
                map.add(circle);
            }
            this.setState({ circleArr: circleArr });
        }
        if (!checked) {
            this.setState({ mainFlowBtn: false })
            this.state.circleArr.map((item) => {
                item.hide();
            })
            window.pathSimplifierIns.setData([]);
        }
    }

    onChangeOpenAllFlow = (checked) => {
        if (checked) {
            this.setState({ allFlowBtn: true })
            if (this.state.flowDate === '') {
                this.warning('时间不能为空,请在右侧选择流向图的时间')
                return;
            }
            this.creatLoca()
            flag = 1
            this.allFlowShow(this.state.flowDate)
        }

        if (!checked) {
            this.setState({ allFlowBtn: false })
            if (flag === 1) {
                if (window.loca.layers.length !== 0) {
                    window.loca.destroy();
                }
            }
        }
    }

    // 根据state中的数据与开关的状态来展示载客热点
    onChangeOpenHot = (checked) => {
        this.setState({ isClick: !checked });
        const { dataPrint, pointSimplifierIns } = this.state;
        checked ? pointSimplifierIns.setData(dataPrint) : pointSimplifierIns.setData(null);
    }



    componentDidMount() {

        let key = 'updateData';
        // this.setState({ loading: true });
        message.loading({ content: '正在渲染', key });
        let flagChange = 0;
        let timeArr = [];
        let initDataPrint;
        let addressPrint = [];
        let geocoder;
        const { container } = this.refs;
        let that = this; // 记录此时this的指向，指向实例
        //订阅流向图时间

        let initData = new Promise(function (resolve, reject) {

            map = new window.AMap.Map(container, {
                center: [113.364931, 23.275388],
                zoom: 8.8,
                resizeEnable: true, // 是否监控地图容器尺寸变化
                mapStyle: 'amap://styles/whitesmoke'

            });

            // 拿到热点数据
            axios.get(`http://39.98.41.126:31100/getHotPoints`).then(
                response => {
                    if (response.data.data2) {
                        initDataPrint = response.data.data2.split('\n');
                        initDataPrint = initDataPrint.filter((item) => {
                            return item != ''
                        })
                        addressPrint = response.data.data1;
                        axios.get(` http://39.98.41.126:31100/getCenterRadiusForMobile`).then(
                            response => {
                                console.log(response.data);
                                that.setState({ loading: false });
                                message.success({ content: '渲染完成！', key, duration: 1.5 })
                                let radiusArr = [];
                                let latlngArr = [];
                                let dataArr = response.data.data;
                                dataArr.map((item) => {
                                    radiusArr.push(item.radius)
                                    latlngArr.push(item.longitude + ',' + item.latitude);
                                })
                                resolve({ addressPrint, initDataPrint, radiusArr, latlngArr });

                            }
                        )
                    }

                }
            )
        })

        // 加载圆形自定义区域
        initData.then(function (data) {

            that.token = PubSub.subscribe('flowDate', (_, stateObj) => {
                that.setState({ flowDate: stateObj.flowDate })
                if (that.state.mainFlowBtn) {
                    that.setState({ ableTurn: true })
                    that.setFlowPath(stateObj.flowDate)
                }

                if (that.state.allFlowBtn) {
                    if (flag === 1) {
                        if (window.loca.layers.length !== 0) {
                            window.loca.destroy();
                        }
                    }
                    that.creatLoca()
                    flag = 1;
                    that.allFlowShow(that.state.flowDate)
                }
                setTimeout(() => {
                    that.setState({ ableTurn: false })
                }, 1000);

            })

            that.setState({ dataPrint: data.initDataPrint, addressPrint: data.addressPrint, radiusArr: data.radiusArr, latlngArr: data.latlngArr })


            const { addressPrint } = that.refs;
            if (that.state.addressPrint) {
                for (let i = 0; i < that.state.addressPrint.length; ++i) {
                    let li = document.createElement('li');
                    li.innerHTML = that.state.addressPrint[i];
                    addressPrint.appendChild(li)
                }
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




            // ui组件初始化界面(海量点标记 + 行政区域划分)
            function initPage(PointSimplifier, DistrictExplorer, $) {
                var pointSimplifierIns;
                var pointsColor = [
                    '#E6556F', '#E3843C', '#EEC055', '#1EC78A', '#4E72E2', '#E24ED7', '#71E24E', '#7F4EE2', '#4ECEE2', '#BB4EE2'
                ]
                let currentAreaNode = null;
                // 海量数据点
                for (let i = 0; i < 10; ++i) {
                    pointSimplifierIns = new PointSimplifier({
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
                                content: PointSimplifier.Render.Canvas.getImageContent(
                                    '../../../hotpoints.png',
                                    function onload() {
                                        pointSimplifierIns.renderLater();
                                    },
                                    function onerror(e) {
                                        message.warning('图片加载失败！');
                                    }
                                ),
                                // unit: 'meter',// 默认px，可不填
                                width: 20,
                                height: 20,
                                // offset: ['-50%', '100%'],
                                fillStyle: null,
                                strokeStyle: null
                                // fillStyle: pointsColor[i]
                            },
                            //鼠标hover时的title信息
                            hoverTitleStyle: {
                                position: 'top'
                            }
                        }
                    })
                };
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
                    that.setState({ isClick: true })
                    Switch.__ANT_SWITCH = false;
                    flagChange++;
                    let time1 = toRealTime(timeArr[timeArr.length - 1]);
                    let time2 = toRealTime(timeArr[timeArr.length - 2]);
                    const { name, adcode } = feature.properties;
                    let data = [];
                    timeArr.push(Date.now());

                    if (time1[0] === time2[0] && time1[1] === time2[1] && time1[2] - time2[2] <= 0.5 && time1[0] !== NaN && time2[0] !== NaN) {
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
                            if (status === 'complete' && result.info === 'OK') {
                                if (Number(result.regeocode.addressComponent.adcode) === adcode) {
                                    newDataPrint.push(item);
                                    callback(newDataPrint);
                                } else if (newDataPrint.length === 0) (
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
                            fillOpacity: isHover ? 0.3 : 0
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
                        fillOpacity: 0, //填充透明度
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
            //                     return item !== ''
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
        var loca = new window.Loca.Container({
            map,
            zIndex: 120,
        });

        window.loca = loca
    }

    allFlowShow = async (dateString) => {
        let finalLine = [],
            finalSpot = [],
            allLine = [];
        const response = await fetch(`http://39.98.41.126:31100/getFlow/2017-02-01`)
        const data = await response.json()
        console.log(data);

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
        window.loca.add(scatter)
        window.loca.add(Linelayer);

        window.loca.animate.start();

    }

    setFlowPath = async (dataString) => {
        const response = await fetch(`http://39.98.41.126:31106/mainRoute/${dataString}`)
        const data = await response.json()

        for (let i = 0; i < data.length; i++) {
            window.pathSimplifierIns.setData(data);
        }
    }

    componentWillUnmount() {
        PubSub.unsubscribe(this.token);
        this.setState = (state, callback) => {
            return;
        }
    }

    render() {
        return (
            <div ref="container" className="container" id="map">
                <div id="tips-boxs">点击展示区域内部载客热点</div>
                <div className="left_nav">
                    <header>载客热点</header>
                    <ul ref="addressPrint" className="addressPrint">
                        {/* <li>广东省广州市天河区xxx</li>
                        <li>广东省广州市天河区xxx</li>
                        <li>广东省广州市天河区xxx</li>
                        <li>广东省广州市天河区xxx</li>
                        <li>广东省广州市天河区xxx</li>
                        <li>广东省广州市天河区xxx</li>
                        <li>广东省广州市天河区xxx</li>
                        <li>广东省广州市天河区xxx</li> */}
                    </ul>
                </div>

                <div className="right_levelnav">
                    <div className="chooseTime" ref="chooseTime">
                        {/* <DatePicker onChange={this.onChangeTime} /> */}
                        <Datepick />
                    </div>
                    <div className="btn_flowDirection"><span className="title">主流向展示</span> <Switch disabled={this.state.ableTurn || this.state.loading} onChange={this.onChangeOpenFlow} /></div>
                    <div className="btn_flowDirection"><span className="title">全流向展示</span> <Switch disabled={this.state.ableTurn || this.state.loading} onChange={this.onChangeOpenAllFlow} /></div>
                    <div className="btn_hotGetIn"><span className="title">全部载客热点</span> <Switch disabled={this.state.loading} onChange={this.onChangeOpenHot} checked={!this.state.isClick} /></div>
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
