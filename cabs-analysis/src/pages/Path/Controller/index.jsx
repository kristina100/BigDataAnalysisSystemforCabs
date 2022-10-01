import React, { Component } from 'react'
import PubSub from 'pubsub-js'
import Car from './Car'
import Datepick from './Datepick'
import { message, Input } from 'antd'
import './index.css'

var dateInput = ''

export default class controller extends Component {

    state = {
        carInfos: [],
        isFinding:false
    }

    componentDidMount() {
        this.token = PubSub.subscribe('pathDate', (_, stateObj) => {
            this.setState(stateObj)
        })
        this.token2 = PubSub.subscribe('existCar', (_, existObj) => {
            this.setState(existObj)
            this.checkCar(existObj.exist);
        })
        this.token3 = PubSub.subscribe('inputAble', (_, stateObj) => {
            this.setState(stateObj)
        })
    }

    handleInput = (event)=>{
        if(event && event.target && event.target.value){
          let id = event.target.value;
          this.setState(()=>({carId:id }))
        }
      }

    findCar = () => {
        if (this.state.carInfos.length === 5) {
            message.warning('最多能够同时查看五辆出租车的路径');
            return;
        }

        for(let i = 0; i < this.state.carInfos.length; i++){
            if('粤A'+this.state.carId === this.state.carInfos[i].carName){
                if(this.state.pathDate === this.state.carInfos[i].pathDate)
                {
                    message.warning('请勿重复查询该车同一天行驶轨迹');
                    return;
                }

            }
        }
        PubSub.publish('setCar', { finding: true, delete: false, carName: this.state.carId, pathDate: this.state.pathDate })
    }

    checkCar = (check) => {
        let name = this.state.carId
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
        }
    }

    deleteCar = (carName,pathDate) => {
        let { carInfos } = this.state
        let dIndex
        for (let i = 0; i < carInfos.length; i++) {
            if (carName === carInfos[i].carName && pathDate === carInfos[i].pathDate) {
                dIndex = i;
                break ;
            }
        }
        carInfos.splice(dIndex, 1)
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
        PubSub.unsubscribe(this.token3)
    }

    render() {
        const { carInfos } = this.state
        var colors = [
            "#4e72e2", "#1ec78a", "#eec055", "#e3843c", "#e6556f", "#0099c6", "#dd4477", "#66aa00",
            "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707",
            "#651067", "#329262", "#5574a6", "#3b3eac"
        ];
        return (
            <div id="control">
                <div id="controlBox">
                <div id="findInput">
                    <span id="firstName"><img id="search" src={'../../search.svg'}></img>粤A</span>
                    <Input type="text" id="findCar" ref="carName" placeholder="请输入车牌号" maxLength="5" onKeyUp={this.noWord} autoComplete="off" disabled={this.state.isFinding ? true : false} onChange={ event => this.handleInput(event)}/>
                </div>
                <Datepick/>
                <span id="findBtn" onClick={() => { this.findCar() }}>确定</span>
                {
                    carInfos.map((carInfos, index) => {
                        return <Car key={index} {...carInfos} deleteCar={this.deleteCar} color={colors[index]} />
                    })
                }
                </div>
            </div>
        )
    }
}
