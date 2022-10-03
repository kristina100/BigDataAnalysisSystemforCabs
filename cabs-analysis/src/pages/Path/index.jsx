import React, { Component } from 'react'
import Map from './Map'
import Controller from './Controller'

export default class App extends Component {
    render() {
        return (
            <div className="map-ct">
                <Controller />
                <Map />
            </div>
        )
    }
}
