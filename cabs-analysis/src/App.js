import React, { Component } from 'react'
import { Switch,Route,Redirect } from 'react-router'
import MyNavLink from './components/MyNavLink'
import Heatmap from './pages/Heatmap'
import Abnormal from './pages/Abnormal'
import Advertise from './pages/Advertise'
import Path from './pages/Path'
import RequireArea from './pages/RequireArea'
import './App.css'
export default class App extends Component {
  render() {
    return (
      <div id="wrapper">
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
        <div id="main">
          <Switch>
            <Route path="/heatmap" component={Heatmap}/>
            <Route path="/requirearea" component={RequireArea}/>
            <Route path="/path" component={Path}/>
            <Route path="/abnormal" component={Abnormal}/>
            <Route path="/advertise" component={Advertise}/>
            <Redirect to="/show"/>
          </Switch>
        </div>
      </div>
    )
  }
}
