import React, { Component } from 'react'
import { Switch,Route,Redirect } from 'react-router'
import { NavLink } from 'react-router-dom'
import MyNavLink from './components/MyNavLink'
import Heatmap from './pages/Heatmap'
import Abnormal from './pages/Abnormal'
import Advertise from './pages/Advertise'
import PubSub from 'pubsub-js'
import Path from './pages/Path'
import RequireArea from './pages/RequireArea'
import BasicMap from './components/BasicMap'
import './App.css'
export default class App extends Component {
  componentDidMount() {
    let normalTheme = ()=>{
      let root = document.querySelector(':root');
      root.style.setProperty('--deepBack','#F2F3F3');
      root.style.setProperty('--ltBack','#EEE');
      root.style.setProperty('--text','#1E2020');
      root.style.setProperty('--btnAct','#BFBFBF');
      root.style.setProperty('--titleColor','#333');
      root.style.setProperty('--bodyColor','white');
      root.style.setProperty('--tableBack','#eaeaea');
      root.style.setProperty('--table-head','#c0c0c0');
      root.style.setProperty('--tableText','#1E2020');
      root.style.setProperty('--listActText','#292929');
      root.style.setProperty('--reserveBg','black');
      root.style.setProperty('--hoverBtn','#bfbfbf');
      root.style.setProperty('--deepGrey','#999');
    }
    let darkTheme = ()=>{
      let root = document.querySelector(':root');
      root.style.setProperty('--deepBack','#292929');
      root.style.setProperty('--ltBack','#303030');
      root.style.setProperty('--text','rgba(255,255,255,0.87)');
      root.style.setProperty('--btnAct','black');
      root.style.setProperty('--titleColor','#03DAC5');
      root.style.setProperty('--bodyColor','black');
      root.style.setProperty('--tableBack','#1f1f1f');
      root.style.setProperty('--table-head','#303030');
      root.style.setProperty('--tableText','rgba(255,255,255,0.6)');
      root.style.setProperty('--listActText','rgba(255,255,255,0.87)');
      root.style.setProperty('--reserveBg','white');
      root.style.setProperty('--hoverBtn','#6a6a6a');
      root.style.setProperty('--deepGrey','#292929');
    }
    let changeTheme = ()=>{
      
      if(window.localStorage.theme === 'dark'){
        darkTheme();

      }else{
        normalTheme();
        
    }
    
    }
    changeTheme()
    let themeChg = document.getElementById('theme-change');
    themeChg.onclick = ()=>{
      if(window.localStorage.theme === 'dark'){
        normalTheme();
        window.localStorage.setItem('theme','normal');
      }else{
        darkTheme();
        window.localStorage.setItem('theme','dark');
      }
      PubSub.publish('color',window.localStorage.theme);
    }
  }
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
            <div id="theme-change" className="noActive">主题切换</div>
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
