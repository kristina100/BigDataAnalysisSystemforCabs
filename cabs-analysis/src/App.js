import React, { Component } from 'react'
import { Switch,Route,Redirect } from 'react-router'
import { NavLink } from 'react-router-dom'
import MyNavLink from './components/MyNavLink'
import Heatmap from './pages/Heatmap'
import Abnormal from './pages/Abnormal'
import Advertise from './pages/Advertise'
import Path from './pages/Path'
import RequireArea from './pages/RequireArea'
import BasicMap from './components/BasicMap'
import './App.css'
export default class App extends Component {
  render() {
    return (
      <div id="wrapper">
        <div id="header-ct">
          <div id="header">
            <NavLink to="/index" id="logo"/>          
            <MyNavLink to="/heatmap" children="热力图示"/>
            <MyNavLink to="/requirearea" children="需求区域"/>
            <MyNavLink to="/path" children="行驶轨迹"/>
            <MyNavLink to="/abnormal" children="异常情况"/>
            <MyNavLink to="/advertise" children="预测分析"/>
          </div>  
        </div>  
        <div id="main">
          <Switch>
            <Route path="/index" component={BasicMap}/>
            <Route path="/heatmap" component={Heatmap}/>
            <Route path="/requirearea" component={RequireArea}/>
            <Route path="/path" component={Path}/>
            <Route path="/abnormal" component={Abnormal}/>
            <Route path="/advertise" component={Advertise}/>
            <Redirect to="/index"/>
          </Switch>
        </div>
      </div>
    )
  }
}
