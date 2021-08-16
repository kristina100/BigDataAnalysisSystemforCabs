import React, { Component } from 'react'
import PubSub from 'pubsub-js'
import Car from './Car'
import Datepick from './Datepick'
import { message } from 'antd'
import './index.css'

var dateInput = ''

export default class controller extends Component {

    state = {
        carInfos: []
    }

    componentDidMount() {
        this.token = PubSub.subscribe('pathDate', (_, stateObj) => {
            this.setState(stateObj)
        })
        this.token2 = PubSub.subscribe('existCar', (_, existObj) => {
            this.setState(existObj)
            this.checkCar(existObj.exist);
        })
    }

    findCar = () => {
        if (this.state.carInfos.length === 5) {
            message.warning('最多能够同时查看五辆出租车的路径');
            return;
        }
        // console.log(this.refs.carName.value);

        PubSub.publish('setCar', { finding: true, delete: false, carName: this.refs.carName.value, pathDate: this.state.pathDate })
    }

    checkCar = (check) => {
        let name = this.refs.carName.value
        if (check) {
            let newCarObj = {
                carName: '粤A' + name,
                pathDate: this.state.pathDate
            }
            const { carInfos } = this.state
            //追加
            const newCarInfo = [...carInfos, newCarObj]
            //更新
            this.setState({ carInfos: newCarInfo })
            // console.log(newCarInfo); 
            this.refs.carName.value = ''

        }
    }

    deleteCar = (carName) => {
        let { carInfos } = this.state
        let dIndex
        for (let i = 0; i < carInfos.length; i++) {
            if (carName === carInfos[i].carName) {
                dIndex = i;
            }
        }
        // console.log(dIndex);
        carInfos.splice(dIndex, 1)
        // console.log(carName);
        // console.log(dIndex);
        // console.log(carInfos);
        this.setState({ carInfos: carInfos })
        PubSub.publish('setCar', { delete: true, finding: false, deleteIndex: dIndex })
    }

    noWord = (e) => {
        if (e.target.value.length <= 5) {
            e.target.value = e.target.value.replace(/[^\w_]/g, '')
        }
    }

    componentWillUnmount() {
        PubSub.unsubscribe(this.token)
        PubSub.unsubscribe(this.token1)
        PubSub.unsubscribe(this.token2)
    }

    render() {
        const { carInfos } = this.state
        var colors = [
            "#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00",
            "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707",
            "#651067", "#329262", "#5574a6", "#3b3eac"
        ];
        return (
            <div id="control">
                <div id="findInput">
                    <span id="firstName">粤A</span>
                    <input type="text" id="findCar" ref="carName" placeholder="请输入车牌号" maxLength="5" onKeyUp={this.noWord} />
                </div>
                <div>查询日期</div>
                {/* <input type="date" ref="pathDate"/> */}
                <Datepick />
                <button onClick={() => { this.findCar() }}>查询车辆</button>
                {
                    carInfos.map((carInfos, index) => {
                        return <Car key={index} {...carInfos} deleteCar={this.deleteCar} color={colors[index]} />
                    })
                }
            </div>
        )
    }
}
