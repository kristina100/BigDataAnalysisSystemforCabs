import React, { Component } from 'react'
import PubSub from 'pubsub-js'
import Car from './Car'
import Datepick from './Datepick'
<<<<<<< HEAD
import { message } from 'antd'
=======
import { message, Input } from 'antd'
>>>>>>> 909892b1b180361ac26c62fe532772ff25415da9
import './index.css'

var dateInput = ''

export default class controller extends Component {

    state = {
<<<<<<< HEAD
        carInfos: []
=======
        carInfos: [],
        isFinding:false
>>>>>>> 909892b1b180361ac26c62fe532772ff25415da9
    }

    componentDidMount() {
        this.token = PubSub.subscribe('pathDate', (_, stateObj) => {
            this.setState(stateObj)
        })
        this.token2 = PubSub.subscribe('existCar', (_, existObj) => {
            this.setState(existObj)
            this.checkCar(existObj.exist);
        })
<<<<<<< HEAD
    }

=======
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

>>>>>>> 909892b1b180361ac26c62fe532772ff25415da9
    findCar = () => {
        if (this.state.carInfos.length === 5) {
            message.warning('最多能够同时查看五辆出租车的路径');
            return;
        }
<<<<<<< HEAD
        // console.log(this.refs.carName.value);

        PubSub.publish('setCar', { finding: true, delete: false, carName: this.refs.carName.value, pathDate: this.state.pathDate })
    }

    checkCar = (check) => {
        let name = this.refs.carName.value
=======

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
>>>>>>> 909892b1b180361ac26c62fe532772ff25415da9
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
<<<<<<< HEAD
            // console.log(newCarInfo); 
            this.refs.carName.value = ''

=======
>>>>>>> 909892b1b180361ac26c62fe532772ff25415da9
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
<<<<<<< HEAD
        console.log(dIndex);
        carInfos.splice(dIndex, 1)
        console.log(carName);
        console.log(pathDate);
        // console.log(dIndex);
        // console.log(carInfos);
=======
        carInfos.splice(dIndex, 1)
>>>>>>> 909892b1b180361ac26c62fe532772ff25415da9
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
<<<<<<< HEAD
=======
        PubSub.unsubscribe(this.token3)
>>>>>>> 909892b1b180361ac26c62fe532772ff25415da9
    }

    render() {
        const { carInfos } = this.state
        var colors = [
<<<<<<< HEAD
            "#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00",
=======
            "#4e72e2", "#1ec78a", "#eec055", "#e3843c", "#e6556f", "#0099c6", "#dd4477", "#66aa00",
>>>>>>> 909892b1b180361ac26c62fe532772ff25415da9
            "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707",
            "#651067", "#329262", "#5574a6", "#3b3eac"
        ];
        return (
            <div id="control">
<<<<<<< HEAD
                <div id="findInput">
                    <span id="firstName">粤A</span>
                    <input type="text" id="findCar" ref="carName" placeholder="请输入车牌号" maxLength="5" onKeyUp={this.noWord} autoComplete="off" />
                </div>
                {/* <input type="date" ref="pathDate"/> */}
                <Datepick />
                <span id="findBtn" onClick={() => { this.findCar() }}>查询车辆</span>
=======
                <div id="controlBox">
                <div id="findInput">
                    <span id="firstName"><img id="search" src={'../../search.svg'}></img>粤A</span>
                    <Input type="text" id="findCar" ref="carName" placeholder="请输入车牌号" maxLength="5" onKeyUp={this.noWord} autoComplete="off" disabled={this.state.isFinding ? true : false} onChange={ event => this.handleInput(event)}/>
                </div>
                {/* <input type="date" ref="pathDate"/> */}
                <Datepick/>
                <span id="findBtn" onClick={() => { this.findCar() }}>确定</span>
>>>>>>> 909892b1b180361ac26c62fe532772ff25415da9
                {
                    carInfos.map((carInfos, index) => {
                        return <Car key={index} {...carInfos} deleteCar={this.deleteCar} color={colors[index]} />
                    })
                }
<<<<<<< HEAD
=======
                </div>
>>>>>>> 909892b1b180361ac26c62fe532772ff25415da9
            </div>
        )
    }
}
