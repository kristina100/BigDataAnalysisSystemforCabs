import React, { Component } from 'react'
import './index.css'

export default class Car extends Component {

    deleteThis = (carName) => {
        this.props.deleteCar(carName)
    }

    render() {
        const {carName, pathDate, color} = this.props
        return (
            <div id="carController"style={{borderColor:color}}>
                <span id="carName">{carName}</span>
                <span id="pathDate">{pathDate}</span>
                <button id="deleteBtn"onClick={()=>{this.deleteThis(carName)}}>×</button>
            </div>
        )
    }
}
