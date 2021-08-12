import React, { Component } from 'react'
import MyNavLink from './components/MyNavLink'
import './App.css'
export default class App extends Component {
  render() {
    return (
      <div>
        <div id="header-ct">
          <div id="header">
            <div id="logo">logo</div>
            
            <MyNavLink to="/heatmap" children="热力图"/>
            <MyNavLink to="/requirearea" children="需求区域"/>
            <MyNavLink to="/path" children="行驶轨迹"/>
            <MyNavLink to="/abnormal" children="异常情况"/>
            <MyNavLink to="/advertise" children="广告位置推荐"/>
          </div>  
        </div>  

      </div>
    )
  }
}
