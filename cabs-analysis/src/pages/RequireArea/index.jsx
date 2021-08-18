import React, { Component } from 'react';
import axios from 'axios';
import './index.css'
import { isTSExpressionWithTypeArguments } from '@babel/types';
import { func } from 'prop-types';
import { flushSync } from 'react-dom';
import MyNavLink from '../../components/MyNavLink';

import { Switch } from 'antd';
import { DatePicker, Space, message } from 'antd';


function onChangeTime(date, dateString) {
    console.log(date, dateString);
}

export default class Rightcontent extends Component {

    state = ({
        dataPrint: null,
        pointSimplifierIns: null
    })


    warning = (msg) => {
        message.warning(msg, 2);
    };




    // 根据流向开关得状态控制是否显示时间输入框
    onChangeOpenFlow = (checked) => {
        const { chooseTime } = this.refs;
        checked ? chooseTime.style = 'visibility: visible' : chooseTime.style = 'visibility: hidden';
        if (checked) { this.warning('请您在右侧选择流向图的时间') }
    }

    // 根据state中的数据与开关的状态来展示载客热点
    onChangeOpenHot = (checked) => {
        const { dataPrint, pointSimplifierIns } = this.state;
        checked ? pointSimplifierIns.setData(dataPrint) : pointSimplifierIns.setData(null);
    }

    componentDidMount() {

        let circleData = { "113.33085770273631, 23.14412365284972": 9865.998253395317, "113.27855780013734, 23.128367111649794": 4041.3426961830696, "113.32146935484826, 23.106662663168706": 8684.534007164251, "113.40117706518718, 23.123214006229343": 4722.332476499621, "113.25019001320405, 23.15818645574991": 6443.509823485375, "113.30712665579317, 22.996942543368675": 4941.25538460613, "113.27777220955363, 23.21131444325503": 1219.2760558275137, "113.27348812437376, 23.09112787687527": 7796.686718765689, "113.242374477253, 23.1154384664252": 8289.56939304359, "113.30674584736516, 23.38053648285072": 4616.6948556122206 }

        let flagChange = 0;
        let timeArr = [];
        let initDataPrint;
        let addressPrint = [];
        let geocoder;
        const { container } = this.refs;
        let map;
        let that = this; // 记录此时this的指向，指向实例
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
            console.log(data);

            that.setState({ dataPrint: data.initDataPrint, addressPrint: data.addressPrint })
            console.log(that.state);

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

            });


            // ui组件初始化界面(海量点标记 + 行政区域划分)
            function initPage(PointSimplifier, DistrictExplorer, $) {
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

                // 绘制父级区域
                //绘制父区域
                districtExplorer.renderParentFeature(areaNode, {
                    cursor: 'pointer',
                    bubble: true,
                    strokeColor: 'black', //线颜色
                    strokeOpacity: 1, //线透明度
                    strokeWeight: 1, //线宽
                    fillColor: areaNode.getSubFeatures().length ? null : colors[0], //填充色
                    fillOpacity: 0.35, //填充透明度
                });
            }
        })





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
                    <div className="chooseTime" ref="chooseTime"><DatePicker onChange={onChangeTime} /></div>
                    <div className="btn_flowDirection"><span className="title">流向展示</span> <Switch onChange={this.onChangeOpenFlow} /></div>
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

