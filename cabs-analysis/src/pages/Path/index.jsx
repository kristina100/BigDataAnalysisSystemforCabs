import React, { Component } from 'react'
import Map3 from './components/Map3'
import Controller from './components/Controller'
// import Map from './components/Map'

export default class App extends Component {
    render() {
        return (
            <div>
                <Controller/>
                <Map3/>
            </div>
        )
    }
}
