import React, { Component } from 'react'
import './index.css'

export default class Car extends Component {

    deleteThis = (carName,pathDate) => {
        this.props.deleteCar(carName,pathDate)
    }

    render() {
        const {carName, pathDate, color} = this.props
        return (
            <div id="carController"style={{borderColor:color,border:'1'}}>
                <span id="carName">{carName}</span>
                <span id="pathDate">{pathDate}</span>
                {/* <button id="deleteBtn"onClick={()=>{this.deleteThis(carName)}}>×</button> */}
                <svg onClick={()=>{this.deleteThis(carName,pathDate)}} t="1629084532531" className="icon deleteBtn" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2051" width="28" height="28"><path d="M512.345877 903.163911c-216.416981 0-391.856689-175.49599-391.856689-391.856689s175.439708-391.856689 391.856689-391.856689 391.856689 175.49599 391.856689 391.856689S728.762859 903.163911 512.345877 903.163911L512.345877 903.163911zM512.345877 63.470567c-247.345388 0-447.836655 200.407356-447.836655 447.836655S264.999466 959.143876 512.345877 959.143876 960.182532 758.736521 960.182532 511.307222 759.691265 63.470567 512.345877 63.470567L512.345877 63.470567zM672.363338 351.20585c-11.028171-10.915607-28.857235-10.915607-39.885406 0l-120.299877 120.356159L393.612683 352.885096c-10.94426-10.915607-28.689413-10.915607-39.577391 0-10.94426 10.915607-10.94426 28.829606 0 39.745213l118.564349 118.396527L353.195158 630.543883c-10.999518 10.916631-10.999518 28.829606 0 40.025599 11.028171 10.915607 28.885887 10.915607 39.913035 0l119.404484-119.516024 118.564349 118.676913c10.94426 10.915607 28.689413 10.915607 39.606043 0 10.94426-10.915607 10.94426-28.829606 0-39.745213l-118.593002-118.396527 120.272247-120.356159C683.362856 380.035456 683.362856 362.401844 672.363338 351.20585L672.363338 351.20585z" fill="#c7c7c7" p-id="2052"></path></svg>
            </div>
        )
    }
}
